Zebra ZD220d — Printer Setup Instructions
Platform: Node.js  |  OS: Windows  |  Connection: USB  |  Print: 80mm Receipts

Step 1 — Install Package
npm install node-thermal-printer

Step 2 — Printer Config
Use this exact configuration — the printer name below is confirmed from the machine:
const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');

const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'printer:ZDesigner ZD220-203dpi ZPL',  // confirmed printer name
  characterSet: CharacterSet.PC437_USA,
  breakLine: BreakLine.WORD,
  width: 48,  // 80mm roll = 48 chars
  options: { timeout: 5000 }
});

Step 3 — Print a Receipt
printer.alignCenter();
printer.bold(true);
printer.println('BUSINESS NAME');
printer.bold(false);
printer.println('Address | Tel');
printer.drawLine();
printer.alignLeft();
printer.println(`Receipt: #${order.id}`);
printer.println(`Date: ${new Date().toLocaleString()}`);
printer.drawLine();
// loop items
for (const item of order.items) {
  printer.tableCustom([
    { text: item.name, align: 'LEFT',   width: 0.5  },
    { text: String(item.qty), align: 'CENTER', width: 0.15 },
    { text: `UGX ${item.price}`, align: 'RIGHT', width: 0.35 }
  ]);
}
printer.drawLine();
printer.alignRight();
printer.bold(true);
printer.println(`TOTAL: UGX ${order.total}`);
printer.bold(false);
printer.drawLine();
printer.alignCenter();
printer.println('Thank you!');
printer.newLine();
printer.cut();
await printer.execute();
printer.clear();

Key Settings
Printer Name	ZDesigner ZD220-203dpi ZPL
npm Package	node-thermal-printer
Type	PrinterTypes.EPSON
Width	48 (80mm roll)
Paper Darkness	Set to 15 in Windows Printer Preferences

If printer shows 'not connected' — check USB cable and confirm ZDesigner driver is installed from zebra.com