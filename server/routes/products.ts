import { v4 as uuidv4 } from 'uuid';
import db from '../database';
import express from 'express';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await db.all(`
      SELECT products.*, categories.name as category_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      ORDER BY products.name ASC
    `);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await db.all(`
      SELECT * FROM products
      WHERE category_id = $1
      ORDER BY name ASC
    `, [categoryId]);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description, imageUrl, categoryId, inStock, featured } = req.body;

    if (!name || !categoryId || price === undefined) {
      return res.status(400).json({ error: 'Name, categoryId and price are required' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(`
      INSERT INTO products (
        id, name, price, description, image_url, category_id,
        in_stock, featured, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      id, name, price, description || null, imageUrl || null, categoryId,
      inStock ? 1 : 0, featured ? 1 : 0, now, now
    ]);

    const newProduct = await db.get('SELECT * FROM products WHERE id = $1', [id]);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const now = new Date().toISOString();

    // Create SET clause dynamically from provided updates
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      // Convert camelCase to snake_case for database
      const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      setClauses.push(`${dbKey} = $${paramIndex++}`);
      values.push(updates[key]);
    });

    setClauses.push(`updated_at = $${paramIndex++}`);
    values.push(now);
    values.push(id);

    const result = await db.run(`
      UPDATE products
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
    `, values);

    if ((result as any).rowCount > 0) {
      const updatedProduct = await db.get('SELECT * FROM products WHERE id = $1', [id]);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM products WHERE id = $1', [id]);

    if ((result as any).rowCount > 0) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
