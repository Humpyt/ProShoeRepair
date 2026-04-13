import express from 'express';
import db from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create a new order
router.post('/orders', async (req: any, res: any) => {
  try {
    const { items, total, paymentMethod, customerInfo } = req.body;
    const now = new Date().toISOString();

    // Create order
    const orderId = uuidv4();
    await db.run(`
      INSERT INTO orders (
        id, total_amount, payment_method, customer_name,
        customer_phone, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      orderId, total, paymentMethod,
      customerInfo?.name || null,
      customerInfo?.phone || null,
      now, now
    ]);

    // Create order items
    for (const item of items) {
      await db.run(`
        INSERT INTO order_items (
          id, order_id, item_id, quantity, price,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        uuidv4(), orderId, item.id, item.quantity,
        item.price, now, now
      ]);
    }

    res.status(201).json({ id: orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
