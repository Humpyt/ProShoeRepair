import { Router } from 'express';
import { pool } from '../database.js';

const router = Router();

// GET /api/ticket/next - Get next ticket number for current month
router.get('/next', async (req, res) => {
  try {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Query for highest existing ticket number matching ${yearMonth}-%
    const result = await pool.query(
      `SELECT ticket_number FROM operations
       WHERE ticket_number LIKE $1
       ORDER BY ticket_number DESC
       LIMIT 1`,
      [`${yearMonth}-%`]
    );

    let sequence = 1;
    if (result.rows.length > 0) {
      const highestTicket = result.rows[0].ticket_number;
      // Extract sequence number from "YYYY-MM-NNNN" format
      const parts = highestTicket.split('-');
      if (parts.length === 3) {
        sequence = parseInt(parts[2], 10) + 1;
      }
    }

    const ticket_number = `${yearMonth}-${String(sequence).padStart(4, '0')}`;
    res.json({ ticket_number });
  } catch (error) {
    console.error('Error generating ticket number:', error);
    res.status(500).json({ error: 'Failed to generate ticket number' });
  }
});

export default router;
