import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from './database';
import { transformOperation } from './utils';

const router = express.Router();

// Create operation table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS operations (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    status TEXT DEFAULT 'pending',
    total_amount REAL NOT NULL DEFAULT 0,
    paid_amount REAL DEFAULT 0,
    notes TEXT,
    promised_date TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
  )
`);

// Create operation_shoes table for the many-to-many relationship
db.exec(`
  CREATE TABLE IF NOT EXISTS operation_shoes (
    id TEXT PRIMARY KEY,
    operation_id TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT,
    notes TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (operation_id) REFERENCES operations (id)
  )
`);

// Create operation_services table for the many-to-many relationship
db.exec(`
  CREATE TABLE IF NOT EXISTS operation_services (
    id TEXT PRIMARY KEY,
    operation_shoe_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    price REAL NOT NULL,
    notes TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (operation_shoe_id) REFERENCES operation_shoes (id),
    FOREIGN KEY (service_id) REFERENCES services (id)
  )
`);

// Get all operations
router.get('/', (req, res) => {
  try {
    const operations = db.prepare(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `).all();
    res.json(operations.map(transformOperation));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch operations' });
  }
});

// Get operation by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const operation = db.prepare(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `).get(id);
    
    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    res.json(transformOperation(operation));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch operation' });
  }
});

// Create new operation
router.post('/', (req, res) => {
  try {
    const { customerId, shoes, notes, promisedDate } = req.body;
    const now = new Date().toISOString();
    
    // Start transaction
    const transaction = db.transaction(() => {
      // Create operation
      const operationId = uuidv4();
      db.prepare(`
        INSERT INTO operations (
          id, customer_id, notes, promised_date,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(operationId, customerId, notes, promisedDate, now, now);
      
      // Add shoes and services
      let totalAmount = 0;
      
      shoes.forEach((shoe: any) => {
        const shoeId = uuidv4();
        db.prepare(`
          INSERT INTO operation_shoes (
            id, operation_id, category, color, notes,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          shoeId, operationId, shoe.category, shoe.color, shoe.notes,
          now, now
        );
        
        shoe.services.forEach((service: any) => {
          const serviceAmount = service.price * (service.quantity || 1);
          totalAmount += serviceAmount;
          
          db.prepare(`
            INSERT INTO operation_services (
              id, operation_shoe_id, service_id,
              quantity, price, notes,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            uuidv4(), shoeId, service.id,
            service.quantity || 1, service.price, service.notes,
            now, now
          );
        });
      });
      
      // Update operation total
      db.prepare(`
        UPDATE operations
        SET total_amount = ?
        WHERE id = ?
      `).run(totalAmount, operationId);
      
      return operationId;
    });
    
    // Get created operation
    const operation = db.prepare(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `).get(transaction());
    
    res.status(201).json(transformOperation(operation));
  } catch (error) {
    res.status(500).json({ error: 'Failed to create operation' });
  }
});

// Update operation status
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const now = new Date().toISOString();
    
    const setClauses = Object.keys(updates)
      .map(key => {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        return `${dbKey} = ?`;
      })
      .concat(['updated_at = ?'])
      .join(', ');
    
    const values = [...Object.values(updates), now, id];
    
    db.prepare(`
      UPDATE operations
      SET ${setClauses}
      WHERE id = ?
    `).run(...values);
    
    const operation = db.prepare(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `).get(id);
    
    res.json(transformOperation(operation));
  } catch (error) {
    res.status(500).json({ error: 'Failed to update operation' });
  }
});

export default router;
