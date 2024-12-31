import express from 'express';
import db from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get supplies by category
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM supplies';
    let params: any[] = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY name ASC';
    
    const items = db.prepare(query).all(...params);
    res.json(items);
  } catch (error) {
    console.error('Error fetching supplies:', error);
    res.status(500).json({ error: 'Failed to fetch supplies' });
  }
});

// Get a single supply item
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = db.prepare('SELECT * FROM supplies WHERE id = ?').get(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Supply item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching supply item:', error);
    res.status(500).json({ error: 'Failed to fetch supply item' });
  }
});

// Create a new supply item
router.post('/', (req, res) => {
  try {
    const { name, category, description, onHand, minStock, cost, unit } = req.body;
    const now = new Date().toISOString();
    
    const result = db.prepare(`
      INSERT INTO supplies (
        id, name, category, description, on_hand,
        min_stock, cost, unit, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(), name, category, description, onHand,
      minStock, cost, unit, now, now
    );
    
    if (result.changes > 0) {
      const newItem = db.prepare('SELECT * FROM supplies WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json(newItem);
    } else {
      throw new Error('Failed to create supply item');
    }
  } catch (error) {
    console.error('Error creating supply item:', error);
    res.status(500).json({ error: 'Failed to create supply item' });
  }
});

// Update a supply item
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, onHand, minStock, cost, unit } = req.body;
    const now = new Date().toISOString();
    
    const result = db.prepare(`
      UPDATE supplies SET
        name = ?,
        category = ?,
        description = ?,
        on_hand = ?,
        min_stock = ?,
        cost = ?,
        unit = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      name, category, description, onHand, minStock, cost, unit,
      now, id
    );
    
    if (result.changes > 0) {
      const updatedItem = db.prepare('SELECT * FROM supplies WHERE id = ?').get(id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: 'Supply item not found' });
    }
  } catch (error) {
    console.error('Error updating supply item:', error);
    res.status(500).json({ error: 'Failed to update supply item' });
  }
});

// Delete a supply item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM supplies WHERE id = ?').run(id);
    
    if (result.changes > 0) {
      res.json({ message: 'Supply item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Supply item not found' });
    }
  } catch (error) {
    console.error('Error deleting supply item:', error);
    res.status(500).json({ error: 'Failed to delete supply item' });
  }
});

export default router;
