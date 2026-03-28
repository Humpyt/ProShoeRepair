import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database';

const router = express.Router();

// Generate invoice number
function generateInvoiceNumber(type: 'invoice' | 'receipt'): string {
  const prefix = type === 'invoice' ? 'INV' : 'RCP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

const getRetailItems = async (operationId: string) => {
  return db.prepare(`
    SELECT * FROM operation_retail_items
    WHERE operation_id = ?
    ORDER BY created_at ASC
  `).all(operationId);
};

// Get all invoices with filters
router.get('/', async (req, res) => {
  try {
    const { type, startDate, endDate, customer } = req.query;

    let query = `
      SELECT i.*, o.id as operation_id
      FROM invoices i
      LEFT JOIN operations o ON i.operation_id = o.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (type && type !== 'all') {
      query += ` AND i.type = ?`;
      params.push(type);
    }

    if (startDate) {
      query += ` AND DATE(i.created_at) >= DATE(?)`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND DATE(i.created_at) <= DATE(?)`;
      params.push(endDate);
    }

    if (customer) {
      query += ` AND i.customer_name LIKE ?`;
      params.push(`%${customer}%`);
    }

    query += ` ORDER BY i.created_at DESC`;

    const invoices = await db.prepare(query).all(...params);

    res.json(invoices.map((inv: any) => ({
      id: inv.id,
      operationId: inv.operation_id,
      type: inv.type,
      invoiceNumber: inv.invoice_number,
      customerName: inv.customer_name,
      customerPhone: inv.customer_phone,
      subtotal: inv.subtotal,
      discount: inv.discount,
      total: inv.total,
      amountPaid: inv.amount_paid,
      paymentMethod: inv.payment_method,
      promisedDate: inv.promised_date,
      generatedBy: inv.generated_by,
      createdAt: inv.created_at
    })));
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await db.prepare(`
      SELECT * FROM invoices WHERE id = ?
    `).get(id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const inv = invoice as any;

    // Get operation details
    const operation = await db.prepare(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `).get(inv.operation_id);

    // Get shoes and services
    const shoes = await db.prepare(`
      SELECT os.*, s.name as service_name, oss.price as service_price
      FROM operation_shoes os
      LEFT JOIN operation_services oss ON os.id = oss.operation_shoe_id
      LEFT JOIN services s ON oss.service_id = s.id
      WHERE os.operation_id = ?
    `).all(inv.operation_id);
    const retailItems = await getRetailItems(inv.operation_id);

    // Get payments if receipt
    const payments = inv.type === 'receipt'
      ? await db.prepare(`SELECT * FROM operation_payments WHERE operation_id = ?`).all(inv.operation_id)
      : [];

    res.json({
      id: inv.id,
      operationId: inv.operation_id,
      type: inv.type,
      invoiceNumber: inv.invoice_number,
      customerName: inv.customer_name,
      customerPhone: inv.customer_phone,
      subtotal: inv.subtotal,
      discount: inv.discount,
      total: inv.total,
      amountPaid: inv.amount_paid,
      paymentMethod: inv.payment_method,
      promisedDate: inv.promised_date,
      notes: inv.notes,
      generatedBy: inv.generated_by,
      createdAt: inv.created_at,
      operation: operation ? {
        id: (operation as any).id,
        status: (operation as any).status,
        notes: (operation as any).notes,
        isNoCharge: Boolean((operation as any).is_no_charge),
        isDoOver: Boolean((operation as any).is_do_over),
        isDelivery: Boolean((operation as any).is_delivery),
        isPickup: Boolean((operation as any).is_pickup)
      } : null,
      items: [
        ...shoes.map((shoe: any) => ({
          id: shoe.id,
          type: 'repair',
          category: shoe.category,
          color: shoe.color,
          colorDescription: shoe.color_description || '',
          notes: shoe.notes,
          serviceName: shoe.service_name,
          price: shoe.service_price
        })),
        ...retailItems.map((item: any) => ({
          id: item.id,
          type: 'retail',
          productId: item.product_id || null,
          productName: item.product_name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          price: item.total_price
        }))
      ],
      payments: payments.map((p: any) => ({
        id: p.id,
        method: p.payment_method,
        amount: p.amount,
        createdAt: p.created_at
      }))
    });
  } catch (error) {
    console.error('Failed to fetch invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Generate invoice/receipt from operation
router.post('/', async (req, res) => {
  try {
    const { operationId, type, generatedBy } = req.body;

    if (!operationId) {
      return res.status(400).json({ error: 'Operation ID is required' });
    }

    // Get operation with customer
    const operation = await db.prepare(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `).get(operationId);

    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }

    const op = operation as any;

    // Determine type based on payment status if not specified
    let documentType = type;
    if (!documentType) {
      documentType = op.paid_amount >= op.total_amount ? 'receipt' : 'invoice';
    }

    // Check if invoice already exists for this operation
    const existing = await db.prepare(`
      SELECT id FROM invoices WHERE operation_id = ? AND type = ?
    `).get(operationId, documentType);

    if (existing) {
      return res.status(400).json({ error: `This ${documentType} already exists`, invoiceId: (existing as any).id });
    }

    const subtotal = (op.total_amount || 0) + (op.discount || 0);
    const total = op.total_amount;
    const discount = op.discount || 0;
    const amountPaid = op.paid_amount || 0;

    // Get payment method if any payments exist
    let paymentMethod = null;
    if (amountPaid > 0) {
      const lastPayment = await db.prepare(`
        SELECT payment_method FROM operation_payments WHERE operation_id = ? ORDER BY created_at DESC LIMIT 1
      `).get(operationId);
      paymentMethod = lastPayment ? (lastPayment as any).payment_method : null;
    }

    const invoiceId = uuidv4();
    const invoiceNumber = generateInvoiceNumber(documentType);
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO invoices (
        id, operation_id, type, invoice_number, customer_name, customer_phone,
        subtotal, discount, total, amount_paid, payment_method, notes,
        promised_date, generated_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      invoiceId,
      operationId,
      documentType,
      invoiceNumber,
      op.customer_name,
      op.customer_phone,
      subtotal,
      discount,
      total,
      amountPaid,
      paymentMethod,
      op.notes,
      op.promised_date,
      generatedBy || null,
      now,
      now
    );

    const invoice = await db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoiceId);
    res.json(invoice);
  } catch (error) {
    console.error('Failed to generate invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

// Print invoice/receipt
router.post('/:id/print', async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await db.prepare('SELECT * FROM invoices WHERE id = ?').get(id) as any;

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Get operation details
    const operation = await db.prepare(`
      SELECT o.*, c.name as customer_name, c.phone as customer_phone
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `).get(invoice.operation_id) as any;

    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }

    // Get shoes and services
    const shoes = await db.prepare(`
      SELECT os.*, s.name as service_name, oss.price as service_price
      FROM operation_shoes os
      LEFT JOIN operation_services oss ON os.id = oss.operation_shoe_id
      LEFT JOIN services s ON oss.service_id = s.id
      WHERE os.operation_id = ?
    `).all(invoice.operation_id);
    const retailItems = await getRetailItems(invoice.operation_id);

    // Get payments
    const payments = invoice.type === 'receipt'
      ? await db.prepare('SELECT * FROM operation_payments WHERE operation_id = ?').all(invoice.operation_id)
      : [];

    // Format currency helper
    const formatCurrency = (amount: number) => {
      return `UGX ${amount.toLocaleString()}`;
    };

    // Lazily load printer modules
    let printerModule: any = null;
    let escposModule: any = null;
    try {
      printerModule = await import('node-thermal-printer');
    } catch (e) {
      console.warn('Thermal printer module not available, will simulate print');
    }
    try {
      escposModule = await import('escpos-usb');
    } catch (e) {
      console.warn('ESCUSB module not available, will simulate print');
    }

    if (!printerModule || !printerModule.ThermalPrinter) {
      // Simulate print for development without printer
      console.log('========== SIMULATED PRINT ==========');
      console.log(invoice.type === 'receipt' ? 'RECEIPT' : 'INVOICE');
      console.log('SHOE REPAIR POS');
      console.log('================================');
      console.log(`Document #: ${invoice.invoice_number}`);
      console.log(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`);
      console.log(`Customer: ${invoice.customer_name}`);
      if (invoice.customer_phone) console.log(`Phone: ${invoice.customer_phone}`);
      console.log('--------------------------------');
      console.log(invoice.type === 'receipt' ? 'PAYMENT RECEIVED' : 'SERVICES / PRODUCTS');
      console.log('--------------------------------');
      if (shoes.length > 0) {
        shoes.forEach((shoe: any) => {
          console.log(`[${shoe.category}]`);
          if (shoe.color) console.log(`  Color: ${shoe.color}`);
          if (shoe.service_name) console.log(`${shoe.service_name}: ${formatCurrency(shoe.service_price)}`);
          console.log('');
        });
      }
      if (retailItems.length > 0) {
        retailItems.forEach((item: any) => {
          console.log(`${item.product_name}`);
          console.log(`  Qty: ${item.quantity} x ${formatCurrency(item.unit_price)}`);
          console.log(`Subtotal: ${formatCurrency(item.total_price)}`);
        });
      }
      console.log('================================');
      console.log(`Subtotal: ${formatCurrency(invoice.subtotal)}`);
      if (invoice.discount > 0) console.log(`Discount: -${formatCurrency(invoice.discount)}`);
      console.log(`TOTAL: ${formatCurrency(invoice.total)}`);
      if (invoice.type === 'receipt') {
        console.log('================================');
        console.log('PAYMENT DETAILS');
        console.log(`Amount Paid: ${formatCurrency(invoice.amount_paid)}`);
        console.log(`Balance: ${formatCurrency(invoice.total - invoice.amount_paid)}`);
      }
      if (operation.promised_date) {
        console.log(`Pickup Date: ${new Date(operation.promised_date).toLocaleDateString()}`);
      }
      console.log('================================');
      console.log('Thank you for your business!');
      console.log('========== END SIMULATED PRINT ==========');

      return res.json({
        success: true,
        message: 'Printed successfully (simulated - no printer connected)',
        simulated: true
      });
    }

    const { ThermalPrinter } = printerModule;
    const { USB } = escposModule || {};

    // Printer configuration
    const printerConfig = {
      type: 'EPSON',
      interface: 'printer:auto',
      characterSet: 'PC437_USA',
      width: 42
    };

    try {
      // Create printer instance
      const printer = new ThermalPrinter(printerConfig);

      // Print header
      printer.alignCenter();
      printer.bold(true);
      printer.setTextSize(1, 1);
      printer.println(invoice.type === 'receipt' ? 'RECEIPT' : 'INVOICE');
      printer.bold(false);
      printer.setTextSize(0, 0);
      printer.println('================================');
      printer.println('SHOE REPAIR POS');
      printer.println('================================');
      printer.newLine();

      // Print document details
      printer.alignLeft();
      printer.bold(true);
      printer.println(`Document #: ${invoice.invoice_number}`);
      printer.bold(false);
      printer.println(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`);
      printer.println(`Customer: ${invoice.customer_name}`);
      if (invoice.customer_phone) {
        printer.println(`Phone: ${invoice.customer_phone}`);
      }
      printer.println('--------------------------------');

      // Print items header
      printer.bold(true);
      printer.println(invoice.type === 'receipt' ? 'PAYMENT RECEIVED' : 'SERVICES / PRODUCTS');
      printer.bold(false);
      printer.newLine();

      // Print repair items (services)
      if (shoes.length > 0) {
        shoes.forEach((shoe: any) => {
          printer.println(`[${shoe.category}]`);
          if (shoe.color) {
            printer.println(`  Color: ${shoe.color}`);
          }
          if (shoe.service_name) {
            printer.alignRight();
            printer.println(`${shoe.service_name}: ${formatCurrency(shoe.service_price)}`);
            printer.alignLeft();
          }
          printer.newLine();
        });
      }

      // Print retail items
      if (retailItems.length > 0) {
        printer.println('--------------------------------');
        retailItems.forEach((item: any) => {
          printer.println(`${item.product_name}`);
          printer.println(`  Qty: ${item.quantity} x ${formatCurrency(item.unit_price)}`);
          printer.alignRight();
          printer.println(`Subtotal: ${formatCurrency(item.total_price)}`);
          printer.alignLeft();
        });
        printer.newLine();
      }

      // Print totals
      printer.println('================================');
      printer.println(`Subtotal: ${formatCurrency(invoice.subtotal)}`);
      if (invoice.discount > 0) {
        printer.println(`Discount: -${formatCurrency(invoice.discount)}`);
      }
      printer.bold(true);
      printer.println(`TOTAL: ${formatCurrency(invoice.total)}`);
      printer.bold(false);

      // Print payment info for receipts
      if (invoice.type === 'receipt') {
        printer.newLine();
        printer.println('================================');
        printer.println('PAYMENT DETAILS');
        printer.println(`Amount Paid: ${formatCurrency(invoice.amount_paid)}`);
        const balance = invoice.total - invoice.amount_paid;
        if (balance > 0) {
          printer.println(`Balance Due: ${formatCurrency(balance)}`);
        } else {
          printer.println(`Balance: ${formatCurrency(0)}`);
        }

        // Print payment methods
        if (payments && payments.length > 0) {
          printer.newLine();
          payments.forEach((p: any) => {
            printer.println(`Payment (${p.payment_method}): ${formatCurrency(p.amount)}`);
          });
        }
      }

      // Print promised date if exists
      if (operation.promised_date) {
        printer.newLine();
        printer.alignCenter();
        printer.println(`Pickup Date: ${new Date(operation.promised_date).toLocaleDateString()}`);
      }

      // Footer
      printer.alignCenter();
      printer.newLine();
      printer.println('================================');
      printer.println('Thank you for your business!');
      printer.println('Please retain this receipt');
      printer.println('================================');
      printer.cut();

      // Execute print
      if (!USB) {
        return res.status(500).json({ error: 'USB printer not detected. Please check that the printer is connected and powered on.' });
      }
      const device = new USB();
      await printer.execute(device);
      res.json({ success: true, message: 'Printed successfully' });
    } catch (printError: any) {
      console.error('Printer error:', printError);
      return res.status(500).json({ error: `Print failed: ${printError.message}. Please check printer connection.` });
    }
  } catch (error) {
    console.error('Failed to print invoice:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Print failed: ${message}` });
  }
});

export default router;
