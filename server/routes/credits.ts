import express from 'express';
import db from '../database';

const router = express.Router();

// Add credit to customer account
router.post('/:customerId/credits', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { amount, description, createdBy } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    // Get current balance
    const customer = await db.get('SELECT account_balance FROM customers WHERE id = $1', [customerId]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const currentBalance = customer.account_balance || 0;
    const newBalance = currentBalance + amount;
    const transactionId = `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Start transaction
    await db.withTransaction(async () => {
      // Add transaction record
      await db.run(`
        INSERT INTO customer_credits (id, customer_id, amount, balance_after, type, description, created_by, created_at)
        VALUES ($1, $2, $3, $4, 'credit', $5, $6, $7)
      `, [transactionId, customerId, amount, newBalance, description, createdBy, now]);

      // Update customer balance
      await db.run('UPDATE customers SET account_balance = $1, updated_at = $2 WHERE id = $3', [newBalance, now, customerId]);
    });

    // Return updated customer
    const updatedCustomer = await db.get('SELECT * FROM customers WHERE id = $1', [customerId]);
    res.json(updatedCustomer);

  } catch (error) {
    console.error('Error adding credit:', error);
    res.status(500).json({ error: 'Failed to add credit' });
  }
});

// Automatically apply credit to outstanding debts
router.post('/:customerId/apply-credit-to-debts', async (req, res) => {
  try {
    const { customerId } = req.params;
    const now = new Date().toISOString();

    // Get customer's current credit balance
    const customer = await db.get('SELECT account_balance FROM customers WHERE id = $1', [customerId]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const availableCredit = customer.account_balance || 0;
    if (availableCredit <= 0) {
      return res.json({ success: true, message: 'No credit to apply', paymentsMade: [], remainingCredit: 0 });
    }

    // Get all unpaid operations for this customer
    const unpaidOperations = await db.all(`
      SELECT * FROM operations
      WHERE customer_id = $1 AND total_amount > COALESCE(paid_amount, 0)
      ORDER BY created_at ASC
    `, [customerId]);

    if (unpaidOperations.length === 0) {
      return res.json({ success: true, message: 'No outstanding debts', paymentsMade: [], remainingCredit: availableCredit });
    }

    const paymentsMade = [];
    let remainingCredit = availableCredit;

    try {
      await db.withTransaction(async () => {
        // Apply credit to debts (oldest first)
        for (const operation of unpaidOperations) {
          if (remainingCredit <= 0) break;

          const operationBalance = operation.total_amount - (operation.paid_amount || 0);
          const paymentAmount = Math.min(remainingCredit, operationBalance);

          if (paymentAmount > 0) {
            // Create payment record
            const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await db.run(`
              INSERT INTO operation_payments (id, operation_id, payment_method, amount, transaction_id, created_at)
              VALUES ($1, $2, $3, $4, $5, $6)
            `, [paymentId, operation.id, 'store_credit', paymentAmount, `auto-credit-${paymentId.slice(-8)}`, now]);

            // Update operation paid amount
            const newPaidAmount = (operation.paid_amount || 0) + paymentAmount;
            await db.run(`
              UPDATE operations
              SET paid_amount = $1,
                  status = CASE WHEN $2 >= total_amount THEN 'completed' ELSE status END,
                  updated_at = $3
              WHERE id = $4
            `, [newPaidAmount, newPaidAmount, now, operation.id]);

            // Deduct from customer credit
            await db.run(`
              UPDATE customers
              SET account_balance = account_balance - $1
              WHERE id = $2
            `, [paymentAmount, customerId]);

            // Record credit debit transaction
            await db.run(`
              INSERT INTO customer_credits (id, customer_id, type, amount, description, balance_after, created_at)
              VALUES ($1, $2, 'debit', $3, $4, $5, $6)
            `, [
              `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              customerId,
              paymentAmount,
              `Auto-payment for operation #${operation.id.slice(-6)}`,
              (customer.account_balance || 0) - paymentAmount,
              now
            ]);

            paymentsMade.push({
              operationId: operation.id,
              amount: paymentAmount,
              remainingBalance: operationBalance - paymentAmount
            });

            remainingCredit -= paymentAmount;
          }
        }
      });

      // Get updated customer info
      const updatedCustomer = await db.get('SELECT account_balance FROM customers WHERE id = $1', [customerId]);

      res.json({
        success: true,
        paymentsMade,
        remainingCredit,
        newBalance: updatedCustomer?.account_balance || 0,
        message: paymentsMade.length > 0
          ? `Applied credit to ${paymentsMade.length} debt${paymentsMade.length > 1 ? 's' : ''}`
          : 'No debts to pay off'
      });

    } catch (error) {
      console.error('Error auto-applying credit to debts:', error);
      res.status(500).json({ error: 'Failed to apply credit to debts' });
    }

  } catch (error) {
    console.error('Error auto-applying credit to debts:', error);
    res.status(500).json({ error: 'Failed to apply credit to debts' });
  }
});

// Get credit transactions for customer
router.get('/:customerId/credits', async (req, res) => {
  try {
    const { customerId } = req.params;

    const transactions = await db.all(`
      SELECT * FROM customer_credits
      WHERE customer_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [customerId]);

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching credit transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Deduct credit from customer account (when used for payment)
router.post('/:customerId/credits/deduct', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    // Get current balance
    const customer = await db.get('SELECT account_balance FROM customers WHERE id = $1', [customerId]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const currentBalance = customer.account_balance || 0;

    if (currentBalance < amount) {
      return res.status(400).json({ error: 'Insufficient credit balance' });
    }

    const newBalance = currentBalance - amount;
    const transactionId = `debit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Start transaction
    await db.withTransaction(async () => {
      // Add transaction record
      await db.run(`
        INSERT INTO customer_credits (id, customer_id, amount, balance_after, type, description, created_at)
        VALUES ($1, $2, $3, $4, 'debit', $5, $6)
      `, [transactionId, customerId, amount, newBalance, description, now]);

      // Update customer balance
      await db.run('UPDATE customers SET account_balance = $1, updated_at = $2 WHERE id = $3', [newBalance, now, customerId]);
    });

    // Return updated customer
    const updatedCustomer = await db.get('SELECT * FROM customers WHERE id = $1', [customerId]);
    res.json(updatedCustomer);

  } catch (error) {
    console.error('Error deducting credit:', error);
    res.status(500).json({ error: 'Failed to deduct credit' });
  }
});

export default router;
