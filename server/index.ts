import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import db from './database';
import operationsRouter from './operations';
import { transformCustomer, transformOperation, transformService } from './utils';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Use operations router
app.use('/api/operations', operationsRouter);

// Customer endpoints
app.get('/api/customers', (req, res) => {
  try {
    const customers = db.prepare(`
      SELECT * FROM customers
      WHERE status = 'active'
      ORDER BY name ASC
    `).all();
    res.json(customers.map(transformCustomer));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', (req, res) => {
  try {
    const { 
      name, phone, email = '', address = '', notes = '', 
      status = 'active', totalOrders = 0, totalSpent = 0, 
      lastVisit = new Date().toISOString(), 
      loyaltyPoints = 0 
    } = req.body;
    
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO customers (
        id, name, phone, email, address, notes, status,
        total_orders, total_spent, last_visit, loyalty_points,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, name, phone, email, address, notes, status,
      totalOrders, totalSpent, lastVisit, loyaltyPoints,
      now, now
    );

    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.status(201).json(transformCustomer(customer));
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.put('/api/customers/:id', (req, res) => {
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
      UPDATE customers
      SET ${setClauses}
      WHERE id = ?
    `).run(...values);

    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.json(transformCustomer(customer));
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.delete('/api/customers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    
    db.prepare(`
      UPDATE customers 
      SET status = 'inactive', updated_at = ? 
      WHERE id = ?
    `).run(now, id);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Order routes
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, c.name as customer_name 
      FROM orders o 
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `).all();
    const transformedOrders = orders.map(transformOperation);
    res.json(transformedOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', (req, res) => {
  const { customer_id, items, notes, promised_date } = req.body;
  
  try {
    const order_id = uuidv4();
    let total_amount = 0;

    // Start transaction
    const transaction = db.transaction(() => {
      // Create order
      db.prepare(`
        INSERT INTO orders (id, customer_id, total_amount, notes, promised_date)
        VALUES (?, ?, ?, ?, ?)
      `).run(order_id, customer_id, total_amount, notes, promised_date);

      // Add order items
      items.forEach((item: any) => {
        const item_id = uuidv4();
        total_amount += item.price * item.quantity;
        
        db.prepare(`
          INSERT INTO order_items (id, order_id, service_id, quantity, price, notes)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(item_id, order_id, item.service_id, item.quantity, item.price, item.notes);
      });

      // Update order total
      db.prepare(`
        UPDATE orders SET total_amount = ? WHERE id = ?
      `).run(total_amount, order_id);

      // Update customer stats
      db.prepare(`
        UPDATE customers 
        SET total_orders = total_orders + 1,
            total_spent = total_spent + ?,
            last_visit = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(total_amount, customer_id);

      return db.prepare(`
        SELECT o.*, c.name as customer_name 
        FROM orders o 
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE o.id = ?
      `).get(order_id);
    });

    const order = transaction();
    res.status(201).json(transformOperation(order));
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Service routes
app.get('/api/services', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services WHERE status = ?').all('active');
    const transformedServices = services.map(transformService);
    res.json(transformedServices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/api/services', (req, res) => {
  try {
    const { name, description, price, estimated_days, category } = req.body;
    const id = uuidv4();
    
    const result = db.prepare(`
      INSERT INTO services (id, name, description, price, estimated_days, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, description, price, estimated_days, category);

    if (result.changes > 0) {
      const service = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
      res.status(201).json(transformService(service));
    } else {
      res.status(400).json({ error: 'Failed to create service' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
