import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from './database';
import { transformOperation } from './utils';

const router = express.Router();

// Get all operations
router.get('/', async (req, res) => {
  try {
    const { created_by } = req.query;
    let query = `
      SELECT o.*, c.name as customer_name, c.phone as customer_phone, u.name as staff_name
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON o.created_by = u.id
    `;
    const params: any[] = [];

    if (created_by) {
      query += ` WHERE o.created_by = ?`;
      params.push(created_by);
    }

    query += ` ORDER BY o.created_at DESC`;

    const operations = await db.prepare(query).all(...params);

    // Optimization: Fetch all shoes in a single query instead of N+1 queries
    const operationIds = operations.map((op: any) => op.id);
    let shoesMap: Map<string, any[]> = new Map();

    if (operationIds.length > 0) {
      const placeholders = operationIds.map(() => '?').join(',');
      const allShoes = await db.prepare(`
        SELECT os.*, s.name as service_name, s.price as service_base_price
        FROM operation_shoes os
        LEFT JOIN operation_services oss ON os.id = oss.operation_shoe_id
        LEFT JOIN services s ON oss.service_id = s.id
        WHERE os.operation_id IN (${placeholders})
      `).all(...operationIds);

      // Group shoes by operation_id
      for (const shoe of allShoes) {
        if (!shoesMap.has(shoe.operation_id)) {
          shoesMap.set(shoe.operation_id, []);
        }
        shoesMap.get(shoe.operation_id)!.push(shoe);
      }
    }

    // Build operations with shoes
    const operationsWithShoes = operations.map((operation: any) => ({
      ...operation,
      shoes: (shoesMap.get(operation.id) || []).map((shoe: any) => ({
        id: shoe.id,
        category: shoe.category,
        color: shoe.color,
        notes: shoe.notes,
        services: [{
          id: shoe.service_id,
          name: shoe.service_name,
          price: shoe.price,
          basePrice: shoe.service_base_price
        }]
      }))
    }));

    res.json(operationsWithShoes.map(transformOperation));
  } catch (error) {
    console.error('Failed to fetch operations:', error);
    res.status(500).json({ error: 'Failed to fetch operations' });
  }
});

// Get operation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const operation = await db.prepare(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone, u.name as staff_name
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON o.created_by = u.id
      WHERE o.id = ?
    `).get(id);

    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }

    // Get shoes and services for this operation
    const shoes = await db.prepare(`
      SELECT os.*, s.name as service_name, s.price as service_base_price
      FROM operation_shoes os
      LEFT JOIN operation_services oss ON os.id = oss.operation_shoe_id
      LEFT JOIN services s ON oss.service_id = s.id
      WHERE os.operation_id = ?
    `).all(id);

    const operationWithShoes = {
      ...operation,
      shoes: shoes.map((shoe: any) => ({
        id: shoe.id,
        category: shoe.category,
        color: shoe.color,
        notes: shoe.notes,
        services: [{
          id: shoe.service_id,
          name: shoe.service_name,
          price: shoe.price,
          basePrice: shoe.service_base_price
        }]
      }))
    };

    res.json(transformOperation(operationWithShoes));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch operation' });
  }
});

// Get payment history for an operation
router.get('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;

    const payments = await db.prepare(`
      SELECT * FROM operation_payments
      WHERE operation_id = ?
      ORDER BY created_at DESC
    `).all(id);

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Create new operation
router.post('/', async (req, res) => {
  console.log('Received operation request:', JSON.stringify(req.body, null, 2));
  const { customer, shoes, status, totalAmount, discount, isNoCharge, isDoOver, isDelivery, isPickup, notes, promisedDate, created_by } = req.body;
  const now = new Date().toISOString();

  if (!customer || !customer.id) {
    console.error('Invalid customer data:', customer);
    return res.status(400).json({ error: 'Invalid customer data' });
  }

  if (!Array.isArray(shoes) || shoes.length === 0) {
    console.error('Invalid shoes data:', shoes);
    return res.status(400).json({ error: 'Invalid shoes data' });
  }

  try {
    await db.run('BEGIN TRANSACTION');
    
    try {
      // Insert the operation
      const operationId = uuidv4();
      console.log('Creating operation with ID:', operationId);

      await db.prepare(`
        INSERT INTO operations (
          id, customer_id, status, total_amount, discount, notes, promised_date,
          is_no_charge, is_do_over, is_delivery, is_pickup,
          created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        operationId,
        customer.id,
        status || 'pending',
        totalAmount || 0,
        discount || 0,
        notes || null,
        promisedDate || null,
        isNoCharge ? 1 : 0,
        isDoOver ? 1 : 0,
        isDelivery ? 1 : 0,
        isPickup ? 1 : 0,
        created_by || null,
        now,
        now
      );

      // Insert each shoe
      for (let index = 0; index < shoes.length; index++) {
        const shoe = shoes[index];
        console.log(`Processing shoe ${index + 1}:`, JSON.stringify(shoe, null, 2));
        const shoeId = uuidv4();
        
        await db.prepare(`
          INSERT INTO operation_shoes (
            id, operation_id, category, shoe_size, color, notes, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          shoeId,
          operationId,
          shoe.category,
          shoe.size || null,
          shoe.color || null,
          shoe.notes || null,
          now,
          now
        );

        // Insert services for each shoe
        if (Array.isArray(shoe.services)) {
          for (let sIndex = 0; sIndex < shoe.services.length; sIndex++) {
            const service = shoe.services[sIndex];
            console.log(`Processing service ${sIndex + 1} for shoe ${index + 1}:`, JSON.stringify(service, null, 2));
            
            if (!service.service_id) {
              throw new Error(`Missing service_id for service ${sIndex + 1} of shoe ${index + 1}`);
            }

            await db.prepare(`
              INSERT INTO operation_services (
                id, operation_shoe_id, service_id, quantity, price, notes,
                created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              uuidv4(),
              shoeId,
              service.service_id,
              service.quantity || 1,
              service.price || 0,
              service.notes || null,
              now,
              now
            );
          }
        }
      }

      // Return the created operation with all related data
      const operation = await db.prepare(`
        SELECT 
          o.*,
          c.name as customer_name,
          c.phone as customer_phone,
          c.email as customer_email
        FROM operations o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE o.id = ?
      `).get(operationId);

      // Get shoes for this operation
      const operationShoes = await db.prepare(`
        SELECT * FROM operation_shoes WHERE operation_id = ?
      `).all(operationId);

      // Get services for each shoe
      const shoesWithServices = [];
      for (const shoe of operationShoes) {
        const services = await db.prepare(`
          SELECT 
            os.*,
            s.name as service_name,
            s.price as service_base_price
          FROM operation_services os
          LEFT JOIN services s ON os.service_id = s.id
          WHERE os.operation_shoe_id = ?
        `).all(shoe.id);

        shoesWithServices.push({
          ...shoe,
          services: services.map((s: any) => ({
            id: s.service_id,
            name: s.service_name,
            price: s.price,
            quantity: s.quantity,
            notes: s.notes
          }))
        });
      }

      // Update customer stats: increment total_orders and update last_visit
      await db.prepare(`
        UPDATE customers
        SET total_orders = total_orders + 1,
            last_visit = ?
        WHERE id = ?
      `).run(now, customer.id);

      await db.run('COMMIT');
      
      res.json({
        ...operation,
        shoes: shoesWithServices,
        isNoCharge: Boolean(operation.is_no_charge),
        isDoOver: Boolean(operation.is_do_over),
        isDelivery: Boolean(operation.is_delivery),
        isPickup: Boolean(operation.is_pickup),
        discount: operation.discount || 0
      });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating operation:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create operation' });
  }
});

// Update operation status
router.patch('/:id', async (req, res) => {
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
    
    await db.prepare(`
      UPDATE operations
      SET ${setClauses}
      WHERE id = ?
    `).run(...values);
    
    const operation = await db.prepare(`
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

// Process payment with multiple methods
router.post('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;
    const { payments } = req.body; // Array of { method, amount, transaction_id }

    if (!Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({ error: 'Payments array is required' });
    }

    // Get operation
    const operation = await db.get('SELECT * FROM operations WHERE id = ?', [id]);
    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }

    const totalPaid = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
    const now = new Date().toISOString();

    await db.run('BEGIN TRANSACTION');

    // Add each payment
    for (const payment of payments) {
      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.run(`
        INSERT INTO operation_payments (id, operation_id, payment_method, amount, transaction_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [paymentId, id, payment.method, payment.amount, payment.transaction_id || null, now]);
    }

    // Update operation paid_amount
    const newPaidAmount = (operation.paid_amount || 0) + totalPaid;
    await db.run(`
      UPDATE operations
      SET paid_amount = ?,
          status = CASE WHEN ? >= total_amount THEN 'completed' ELSE status END,
          updated_at = ?
      WHERE id = ?
    `, [newPaidAmount, newPaidAmount, now, id]);

    // Update customer stats: add to total_spent and update last_visit
    await db.prepare(`
      UPDATE customers
      SET total_spent = total_spent + ?,
          last_visit = ?
      WHERE id = ?
    `).run(totalPaid, now, (operation as any).customer_id);

    await db.run('COMMIT');

    // Return updated operation
    const updatedOperation = await db.get('SELECT * FROM operations WHERE id = ?', [id]);
    res.json(transformOperation(updatedOperation));

  } catch (error) {
    await db.run('ROLLBACK');
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

export default router;
