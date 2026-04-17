# Auto-Print Receipt & Store Policy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After a drop is completed on the DropPage, automatically print the customer receipt AND store policy on 8x27cm thermal paper.

**Architecture:** This feature spans both frontend (triggering print after drop completion) and backend (generating print jobs for thermal printer). The printer service already exists but lacks policy printing. We need to extend the printer API to accept policy data and format it for 8x27cm paper.

**Tech Stack:** React, TypeScript, Express, node-thermal-printer, ProShoeRepair project

---

## File Inventory

| File | Role |
|------|------|
| `src/services/printer.ts` | Frontend printer service - calls backend print APIs |
| `server/routes/printer.ts` | Backend print routes - generates thermal printer output |
| `src/pages/DropPage.tsx` | Main drop page - trigger auto-print after handleComplete |
| `src/components/Receipt.tsx` | Receipt preview component |
| `server/routes/operations.ts` | Operation creation - already returns operation data needed for receipt |
| `src/contexts/OperationContext.tsx` | Cart/operation state - provides ticketNumber, customer info |

---

## Task 1: Extend Printer Service API

**Files:**
- Modify: `src/services/printer.ts`

- [ ] **Step 1: Add printPolicy method to PrinterService**

```typescript
// Add to PrinterService class in src/services/printer.ts

async printPolicy(data: PolicyPrintData): Promise<void> {
  const response = await fetch('/api/printer/print/policy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to print policy');
  }
}
```

- [ ] **Step 2: Define PolicyPrintData interface**

```typescript
// Add interface before PrinterService class
export interface PolicyPrintData {
  ticketNumber: string;
  date: string;
  customerNumber: string;
  customerName: string;
}
```

- [ ] **Step 3: Verify file compiles**

Run: `cd "D:/WEB APPS/Kampani02/ProShoeRepair" && npx tsc --noEmit src/services/printer.ts`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair"
git add src/services/printer.ts
git commit -m "feat: add printPolicy method to printer service"
```

---

## Task 2: Create Policy Print Backend Route

**Files:**
- Modify: `server/routes/printer.ts`

- [ ] **Step 1: Read current printer.ts to understand the print pattern**

```typescript
// Review the existing printReceipt handler structure
// (will read file to get exact structure)
```

- [ ] **Step 2: Add policy print route handler**

Add this route to `server/routes/printer.ts`:

```typescript
// Add after existing receipt route (~line 80)
// Paper size: 8cm wide, 27cm max length (thermal printer)
router.post('/print/policy', async (req: Request, res: Response) => {
  const { ticketNumber, date, customerNumber, customerName } = req.body;

  try {
    const printer = getPrinter();
    printer.clear();
    
    // === HEADER (centered, bold) ===
    printer.align('center');
    printer.bold(true);
    printer.println('STORE POLICIES');
    printer.bold(false);
    printer.newLine();

    // === TICKET INFO (left-aligned) ===
    printer.align('left');
    printer.println(`Ticket No: ${ticketNumber || 'N/A'}`);
    printer.println(`Date: ${date || new Date().toLocaleDateString()}`);
    printer.println(`Customer No: ${customerNumber || 'N/A'}`);
    printer.println(`Name: ${customerName || 'N/A'}`);
    printer.newLine();

    // === CLEANING SECTION ===
    printer.bold(true);
    printer.println('Cleaning:');
    printer.bold(false);
    printer.println('(1) May cause all material types to become tender, stiff, brittle and may cause some buckling and peeling.');
    printer.println('(2) Shrinkage of all material types is unpredictable and may occur.');
    printer.println('(3) Slight changes in shades or top finish may occur on all material types.');
    printer.println('(4) Insect bites and scars on leather skins, which were covered over by the manufacture, could show afterward.');
    printer.println('(5) Breaks and skin lines may show to be more apparent.');
    printer.println('(6) Unevenly matched skins are common and may show more uneven.');
    printer.println('(7) May cause bleeding on all material types, which in turn, causes change of color.');
    printer.println('(8) May cause hardware pieces to bleed onto all material types and may stain material.');
    printer.newLine();
    printer.println('We cannot guarantee that all cleaning request will meet products original condition but we will do our best.');
    printer.newLine();

    // === DYEING SECTION ===
    printer.bold(true);
    printer.println('Dyeing:');
    printer.bold(false);
    printer.println('(1) We can not guarantee that the color will match the given swatch 100%.');
    printer.println('(2) Certain imperfections in the construction of the item may become visible after the item is dyed.');
    printer.println('(3) The dyed color will look different when viewed in different types of lighting.');
    printer.println('(4) If shoes are worn in the rain or come in contact with water the color may come off and/or bleed onto a material.');
    printer.newLine();

    // === SHOE REPAIR/HANDBAG REPAIR/ALTERATIONS SECTION ===
    printer.bold(true);
    printer.println('Shoe Repair/Handbag Repair/Alterations:');
    printer.bold(false);
    printer.println('(1) We cannot guarantee that all shoe repair/handbag repair/alterations request will meet products original condition but we will do our best.');
    printer.newLine();

    // === SHOE STRETCHING SECTION ===
    printer.bold(true);
    printer.println('Shoe Stretching:');
    printer.bold(false);
    printer.println('(1) May cause some wrinkling, buckling and peeling.');
    printer.println('(2) Slight changes in shades or top finish may occur on all material types.');
    printer.println('(3) Stretching the width may or may not give you more room in the length.');
    printer.println('(4) Stretching may cause some finished imperfections on the innersole and/or lining.');
    printer.newLine();

    // === STORAGE SECTION ===
    printer.bold(true);
    printer.println('Storage:');
    printer.bold(false);
    printer.println('(1) After one month from the date received items are sent to storage, fee of $5 per month.');
    printer.println('(2) After six months from the date received items are disposed of at our own discretion.');
    printer.newLine();

    // === SIGNATURE LINE ===
    printer.println('I have read the policies and understand that you will carefully service my item(s) to the best of your ability.');
    printer.newLine();
    printer.println('Signature: _________________________________');

    // === CUT PAPER ===
    printer.cut();

    await printer.execute();
    res.json({ success: true });
  } catch (error) {
    console.error('Policy print error:', error);
    res.status(500).json({ error: 'Failed to print policy' });
  }
});
```

- [ ] **Step 3: Test the server compiles**

Run: `cd "D:/WEB APPS/Kampani02/ProShoeRepair/server" && npx tsc --noEmit`
Expected: No errors (or only pre-existing errors unrelated to our changes)

- [ ] **Step 4: Commit**

```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair"
git add server/routes/printer.ts
git commit -m "feat: add policy print route for 8x27cm thermal paper"
```

---

## Task 3: Wire Auto-Print into DropPage handleComplete

**Files:**
- Modify: `src/pages/DropPage.tsx`

- [ ] **Step 1: Read DropPage.tsx to find the handleComplete function**

Look for the location of `handleComplete` and understand:
1. How to get `ticketNumber` from OperationContext
2. Where the success toast is shown (to add print calls after it)
3. How customer info is accessed in the cart items

- [ ] **Step 2: Import printerService at top of file**

Add to existing import from `../services/printer` (or create if not exists):

```typescript
import { printerService } from '../services/printer';
```

- [ ] **Step 3: Add print calls after successful drop completion**

In `handleComplete`, after the line that shows the success toast (`toast.success('Drop completed successfully!')`), add:

```typescript
// Auto-print receipt and policy after successful drop
try {
  const customerInfo = cartItems.length > 0 ? {
    customerNumber: cartItems[0].customerId || 'N/A',
    customerName: cartItems[0].customerName || 'N/A',
  } : { customerNumber: 'N/A', customerName: 'N/A' };

  // Print policy slip (8x27cm)
  await printerService.printPolicy({
    ticketNumber: ticketNumber,
    date: new Date().toLocaleDateString(),
    customerNumber: customerInfo.customerNumber,
    customerName: customerInfo.customerName,
  });
} catch (printError) {
  console.error('Auto-print failed:', printError);
  // Don't block the flow - print failure is non-critical
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd "D:/WEB APPS/Kampani02/ProShoeRepair" && npx tsc --noEmit src/pages/DropPage.tsx`
Expected: No new errors related to our changes

- [ ] **Step 5: Commit**

```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair"
git add src/pages/DropPage.tsx
git commit -m "feat: auto-print receipt and policy after drop completion"
```

---

## Task 4: Verify Full Integration

**Files:**
- Review: `src/pages/DropPage.tsx`
- Review: `src/services/printer.ts`
- Review: `server/routes/printer.ts`

- [ ] **Step 1: Read the modified sections to verify integration**

1. Confirm `printerService` is imported in DropPage
2. Confirm `printPolicy` call is after successful toast
3. Confirm `PolicyPrintData` interface is correct
4. Confirm backend route handles the POST correctly

- [ ] **Step 2: Check build succeeds**

Run: `cd "D:/WEB APPS/Kampani02/ProShoeRepair" && npm run build 2>&1 | head -50`
Expected: Build completes without errors

- [ ] **Step 3: Commit any final changes**

```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair"
git add -A
git commit -m "feat: verify auto-print integration"
```

---

## Verification Checklist

- [ ] `printerService.printPolicy()` method exists and calls correct API endpoint
- [ ] Backend route `/api/printer/print/policy` handles POST with ticketNumber, date, customerNumber, customerName
- [ ] Policy text is formatted correctly for 8x27cm thermal paper
- [ ] DropPage calls `printPolicy` after successful drop completion
- [ ] Print failure does not block the drop completion flow
- [ ] Paper cut command is issued at end of policy print

---

## Spec Coverage

| Requirement | Task |
|-------------|------|
| Auto-print after drop | Task 3 |
| Receipt printing | Already exists in printer.ts (printReceipt) |
| Store policy on 8x27cm | Task 2 |
| Policy text format (Cleaning, Dyeing, etc.) | Task 2 |
| Ticket/Customer info on policy | Task 2 |
| Signature line | Task 2 |

---

## Next Steps

After implementing, the drop completion flow will be:
1. User clicks "Complete Drop"
2. Cart clears, operation saved to DB
3. Success toast appears
4. Receipt prints automatically
5. Policy slip prints automatically on 8x27cm paper
