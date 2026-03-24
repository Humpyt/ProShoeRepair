# Design Consistency Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the PickupPage design system to Hold & Quick Drop, Sales, Sales Items, and Marketing pages for visual consistency across the POS application.

**Architecture:** This is a UI consistency refactor that updates four existing pages to match the established design system from PickupPage.tsx. No backend changes required - purely frontend styling updates using Tailwind CSS classes.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React icons

---

## Design System Reference (from PickupPage.tsx)

### Core Styling Patterns:
- **Page Background:** `bg-gray-900` with `min-h-screen p-6`
- **Card Component:** `card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900`
- **Input Fields:** `bg-gray-700/50 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`
- **Primary Buttons:** `bg-indigo-600 text-white hover:bg-indigo-700`
- **Secondary Buttons:** `bg-gray-800/50 text-gray-300 hover:text-white bg-gray-800/50 rounded-lg transition-colors`
- **Table Headers:** `bg-gray-800/80 backdrop-blur-sm sticky top-0` with `text-sm font-medium text-gray-300`
- **Table Rows:** `divide-y divide-gray-800` with hover states `hover:bg-gray-800/60`
- **Status Badges:** `inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium` with color-coded backgrounds (e.g., `bg-green-900/40 text-green-400`)
- **Text Colors:** `text-gray-200` (primary), `text-gray-300` (secondary), `text-gray-400` (tertiary)
- **Icons:** Colored to match context (indigo-400, green-400, etc.)
- **Spacing:** `space-y-6` for vertical layouts, `gap-6` for grids
- **Borders:** `border-gray-700/50` for subtle separation

---

## File Structure

### Files to Modify:
- `src/pages/HoldQuickDropPage.tsx` - Complete redesign (remove MUI, apply custom design system)
- `src/pages/SalesPage.tsx` - Update to match design system patterns
- `src/pages/SalesItems.tsx` - Update to match design system patterns
- `src/pages/MarketingPage.tsx` - Update to match design system patterns

### Files to Reference:
- `src/pages/PickupPage.tsx` - Source of truth for design system

---

## Task 1: Refactor HoldQuickDropPage.tsx

**Files:**
- Modify: `src/pages/HoldQuickDropPage.tsx:1-149`

**Context:** This page currently uses Material-UI components (Card, Typography, Button, Timeline) which conflicts with the rest of the app's custom design system. Need to remove all MUI dependencies and rebuild using the PickupPage design patterns.

- [ ] **Step 1: Remove Material-UI imports**

```typescript
// Remove these imports:
import { Card, Typography, Button } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator,
         TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { AccessTime, Info, Person } from '@mui/icons-material';

// Replace with:
import { Search, Package, DollarSign, Calendar, Clock, User, Plus, Filter, Download } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
```

- [ ] **Step 2: Update page container and background**

```typescript
// Replace the entire return statement starting at line 18:
return (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="grid grid-cols-12 gap-6">
      {/* Content will be added in next steps */}
    </div>
  </div>
);
```

- [ ] **Step 3: Add header section with stats**

```typescript
{/* Add inside grid, before main content */}
<div className="col-span-12 card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-gray-200">Hold & Quick Drop</h1>
      <p className="text-gray-400 text-sm mt-1">Manage items on hold and quick drop requests</p>
    </div>
    <div className="flex space-x-3">
      <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
        <Plus className="h-4 w-4" />
        <span>Add Hold</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>
    </div>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-4">
    <div className="flex items-center space-x-3 bg-gray-800/50 p-4 rounded-lg">
      <Package className="h-8 w-8 text-indigo-400" />
      <div>
        <p className="text-sm text-gray-400">Total Items</p>
        <p className="text-2xl font-bold text-white">15</p>
      </div>
    </div>
    <div className="flex items-center space-x-3 bg-gray-800/50 p-4 rounded-lg">
      <Clock className="h-8 w-8 text-orange-400" />
      <div>
        <p className="text-sm text-gray-400">Due Today</p>
        <p className="text-2xl font-bold text-white">5</p>
      </div>
    </div>
    <div className="flex items-center space-x-3 bg-gray-800/50 p-4 rounded-lg">
      <DollarSign className="h-8 w-8 text-green-400" />
      <div>
        <p className="text-sm text-gray-400">Quick Drops</p>
        <p className="text-2xl font-bold text-white">3</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Add search and filter section**

```typescript
{/* Add after header section */}
<div className="col-span-12 card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
  <div className="flex items-center space-x-4">
    <div className="flex-1 relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search holds by customer, item, or date..."
        className="w-full pl-12 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-white placeholder-gray-400"
      />
    </div>
    <button className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
      <Filter className="h-4 w-4" />
      <span>Filter</span>
    </button>
  </div>
</div>
```

- [ ] **Step 5: Add items table**

```typescript
{/* Add after filter section */}
<div className="col-span-12 card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
  <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
    <table className="w-full">
      <thead className="bg-gray-800/80 backdrop-blur-sm sticky top-0">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Customer</th>
          <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Item</th>
          <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Hold Date</th>
          <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Expected</th>
          <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Status</th>
          <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {/* Sample row - map through actual data */}
        <tr className="hover:bg-gray-800/60 transition-colors">
          <td className="px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-indigo-900/50 flex items-center justify-center">
                <User className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200">James Wilson</div>
                <div className="text-xs text-gray-400">555-0123</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-300">2x Dress Shoes - Polish & Repair</td>
          <td className="px-6 py-4 text-sm text-gray-300">Jan 18, 2025</td>
          <td className="px-6 py-4 text-sm text-gray-300">Jan 20, 2025</td>
          <td className="px-6 py-4 text-center">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/40 text-yellow-400">
              Pending
            </span>
          </td>
          <td className="px-6 py-4 text-right">
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              View Details
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

- [ ] **Step 6: Update interface types**

```typescript
// Update the HoldItem interface to remove Date type and use string:
interface HoldItem {
  id: string;
  customerName: string;
  customerPhone: string;
  itemDescription: string;
  holdDate: string;
  expectedCompletion: string;
  status: 'pending' | 'in-progress' | 'ready';
}
```

- [ ] **Step 7: Run app to verify changes**

Run: Visit http://localhost:5173 in browser, navigate to Hold & Quick Drop page
Expected: Page displays with dark theme, no Material-UI components, matches PickupPage styling

- [ ] **Step 8: Commit changes**

```bash
git add src/pages/HoldQuickDropPage.tsx
git commit -m "refactor: update HoldQuickDropPage to match design system"
```

---

## Task 2: Refactor SalesPage.tsx

**Files:**
- Modify: `src/pages/SalesPage.tsx:131-334`

**Context:** SalesPage already has a good foundation but needs consistency updates to match PickupPage patterns exactly. Main issues: inconsistent padding, gradient background, and card styling.

- [ ] **Step 1: Update page container padding**

```typescript
// Change line 131 from:
<div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">

// To:
<div className="min-h-screen bg-gray-900 p-6">
```

- [ ] **Step 2: Update stats cards to use card-bevel pattern**

```typescript
// Update the stats grid section (lines 150-204) to use consistent styling:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 font-medium">Repairs</p>
        <p className="text-3xl font-bold text-white mt-2">
          {sales.filter(s => s.sale_type === 'repair').length}
        </p>
        <p className="text-sm text-gray-500 mt-1">Total repair orders</p>
      </div>
      <div className="w-14 h-14 rounded-xl bg-green-900/20 flex items-center justify-center">
        <Wrench className="h-7 w-7 text-green-500" />
      </div>
    </div>
  </div>

  <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 font-medium">Retail Sales</p>
        <p className="text-3xl font-bold text-white mt-2">
          {sales.filter(s => s.sale_type === 'retail').length}
        </p>
        <p className="text-sm text-gray-500 mt-1">Products sold</p>
      </div>
      <div className="w-14 h-14 rounded-xl bg-purple-900/20 flex items-center justify-center">
        <ShoppingBag className="h-7 w-7 text-purple-500" />
      </div>
    </div>
  </div>

  <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 font-medium">Pickups</p>
        <p className="text-3xl font-bold text-white mt-2">
          {sales.filter(s => s.sale_type === 'pickup').length}
        </p>
        <p className="text-sm text-gray-500 mt-1">Orders picked up</p>
      </div>
      <div className="w-14 h-14 rounded-xl bg-orange-900/20 flex items-center justify-center">
        <Package className="h-7 w-7 text-orange-500" />
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Update filter section styling**

```typescript
// Update filter section (lines 207-258) to use card-bevel:
<div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900 mb-6">
  <div className="flex items-center space-x-2 mb-4">
    <Search className="h-5 w-5 text-indigo-400" />
    <h2 className="text-lg font-medium text-gray-200">Filter Sales</h2>
  </div>
  {/* Rest of filter content remains similar but ensure inputs use: */}
  <input
    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 text-white"
  />
</div>
```

- [ ] **Step 4: Update sales table card**

```typescript
// Update sales table section (line 261) to use card-bevel:
<div className="card-bevel bg-gradient-to-br from-gray-800 to-gray-900">
  <div className="p-6 border-b border-gray-700">
    <h2 className="text-lg font-medium text-gray-200">Sales History</h2>
  </div>
  {/* Rest of table content */}
</div>
```

- [ ] **Step 5: Update header total display card**

```typescript
// Update the header total display (lines 138-146) to match card styling:
<div className="card-bevel px-6 py-4 bg-gradient-to-br from-gray-800 to-gray-900">
  <div className="flex items-center space-x-3">
    <DollarSign className="h-6 w-6 text-indigo-400" />
    <div>
      <p className="text-sm text-gray-400">Total Sales</p>
      <p className="text-2xl font-bold text-white">{formatCurrency(totalSales)}</p>
    </div>
  </div>
</div>
```

- [ ] **Step 6: Run app to verify changes**

Run: Visit http://localhost:5173 in browser, navigate to Sales page
Expected: Page displays with consistent padding, card-bevel styling, matches PickupPage

- [ ] **Step 7: Commit changes**

```bash
git add src/pages/SalesPage.tsx
git commit -m "refactor: update SalesPage to match design system"
```

---

## Task 3: Refactor SalesItems.tsx

**Files:**
- Modify: `src/pages/SalesItems.tsx:124-383`

**Context:** SalesItems has gradient buttons and a white cart sidebar that don't match the design system. Need to update button styles, cart sidebar, and ensure consistent dark theme throughout.

- [ ] **Step 1: Update header gradient to use card-bevel**

```typescript
// Change lines 126-170 (header section) to:
<div className="card-bevel p-6 mb-6 bg-gradient-to-br from-gray-800 to-gray-900">
  <div className="flex items-center justify-between">
    <div className="flex-1 flex items-center space-x-4">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-white placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    <div className="flex items-center space-x-4">
      <Link
        to="/manage-categories"
        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Tag size={18} />
        <span>Manage Categories</span>
      </Link>

      <button
        onClick={() => setShowCart(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <DollarSign size={18} />
        <span>Discount</span>
      </button>

      <button
        onClick={() => setShowCart(true)}
        className="relative flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <ShoppingCart size={18} />
        <span>Cart ({cart.length})</span>
      </button>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Update totals section to use card-bevel**

```typescript
// Change lines 173-208 to:
<div className="card-bevel p-6 mb-6 bg-gradient-to-br from-gray-800 to-gray-900">
  <div className="flex justify-between items-center">
    <div className="flex space-x-8">
      <div>
        <span className="text-gray-400">Subtotal</span>
        <div className="text-white">${subtotal.toFixed(2)}</div>
      </div>
      <div>
        <span className="text-gray-400">Discount/Upcharge</span>
        <div className="text-white">${discountOrUpcharge.toFixed(2)}</div>
      </div>
      <div>
        <span className="text-gray-400">Tax</span>
        <div className="text-white">${tax.toFixed(2)}</div>
      </div>
      <div>
        <span className="text-gray-400">Total</span>
        <div className="text-green-500 font-bold">${total.toFixed(2)}</div>
      </div>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={handleTaxableClick}
        className={`px-4 py-2 rounded-lg transition-colors ${
          isTaxable
            ? 'bg-green-600 text-white'
            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <span>Taxable</span>
      </button>
      <button
        onClick={handleReceiptClick}
        className={`px-4 py-2 rounded-lg transition-colors ${
          isReceipt
            ? 'bg-green-600 text-white'
            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <span>Receipt</span>
      </button>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Update cart sidebar to dark theme**

```typescript
// Change lines 254-330 (cart sidebar) to:
<div
  className={`fixed right-0 top-0 h-screen w-96 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl transform transition-transform duration-300 ${
    showCart ? 'translate-x-0' : 'translate-x-full'
  }`}
>
  <div className="h-full flex flex-col">
    <div className="p-6 border-b border-gray-700 flex justify-between items-center">
      <h2 className="text-xl font-bold text-gray-200">Shopping Cart</h2>
      <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white">
        <X size={24} />
      </button>
    </div>
    <div className="flex-1 overflow-auto p-6">
      {cart.map((item, index) => (
        <div key={index} className="flex justify-between items-center p-4 mb-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
          <div className="flex items-center space-x-4">
            <img
              src={item.item.imageUrl || '/placeholder.png'}
              alt={item.item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <div className="font-medium text-gray-200">{item.item.name}</div>
              <div className="text-sm text-gray-400">
                ${item.item.price.toFixed(2)} x {item.quantity}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-medium text-gray-200">{item.quantity}</span>
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
    <div className="p-6 border-t border-gray-700">
      <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
        <ShoppingCart size={20} />
        <span>Complete Purchase</span>
      </button>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Update delete modal to dark theme**

```typescript
// Change lines 333-359 (delete modal) to:
{isDeleteModalOpen && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 w-96 border border-gray-700">
      <h2 className="text-lg font-bold text-gray-200 mb-2">Confirm Delete Category</h2>
      <p className="text-gray-400 mb-4">Are you sure you want to delete this category?</p>
      {categoryUsage[deleteCategoryId] > 0 && (
        <p className="text-red-400 mb-4">
          Warning: This category has {categoryUsage[deleteCategoryId]} items assigned.
        </p>
      )}
      <div className="flex justify-between">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="bg-gray-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmDeleteCategory}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
```

- [ ] **Step 5: Update category buttons**

```typescript
// Change lines 211-225 (category buttons) to ensure consistent styling:
<button
  key={category.id}
  onClick={() => setSelectedCategory(category.id)}
  className={`p-3 text-gray-200 rounded-lg transition-colors ${
    selectedCategory === category.id
      ? 'bg-indigo-600'
      : 'bg-gray-800 hover:bg-gray-700'
  }`}
>
  {category.name}
</button>
```

- [ ] **Step 6: Run app to verify changes**

Run: Visit http://localhost:5173 in browser, navigate to Sales Items page
Expected: Dark theme throughout, cart sidebar uses dark colors, buttons match design system

- [ ] **Step 7: Commit changes**

```bash
git add src/pages/SalesItems.tsx
git commit -m "refactor: update SalesItems page to match design system"
```

---

## Task 4: Refactor MarketingPage.tsx

**Files:**
- Modify: `src/pages/MarketingPage.tsx:240-298`

**Context:** MarketingPage uses `bg-gray-800` for cards instead of the gradient pattern, and has inconsistent button styles. Need to update to card-bevel pattern and ensure consistent styling.

- [ ] **Step 1: Update header styling**

```typescript
// Change lines 242-254 to:
<div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-2xl font-bold text-gray-200">Marketing</h1>
    <p className="text-gray-400">Manage marketing campaigns and communications</p>
  </div>
  <button
    className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
    onClick={() => setShowCampaignForm(true)}
  >
    <Plus className="h-5 w-5" />
    <span>New Campaign</span>
  </button>
</div>
```

- [ ] **Step 2: Update navigation tabs styling**

```typescript
// Change lines 257-285 to:
<div className="flex gap-4 mb-6">
  <button
    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
      selectedTab === 'campaigns'
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
    }`}
    onClick={() => setSelectedTab('campaigns')}
  >
    <Megaphone className="h-5 w-5" />
    Campaigns
  </button>
  <button
    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
      selectedTab === 'communications'
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
    }`}
    onClick={() => setSelectedTab('communications')}
  >
    <MessageSquare className="h-5 w-5" />
    Communications
  </button>
  <button
    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
      selectedTab === 'analytics'
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
    }`}
    onClick={() => setSelectedTab('analytics')}
  >
    <BarChart2 className="h-5 w-5" />
    Analytics
  </button>
</div>
```

- [ ] **Step 3: Update stats cards to use card-bevel**

```typescript
// Change lines 131-164 (quick stats section) to:
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  <div className="card-bevel p-4 bg-gradient-to-br from-gray-800 to-gray-900">
    <div className="flex items-center gap-2 text-emerald-400 mb-2">
      <Users className="h-5 w-5" />
      <span className="text-gray-300">Total Customers</span>
    </div>
    <div className="text-2xl font-bold text-white">2,547</div>
    <div className="text-sm text-gray-400">+12% from last month</div>
  </div>

  <div className="card-bevel p-4 bg-gradient-to-br from-gray-800 to-gray-900">
    <div className="flex items-center gap-2 text-blue-400 mb-2">
      <Megaphone className="h-5 w-5" />
      <span className="text-gray-300">Active Campaigns</span>
    </div>
    <div className="text-2xl font-bold text-white">{campaigns.filter(c => c.status === 'active').length}</div>
    <div className="text-sm text-gray-400">{campaigns.filter(c => c.status === 'scheduled').length} scheduled</div>
  </div>

  <div className="card-bevel p-4 bg-gradient-to-br from-gray-800 to-gray-900">
    <div className="flex items-center gap-2 text-purple-400 mb-2">
      <Mail className="h-5 w-5" />
      <span className="text-gray-300">Email Open Rate</span>
    </div>
    <div className="text-2xl font-bold text-white">68%</div>
    <div className="text-sm text-gray-400">Industry avg: 45%</div>
  </div>

  <div className="card-bevel p-4 bg-gradient-to-br from-gray-800 to-gray-900">
    <div className="flex items-center gap-2 text-yellow-400 mb-2">
      <Gift className="h-5 w-5" />
      <span className="text-gray-300">Promotion Usage</span>
    </div>
    <div className="text-2xl font-bold text-white">245</div>
    <div className="text-sm text-gray-400">Last 30 days</div>
  </div>
</div>
```

- [ ] **Step 4: Update campaigns list card**

```typescript
// Change line 167 (campaigns list) to:
<div className="card-bevel rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
  <div className="p-4 border-b border-gray-700">
    <h2 className="text-lg font-semibold text-gray-200">Active Campaigns</h2>
  </div>
  <div className="divide-y divide-gray-700">
    {/* Campaign items */}
  </div>
</div>
```

- [ ] **Step 5: Update campaign item hover state**

```typescript
// Change line 173 (campaign item div) to:
<div key={campaign.id} className="p-4 hover:bg-gray-700/50 transition-colors">
```

- [ ] **Step 6: Update status badge styling**

```typescript
// Update getStatusColor function (lines 95-108) to return consistent classes:
const getStatusColor = (status: Campaign['status']) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-700/50 text-gray-300';
    case 'scheduled':
      return 'bg-blue-900/40 text-blue-400';
    case 'active':
      return 'bg-green-900/40 text-green-400';
    case 'completed':
      return 'bg-purple-900/40 text-purple-400';
    default:
      return 'bg-gray-700/50 text-gray-300';
  }
};
```

- [ ] **Step 7: Update edit/delete button hover states**

```typescript
// Change lines 196-208 (edit/delete buttons) to:
<div className="flex gap-2">
  <button
    className="p-2 hover:bg-gray-700 rounded transition-colors"
    onClick={() => handleEditCampaign(campaign.id)}
  >
    <Edit className="h-5 w-5 text-gray-400" />
  </button>
  <button
    className="p-2 hover:bg-gray-700 rounded transition-colors"
    onClick={() => handleDeleteCampaign(campaign.id)}
  >
    <Trash2 className="h-5 w-5 text-gray-400" />
  </button>
</div>
```

- [ ] **Step 8: Run app to verify changes**

Run: Visit http://localhost:5173 in browser, navigate to Marketing page
Expected: All cards use card-bevel gradient, buttons consistent, dark theme throughout

- [ ] **Step 9: Commit changes**

```bash
git add src/pages/MarketingPage.tsx
git commit -m "refactor: update MarketingPage to match design system"
```

---

## Task 5: Add card-bevel utility class to global CSS

**Files:**
- Modify: `src/index.css` (or create if using Tailwind)

**Context:** The `card-bevel` class is used throughout PickupPage but may not be defined globally. Need to add it to ensure consistent styling.

- [ ] **Step 1: Check existing CSS**

Open: `src/index.css`
Note: Check if card-bevel class exists

- [ ] **Step 2: Add card-bevel utility class**

```css
/* Add to src/index.css */
.card-bevel {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
              0 2px 4px -1px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(75, 85, 99, 0.4);
}

.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
  background-color: rgb(55, 65, 81);
  border-radius: 4px;
}

.scrollbar-track-gray-900::-webkit-scrollbar-track {
  background-color: rgb(17, 24, 39);
}
```

- [ ] **Step 3: Verify CSS is imported in main.tsx**

Check: `src/main.tsx` includes `import './index.css'`

- [ ] **Step 4: Test card styling**

Run: Visit any modified page
Expected: Cards have subtle bevel effect with shadows

- [ ] **Step 5: Commit changes**

```bash
git add src/index.css
git commit -m "style: add card-bevel utility class for consistent card styling"
```

---

## Task 6: Final verification and testing

**Files:**
- Test all modified pages

**Context:** Ensure all pages work correctly and maintain visual consistency after refactoring.

- [ ] **Step 1: Test Hold & Quick Drop page**

Run: Navigate to http://localhost:5173 Hold & Quick Drop page
Expected: Dark theme, card-bevel styling, no MUI components, responsive layout

- [ ] **Step 2: Test Sales page**

Run: Navigate to http://localhost:5173 Sales page
Expected: Consistent padding, card-bevel on all cards, filters working, table styling matches PickupPage

- [ ] **Step 3: Test Sales Items page**

Run: Navigate to http://localhost:5173 Sales Items page
Expected: Dark cart sidebar, consistent button styles, category buttons matching design system

- [ ] **Step 4: Test Marketing page**

Run: Navigate to http://localhost:5173 Marketing page
Expected: All cards with gradient backgrounds, status badges consistent, tab navigation styling

- [ ] **Step 5: Compare with PickupPage for consistency**

Run: Open PickupPage and each refactored page side by side
Expected: Consistent colors, spacing, card styling, button styles across all pages

- [ ] **Step 6: Check responsive behavior**

Run: Resize browser window to mobile/tablet sizes
Expected: All pages responsive, grid layouts adapt properly

- [ ] **Step 7: Check browser console for errors**

Run: Open browser DevTools Console
Expected: No errors, no warnings

- [ ] **Step 8: Create final commit**

```bash
git add .
git commit -m "feat: complete design consistency refactor across all pages

- Updated HoldQuickDropPage to remove Material-UI and use custom design system
- Standardized SalesPage card styling and spacing
- Refactored SalesItems cart sidebar to dark theme
- Unified MarketingPage styling with card-bevel pattern
- Added card-bevel utility class to global CSS
- All pages now follow PickupPage design system for consistency

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Summary

This plan refactors four pages to match the PickupPage design system:

1. **HoldQuickDropPage** - Complete removal of Material-UI, rebuilt with custom components
2. **SalesPage** - Updated padding, card styling, and consistency
3. **SalesItems** - Converted to dark theme cart sidebar, consistent buttons
4. **MarketingPage** - Applied card-bevel gradient pattern to all cards

**Key Design Patterns Applied:**
- `bg-gray-900` background with `p-6` padding
- `card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900` for cards
- Consistent input styling with `bg-gray-700/50`
- Primary buttons: `bg-indigo-600`, Secondary: `bg-gray-800/50`
- Status badges with color-coded backgrounds
- Table headers: `bg-gray-800/80 backdrop-blur-sm`
- Text colors: `text-gray-200/300/400` hierarchy
- Icons with contextual colors (indigo-400, green-400, etc.)

**Estimated Time:** 2-3 hours for all tasks
**Testing:** Manual verification of each page + responsive testing
**Breaking Changes:** None - pure UI refactor, no API changes
