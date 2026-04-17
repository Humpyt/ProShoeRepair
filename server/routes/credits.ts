import express from 'express';
import db from '../database';
import { applyPaymentsToOperation, PaymentInput } from '../helpers/applyPayments';

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
      // Apply credit to debts using the shared helper (oldest first)
      for (const operation of unpaidOperations) {
        if (remainingCredit <= 0) break;

        const operationBalance = Number(operation.total_amount) - Number(operation.paid_amount || 0);
        const paymentAmount = Math.min(remainingCredit, operationBalance);

        if (paymentAmount > 0) {
          const payment: PaymentInput = {
            method: 'store_credit',
            amount: paymentAmount,
            transaction_id: `auto-credit-${Date.now()}`
          };

          // Use the shared helper to apply the payment
          const result = await applyPaymentsToOperation(operation.id, [payment], 'store_credit');

          if (!result.success) {
            console.error(`[apply-credit-to-debts] Failed to apply payment to operation ${operation.id}:`, result.error);
            continue; // Skip this operation and try the next one
          }

          // Deduct from customer credit (the helper doesn't do this for store_credit)
          const newBalance = (customer.account_balance || 0) - paymentAmount;
          await db.run(`
            UPDATE customers SET account_balance = $1 WHERE id = $2
          `, [newBalance, customerId]);

          // Record credit debit transaction
          await db.run(`
            INSERT INTO customer_credits (id, customer_id, type, amount, description, balance_after, created_at)
            VALUES ($1, $2, 'debit', $3, $4, $5, $6)
          `, [
            `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            customerId,
            paymentAmount,
            `Auto-payment for operation #${operation.id.slice(-6)}`,
            newBalance,
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
