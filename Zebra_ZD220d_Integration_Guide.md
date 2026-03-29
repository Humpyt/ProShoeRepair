**ZEBRA ZD220d**

**Printer Integration Guide**

For POS System — Node.js / Windows

**Printer Specifications**

| Model | Zebra ZD220d |
| :---- | :---- |
| **Serial Number** | D4J244109846 |
| **Mfg Date** | 10/12/2024 |
| **Input Power** | 24VDC — 2.5A |
| **Print Method** | Direct Thermal (no ribbon) |
| **Connection** | USB (Windows) |
| **Paper Width** | 80mm roll |
| **Printer Name (Windows)** | ZDesigner ZD220-203dpi ZPL |

# **1\. Prerequisites**

Ensure the following are installed and configured on the developer machine before proceeding:

* Node.js v16 or higher

* npm (comes with Node.js)

* Zebra ZDesigner Driver installed (download from zebra.com)

* Printer connected via USB and powered ON

* Windows recognizes it as: ZDesigner ZD220-203dpi ZPL

**Verify printer is visible in Windows:**

\# Run in Command Prompt:  
wmic printer get name

\# Expected output should include:  
ZDesigner ZD220-203dpi ZPL

# **2\. Installation**

## **2.1 Install npm Package**

npm install node-thermal-printer

## **2.2 Windows Printer Settings**

Go to Control Panel → Devices and Printers → Right-click ZD220d → Printing Preferences and configure:

| Paper Size | Custom: 80mm x 297mm |
| :---- | :---- |
| **Print Quality** | 203 dpi |
| **Darkness** | 15 (adjust if too light/dark) |
| **Orientation** | Portrait |

# **3\. Printer Configuration (Copy-Paste Ready)**

Use this exact configuration object in your Node.js project:

const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } \= require('node-thermal-printer');

const printer \= new ThermalPrinter({  
  type: PrinterTypes.EPSON,            // ZD220d uses ESC/POS mode  
  interface: 'printer:ZDesigner ZD220-203dpi ZPL', // Exact Windows printer name  
  characterSet: CharacterSet.PC437\_USA,  
  breakLine: BreakLine.WORD,  
  removeSpecialCharacters: false,  
  lineCharacter: '-',  
  width: 48,                           // 80mm \= 48 characters wide  
  options: {  
    timeout: 5000  
  }  
});

# **4\. Test Print**

Create a file called test.js and run it to confirm the printer is working:

const { ThermalPrinter, PrinterTypes, CharacterSet } \= require('node-thermal-printer');

async function testPrint() {  
  const printer \= new ThermalPrinter({  
    type: PrinterTypes.EPSON,  
    interface: 'printer:ZDesigner ZD220-203dpi ZPL',  
    characterSet: CharacterSet.PC437\_USA,  
    width: 48  
  });

  const connected \= await printer.isPrinterConnected();  
  console.log('Printer connected:', connected);

  if (\!connected) {  
    console.log('Check USB cable and that printer is ON');  
    return;  
  }

  printer.alignCenter();  
  printer.bold(true);  
  printer.println('\*\* TEST PRINT \*\*');  
  printer.bold(false);  
  printer.println('Zebra ZD220d Working\!');  
  printer.newLine();  
  printer.cut();

  await printer.execute();  
  console.log('Test print successful\!');  
}

testPrint();

Run with:

node test.js

Expected terminal output:

Printer connected: true  
Test print successful\!

# **5\. Full Receipt Print Function**

This is the complete receipt printing function for the POS system:

const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } \= require('node-thermal-printer');

async function printReceipt(order) {  
  const printer \= new ThermalPrinter({  
    type: PrinterTypes.EPSON,  
    interface: 'printer:ZDesigner ZD220-203dpi ZPL',  
    characterSet: CharacterSet.PC437\_USA,  
    breakLine: BreakLine.WORD,  
    width: 48  
  });

  try {  
    const isConnected \= await printer.isPrinterConnected();  
    if (\!isConnected) throw new Error('Printer not connected');

    // ── HEADER ──  
    printer.alignCenter();  
    printer.bold(true);  
    printer.setTextSize(1, 1);  
    printer.println('YOUR BUSINESS NAME');  
    printer.bold(false);  
    printer.setTextNormal();  
    printer.println('123 Main Street, Kampala');  
    printer.println('Tel: \+256 700 000000');  
    printer.drawLine();

    // ── ORDER INFO ──  
    printer.alignLeft();  
    printer.println(\`Date   : ${new Date().toLocaleString()}\`);  
    printer.println(\`Receipt: \#${order.id}\`);  
    printer.println(\`Cashier: ${order.cashier}\`);  
    printer.drawLine();

    // ── ITEMS HEADER ──  
    printer.bold(true);  
    printer.tableCustom(\[  
      { text: 'Item',  align: 'LEFT',   width: 0.5  },  
      { text: 'Qty',   align: 'CENTER', width: 0.15 },  
      { text: 'Price', align: 'RIGHT',  width: 0.35 }  
    \]);  
    printer.bold(false);  
    printer.drawLine();

    // ── ITEMS ──  
    for (const item of order.items) {  
      printer.tableCustom(\[  
        { text: item.name,                      align: 'LEFT',   width: 0.5  },  
        { text: String(item.qty),               align: 'CENTER', width: 0.15 },  
        { text: \`UGX ${item.price.toFixed(0)}\`, align: 'RIGHT',  width: 0.35 }  
      \]);  
    }

    printer.drawLine();

    // ── TOTALS ──  
    printer.alignRight();  
    printer.println(\`Subtotal : UGX ${order.subtotal.toFixed(0)}\`);  
    printer.println(\`Tax(18%) : UGX ${order.tax.toFixed(0)}\`);  
    printer.bold(true);  
    printer.println(\`TOTAL    : UGX ${order.total.toFixed(0)}\`);  
    printer.bold(false);  
    printer.println(\`Paid     : UGX ${order.paid.toFixed(0)}\`);  
    printer.println(\`Change   : UGX ${order.change.toFixed(0)}\`);  
    printer.drawLine();

    // ── FOOTER ──  
    printer.alignCenter();  
    printer.println('Thank you for your purchase\!');  
    printer.println('Goods once sold are NOT returnable');  
    printer.newLine();  
    printer.newLine();  
    printer.cut();

    await printer.execute();  
    printer.clear();  
    return { success: true };

  } catch (error) {  
    console.error('Print failed:', error);  
    return { success: false, error: error.message };  
  }  
}

module.exports \= { printReceipt };

# **6\. Express.js API Endpoint**

To trigger printing from your POS frontend via HTTP, add this endpoint to your Express server:

const express \= require('express');  
const { printReceipt } \= require('./printer');  // import from above

const app \= express();  
app.use(express.json());

// POST /print-receipt  
app.post('/print-receipt', async (req, res) \=\> {  
  const order \= req.body;

  if (\!order || \!order.items || \!order.total) {  
    return res.status(400).json({ error: 'Invalid order data' });  
  }

  const result \= await printReceipt(order);

  if (result.success) {  
    res.json({ message: 'Receipt printed successfully' });  
  } else {  
    res.status(500).json({ error: result.error });  
  }  
});

app.listen(3000, () \=\> console.log('POS server running on port 3000'));

## **Example API Request from Frontend**

fetch('http://localhost:3000/print-receipt', {  
  method: 'POST',  
  headers: { 'Content-Type': 'application/json' },  
  body: JSON.stringify({  
    id: '00123',  
    cashier: 'Alice',  
    items: \[  
      { name: 'Soda 500ml', qty: 2, price: 3000 },  
      { name: 'Bread Loaf', qty: 1, price: 8000 },  
    \],  
    subtotal: 14000,  
    tax:       2520,  
    total:    16520,  
    paid:     20000,  
    change:    3480  
  })  
});

# **7\. Troubleshooting**

| Problem | Solution |
| :---- | :---- |
| Printer connected: false | Check USB cable. Ensure ZDesigner driver is installed. Restart printer. |
| Printer not found in wmic | Reinstall ZDesigner driver from zebra.com. Replug USB. |
| Print is blank/faded | Increase Darkness setting in Printing Preferences (set to 20+). |
| Text cut off on right side | Confirm width is set to 48 in printer config. Check paper is 80mm. |
| Receipt doesn't cut | ZD220d is a tear-off model. Call printer.cut() for a feed, then tear manually. |

# **8\. Quick Reference Summary**

| npm package | node-thermal-printer |
| :---- | :---- |
| **Printer type** | PrinterTypes.EPSON |
| **Interface** | printer:ZDesigner ZD220-203dpi ZPL |
| **Character set** | CharacterSet.PC437\_USA |
| **Paper width** | 48 characters (80mm) |
| **Protocol** | ESC/POS |
| **API endpoint** | POST /print-receipt |
| **OS** | Windows (USB) |

*— End of Document —*