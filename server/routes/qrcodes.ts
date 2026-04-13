import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database';

const router = express.Router();

// Initialize QR codes table if it doesn't exist
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS qrcodes (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        label TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Error creating qrcodes table:', error);
  }
})();

// Get all QR codes
router.get('/', async (req, res) => {
  try {
    const qrCodes = await db.all(`
      SELECT * FROM qrcodes
      ORDER BY created_at DESC
    `);
    res.json(qrCodes);
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
});

// Create a new QR code
router.post('/', async (req, res) => {
  try {
    const { type, label, data } = req.body;
    const id = uuidv4();

    await db.run(`
      INSERT INTO qrcodes (id, type, label, data)
      VALUES ($1, $2, $3, $4)
    `, [id, type, label, data]);

    const newQRCode = await db.get('SELECT * FROM qrcodes WHERE id = $1', [id]);
    res.status(201).json(newQRCode);
  } catch (error) {
    console.error('Error creating QR code:', error);
    res.status(500).json({ error: 'Failed to create QR code' });
  }
});

// Delete a QR code
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM qrcodes WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting QR code:', error);
    res.status(500).json({ error: 'Failed to delete QR code' });
  }
});

export default router;
