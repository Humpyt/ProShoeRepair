import express from 'express';
import db from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all supplies items with optional category filter
router.get('/supplies', async (req, res) => {
  try {
    const { category } = req.query;
    console.log('Fetching supplies for category:', category);

    const query = category
      ? 'SELECT * FROM supplies WHERE LOWER(category) = LOWER($1)'
      : 'SELECT * FROM supplies';

    const items = category
      ? await db.all(query, [category])
      : await db.all(query);

    console.log('Found items:', items.length);
    console.log('Sample item:', items[0]);

    res.json(items);
  } catch (error) {
    console.error('Error fetching supplies:', error);
    res.status(500).json({ error: 'Failed to fetch supplies items' });
  }
});

// Add new supply item
router.post('/supplies', async (req, res) => {
  try {
    const { name, category, description, onHand, minStock, cost, unit } = req.body;
    const now = new Date().toISOString();
    const id = uuidv4();

    await db.run(`
      INSERT INTO supplies (
        id, name, category, description, on_hand, min_stock, cost, unit,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      id, name, category, description, onHand, minStock, cost, unit,
      now, now
    ]);

    const item = await db.get('SELECT * FROM supplies WHERE id = $1', [id]);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating supply:', error);
    res.status(500).json({ error: 'Failed to create supply item' });
  }
});

// Update supply item
router.put('/supplies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, onHand, minStock, cost, unit } = req.body;
    const now = new Date().toISOString();

    await db.run(`
      UPDATE supplies SET
        name = $1,
        category = $2,
        description = $3,
        on_hand = $4,
        min_stock = $5,
        cost = $6,
        unit = $7,
        updated_at = $8
      WHERE id = $9
    `, [
      name, category, description, onHand, minStock, cost, unit,
      now, id
    ]);

    const item = await db.get('SELECT * FROM supplies WHERE id = $1', [id]);
    if (!item) {
      return res.status(404).json({ error: 'Supply item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error updating supply:', error);
    res.status(500).json({ error: 'Failed to update supply item' });
  }
});

// Delete supply item
router.delete('/supplies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM supplies WHERE id = $1', [id]);
    if ((result as any).rowCount === 0) {
      return res.status(404).json({ error: 'Supply item not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting supply:', error);
    res.status(500).json({ error: 'Failed to delete supply item' });
  }
});

export default router;
