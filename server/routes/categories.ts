import express from 'express';
import db from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await db.all('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get a single category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await db.get('SELECT * FROM categories WHERE id = $1', [id]);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const now = new Date().toISOString();
    const id = uuidv4();

    await db.run(`
      INSERT INTO categories (id, name, created_at, updated_at)
      VALUES ($1, $2, $3, $4)
    `, [id, name, now, now]);

    const newCategory = await db.get('SELECT * FROM categories WHERE id = $1', [id]);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const now = new Date().toISOString();

    const result = await db.run(`
      UPDATE categories SET
        name = $1,
        updated_at = $2
      WHERE id = $3
    `, [name, now, id]);

    if ((result as any).rowCount > 0) {
      const updatedCategory = await db.get('SELECT * FROM categories WHERE id = $1', [id]);
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category is in use
    const itemsUsingCategory = await db.get('SELECT COUNT(*) as count FROM supplies WHERE category = $1', [id]);
    if (itemsUsingCategory.count > 0) {
      return res.status(400).json({ error: 'Cannot delete category that is in use' });
    }

    const result = await db.run('DELETE FROM categories WHERE id = $1', [id]);

    if ((result as any).rowCount > 0) {
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
