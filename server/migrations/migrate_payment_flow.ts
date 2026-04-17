/**
 * Migration Script: Payment Flow Fix
 * Date: 2026-04-17
 *
 * This script migrates existing operations to use the new workflow_status and payment_status fields.
 *
 * Safety: Creates a backup before modifying any data.
 */

import db from '../database';

async function migrate() {
  console.log('=== Payment Flow Migration ===\n');

  const now = new Date().toISOString().replace(/[:.-]/g, '').replace('T', '_').slice(0, -5);
  const backupTableName = `operations_backup_${now}`;

  try {
    // Step 1: Show current state
    console.log('Step 1: Current state before migration...\n');

    const beforeWorkflow = await db.all(`
      SELECT workflow_status, COUNT(*) as count
      FROM operations
      GROUP BY workflow_status
      ORDER BY workflow_status
    `);
    console.log('workflow_status counts:');
    beforeWorkflow.forEach((row: any) => {
      console.log(`  ${row.workflow_status}: ${row.count}`);
    });

    const beforePayment = await db.all(`
      SELECT payment_status, COUNT(*) as count
      FROM operations
      GROUP BY payment_status
      ORDER BY payment_status
    `);
    console.log('\npayment_status counts:');
    beforePayment.forEach((row: any) => {
      console.log(`  ${row.payment_status}: ${row.count}`);
    });

    // Count records needing migration
    const needsMigration = await db.get(`
      SELECT COUNT(*) as count FROM operations
      WHERE workflow_status = 'pending' AND status IS NOT NULL AND status != 'pending'
    `);
    console.log(`\nRecords needing migration: ${needsMigration.count}`);

    if (needsMigration.count === 0) {
      console.log('\nNo records need migration. Exiting.');
      return;
    }

    // Step 2: Create backup
    console.log(`\nStep 2: Creating backup table: ${backupTableName}`);
    await db.run(`
      CREATE TABLE ${backupTableName} AS SELECT * FROM operations
    `);
    console.log('Backup created successfully.');

    // Step 3: Migrate workflow_status
    console.log('\nStep 3: Migrating workflow_status...');

    const workflowResult = await db.run(`
      UPDATE operations
      SET workflow_status = CASE
        WHEN status = 'completed' THEN 'delivered'
        WHEN status = 'in_progress' THEN 'in_progress'
        WHEN status = 'ready' THEN 'ready'
        WHEN status = 'cancelled' THEN 'cancelled'
        ELSE 'pending'
      END
      WHERE workflow_status = 'pending'
        AND status IS NOT NULL
    `);
    console.log(`Updated ${workflowResult.rowCount || 'multiple'} workflow_status records`);

    // Step 4: Migrate payment_status
    console.log('\nStep 4: Migrating payment_status...');

    const paymentResult = await db.run(`
      UPDATE operations
      SET payment_status = CASE
        WHEN paid_amount <= 0 THEN 'unpaid'
        WHEN paid_amount >= (total_amount - COALESCE(discount, 0)) THEN 'paid'
        ELSE 'partial'
      END
      WHERE payment_status = 'unpaid'
        AND (
          paid_amount > 0
          OR paid_amount >= (total_amount - COALESCE(discount, 0))
        )
    `);
    console.log(`Updated ${paymentResult.rowCount || 'multiple'} payment_status records`);

    // Step 5: Verify results
    console.log('\nStep 5: Verification after migration...\n');

    const afterWorkflow = await db.all(`
      SELECT workflow_status, COUNT(*) as count
      FROM operations
      GROUP BY workflow_status
      ORDER BY workflow_status
    `);
    console.log('workflow_status counts after:');
    afterWorkflow.forEach((row: any) => {
      console.log(`  ${row.workflow_status}: ${row.count}`);
    });

    const afterPayment = await db.all(`
      SELECT payment_status, COUNT(*) as count
      FROM operations
      GROUP BY payment_status
      ORDER BY payment_status
    `);
    console.log('\npayment_status counts after:');
    afterPayment.forEach((row: any) => {
      console.log(`  ${row.payment_status}: ${row.count}`);
    });

    // Check for any remaining inconsistencies
    const inconsistent = await db.get(`
      SELECT COUNT(*) as count FROM operations
      WHERE workflow_status = 'pending' AND status = 'completed'
    `);
    console.log(`\nRecords still inconsistent: ${inconsistent.count}`);

    if (inconsistent.count === 0) {
      console.log('\n✓ Migration completed successfully!');
      console.log(`  Backup table: ${backupTableName}`);
      console.log('\nTo rollback if needed:');
      console.log(`  DROP TABLE operations;`);
      console.log(`  SELECT * INTO operations FROM ${backupTableName};`);
      console.log(`  DROP TABLE ${backupTableName};`);
    } else {
      console.log('\n✗ Some records were not migrated. Check manually.');
    }

  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    console.log('\nRollback using backup table if needed.');
    throw error;
  }
}

migrate().catch(console.error);
