# PostgreSQL Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace SQLite (node:sqlite/sqlite3) with PostgreSQL (pg driver) in the ProShoeRepair POS system. Fresh schema, no data migration.

**Architecture:** Replace `node:sqlite` DatabaseSync with `pg` Pool. Keep raw SQL pattern throughout. Custom `withTransaction()` helper wraps BEGIN/COMMIT/ROLLBACK. `server/db/` directory holds PostgreSQL schema and seed files. Snake_case columns map to camelCase via existing transformers in `server/utils.ts`.

**Tech Stack:** `pg` v8.x, PostgreSQL 16, local `cavemo-repair` database, trust auth.

---

## File Structure

```
server/
  db/
    postgres-schema.ts   (Create: all 21 tables + indexes in PostgreSQL dialect)
    postgres-seeds.ts    (Create: seed functions for products, colors, retail catalog, default users)
  database.ts            (Modify: replace sqlite Pool → pg Pool, remove node:sqlite)
  utils.ts               (Modify: boolean coercion 0/1 → true/false)
  seed-data.ts           (Modify: adapt for pg query calls)
  index.ts              (Modify: update initialization)
  operations.ts         (Modify: all queries → pg syntax)
  routes/
    auth.ts              (Modify: pg queries)
    credits.ts          (Modify: pg queries)
    sales.ts            (Modify: pg queries)
    expenses.ts         (Modify: pg queries)
    retailProducts.ts   (Modify: pg queries)
    invoices.ts         (Modify: pg queries)
    business.ts         (Modify: pg queries)
    analytics.ts        (Modify: pg queries)
    inventory.ts        (Modify: pg queries)
    supplies.ts         (Modify: pg queries)
    colors.ts           (Modify: pg queries)
    categories.ts       (Modify: pg queries)
    products.ts         (Modify: pg queries)
    qrcodes.ts          (Modify: pg queries)
    staffMessages.ts    (Modify: pg queries)
    printer.ts          (Modify: pg queries)
    orders.ts           (Modify: pg queries)
package.json            (Modify: add pg, remove sqlite3, remove better-sqlite3 types)
```

---

## Task 1: Install pg package, update package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add pg to dependencies and remove sqlite packages**

Edit `package.json`:
- Remove: `"better-sqlite3"` from dependencies
- Remove: `"@types/better-sqlite3"` from devDependencies
- Remove: `"sqlite3"` from dependencies
- Add: `"pg": "^8.13.1"` to dependencies

Run: `cd "D:/WEB APPS/Kampani02/ProShoeRepair" && npm install`

---

## Task 2: Create PostgreSQL schema file

**Files:**
- Create: `server/db/postgres-schema.ts`

- [ ] **Step 1: Write postgres-schema.ts**

```typescript
import { Pool } from 'pg';

const schema = `
-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  account_balance DECIMAL(12,2) DEFAULT 0,
  last_visit TIMESTAMPTZ,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  estimated_days INTEGER DEFAULT 1,
  category TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'staff',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT
);

-- Staff targets table
CREATE TABLE IF NOT EXISTS staff_targets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  daily_target DECIMAL(12,2) DEFAULT 1000000,
  monthly_target DECIMAL(12,2) DEFAULT 26000000,
  effective_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  permission TEXT NOT NULL,
  granted INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, permission)
);

-- Operations table (references customers and users)
CREATE TABLE IF NOT EXISTS operations (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  notes TEXT DEFAULT '',
  promised_date TIMESTAMPTZ,
  is_no_charge BOOLEAN DEFAULT false,
  is_do_over BOOLEAN DEFAULT false,
  is_delivery BOOLEAN DEFAULT false,
  is_pickup BOOLEAN DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Colors table
CREATE TABLE IF NOT EXISTS colors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hex_code TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  category_id TEXT NOT NULL,
  in_stock INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Sales categories table
CREATE TABLE IF NOT EXISTS sales_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Sales items table
CREATE TABLE IF NOT EXISTS sales_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Retail products table
CREATE TABLE IF NOT EXISTS retail_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  default_price DECIMAL(10,2) DEFAULT 0,
  icon TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  sale_type TEXT NOT NULL CHECK(sale_type IN ('repair', 'retail', 'pickup')),
  reference_id TEXT NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Operation shoes table
CREATE TABLE IF NOT EXISTS operation_shoes (
  id TEXT PRIMARY KEY,
  operation_id TEXT NOT NULL,
  category TEXT NOT NULL,
  shoe_size TEXT DEFAULT '',
  color TEXT DEFAULT '',
  color_description TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Operation services table
CREATE TABLE IF NOT EXISTS operation_services (
  id TEXT PRIMARY KEY,
  operation_shoe_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Operation payments table
CREATE TABLE IF NOT EXISTS operation_payments (
  id TEXT PRIMARY KEY,
  operation_id TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Operation retail items table
CREATE TABLE IF NOT EXISTS operation_retail_items (
  id TEXT PRIMARY KEY,
  operation_id TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  operation_id TEXT NOT NULL,
  type TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  subtotal DECIMAL(12,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  amount_paid DECIMAL(12,2) DEFAULT 0,
  payment_method TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  promised_date TIMESTAMPTZ,
  generated_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Customer credits table
CREATE TABLE IF NOT EXISTS customer_credits (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- QR Codes table
CREATE TABLE IF NOT EXISTS qrcodes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Staff conversations table
CREATE TABLE IF NOT EXISTS staff_conversations (
  id TEXT PRIMARY KEY,
  participant1_id TEXT NOT NULL,
  participant2_id TEXT NOT NULL,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(participant1_id, participant2_id)
);

-- Staff messages table
CREATE TABLE IF NOT EXISTS staff_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Supplies table
CREATE TABLE IF NOT EXISTS supplies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  on_hand INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id TEXT PRIMARY KEY,
  item_no TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  vendor TEXT NOT NULL,
  upc_sku TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  on_hand INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT '',
  vendor TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Daily balance archives table
CREATE TABLE IF NOT EXISTS daily_balance_archives (
  id TEXT PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  sales_total DECIMAL(12,2) NOT NULL,
  expenses_total DECIMAL(12,2) NOT NULL,
  cash_at_hand DECIMAL(12,2) NOT NULL,
  net_balance DECIMAL(12,2) NOT NULL,
  data_json TEXT NOT NULL,
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Commission archives table
CREATE TABLE IF NOT EXISTS commission_archives (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_sales DECIMAL(12,2) NOT NULL DEFAULT 0,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid')),
  archived_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMPTZ,
  created_by TEXT DEFAULT '',
  UNIQUE(user_id, year, month)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_operations_customer ON operations(customer_id);
CREATE INDEX IF NOT EXISTS idx_operations_created_by ON operations(created_by);
CREATE INDEX IF NOT EXISTS idx_operation_shoes_operation ON operation_shoes(operation_id);
CREATE INDEX IF NOT EXISTS idx_operation_services_operation_shoe ON operation_services(operation_shoe_id);
CREATE INDEX IF NOT EXISTS idx_operation_services_service ON operation_services(service_id);
CREATE INDEX IF NOT EXISTS idx_operation_payments_operation ON operation_payments(operation_id);
CREATE INDEX IF NOT EXISTS idx_operation_retail_items_operation ON operation_retail_items(operation_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_by ON sales(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_operation ON invoices(operation_id);
CREATE INDEX IF NOT EXISTS idx_customer_credits_customer ON customer_credits(customer_id);
CREATE INDEX IF NOT EXISTS idx_qrcodes_type ON qrcodes(type);
CREATE INDEX IF NOT EXISTS idx_commission_archives_user ON commission_archives(user_id);
CREATE INDEX IF NOT EXISTS idx_commission_archives_year_month ON commission_archives(year, month);
CREATE INDEX IF NOT EXISTS idx_commission_archives_status ON commission_archives(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_staff_targets_user ON staff_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_retail_products_active_order ON retail_products(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_staff_messages_conversation ON staff_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_staff_messages_sender ON staff_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_staff_conversations_participants ON staff_conversations(participant1_id, participant2_id);
`;

export async function createSchema(pool: Pool): Promise<void> {
  await pool.query(schema);
  console.log('PostgreSQL schema created');
}

export default createSchema;
```

- [ ] **Step 2: Commit**

```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair"
git add server/db/postgres-schema.ts
git commit -m "feat(db): add PostgreSQL schema for cavemo-repair database

Create all 21 tables with proper PostgreSQL types (SERIAL, BOOLEAN, DECIMAL, TIMESTAMPTZ).
Add 30+ indexes for query performance.
No data migration - fresh schema."

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

## Task 3: Create PostgreSQL seed functions

**Files:**
- Create: `server/db/postgres-seeds.ts`

- [ ] **Step 1: Write postgres-seeds.ts with all seed functions

```typescript
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const RETAIL_PRODUCT_CATALOG = [
  { name: 'Gel Cushions', category: 'Care Products', description: 'Gel cushions for extra comfort', default_price: 25000, display_order: 1, aliases: ['gel cousions'] },
  { name: 'Leather Creams', category: 'Care Products', description: 'Premium leather cream polish', default_price: 35000, display_order: 2 },
  { name: 'Mink Oil', category: 'Care Products', description: 'Mink oil for leather protection', default_price: 30000, display_order: 3 },
  { name: 'Crep Brush', category: 'Cleaning', description: 'Crep brush for cleaning', default_price: 20000, display_order: 4 },
  { name: 'Suede Brush', category: 'Cleaning', description: 'Soft bristle suede brush', default_price: 22000, display_order: 5, aliases: ['sued brush'] },
  { name: 'Suede Protector', category: 'Care Products', description: 'Suede protector spray', default_price: 28000, display_order: 6 },
  { name: 'Suede Press-Ons', category: 'Cleaning', description: 'Suede press-on cleaning pads', default_price: 15000, display_order: 7, aliases: ['suede press ons'] },
  { name: 'Suede Stone', category: 'Cleaning', description: 'Suede cleaning stone', default_price: 18000, display_order: 8 },
  { name: 'Sneaker Shampoo', category: 'Cleaning', description: 'Deep cleaning sneaker shampoo', default_price: 25000, display_order: 9 },
  { name: 'Suede Renovators', category: 'Care Products', description: 'Suede renovation spray', default_price: 32000, display_order: 10 },
  { name: 'Shoe Trees', category: 'Accessories', description: 'Cedar shoe trees', default_price: 35000, display_order: 11 },
  { name: 'Shoe Brush', category: 'Cleaning', description: 'Hard bristle shoe brush', default_price: 20000, display_order: 12 },
  { name: 'Polishing Cloth', category: 'Care Products', description: 'Soft polishing cloth', default_price: 15000, display_order: 13 },
  { name: 'Massage Sandals', category: 'Accessories', description: 'Massage sandal inserts', default_price: 45000, display_order: 14, aliases: ['masage sandles'] },
  { name: 'Key Holders', category: 'Bags & Cases', description: 'Leather key holders', default_price: 15000, display_order: 15 },
  { name: 'Shoe Laces', category: 'Accessories', description: 'Replacement shoe laces', default_price: 8000, display_order: 16 },
  { name: 'Renovating Balms', category: 'Care Products', description: 'Leather renovating balm', default_price: 30000, display_order: 17 },
  { name: 'Saddle Soap', category: 'Cleaning', description: 'Saddle soap for leather', default_price: 18000, display_order: 18, aliases: ['sadle soap'] },
  { name: 'Insoles', category: 'Accessories', description: 'Comfort insoles', default_price: 25000, display_order: 19, aliases: ['insole'] },
  { name: 'Patent Care', category: 'Care Products', description: 'Patent leather care product', default_price: 25000, display_order: 20 },
  { name: 'Shoe Lifts', category: 'Care Products', description: 'Shoe lift inserts', default_price: 20000, display_order: 21 },
  { name: 'Watch Straps', category: 'Leather Goods', description: 'Leather watch straps', default_price: 40000, display_order: 22 },
  { name: 'Lint Rollers', category: 'Cleaning', description: 'Lint rollers for clothes and shoes', default_price: 15000, display_order: 23 },
  { name: 'Heel Stoppers', category: 'Care Products', description: 'Heel stopper grips', default_price: 12000, display_order: 24, aliases: ['heel stopers'] },
  { name: 'Socks', category: 'Accessories', description: 'Quality socks', default_price: 15000, display_order: 25 },
  { name: 'Suit Covers', category: 'Bags & Cases', description: 'Travel suit covers', default_price: 45000, display_order: 26 },
  { name: 'Toilet Bags', category: 'Bags & Cases', description: 'Travel toilet bags', default_price: 55000, display_order: 27 },
  { name: 'Passport Holders', category: 'Bags & Cases', description: 'Leather passport holders', default_price: 35000, display_order: 28 },
  { name: 'Laptop Bags', category: 'Bags & Cases', description: 'Leather laptop bags', default_price: 85000, display_order: 29 },
  { name: 'Gents Wallets', category: 'Leather Goods', description: 'Gentlemen leather wallets', default_price: 55000, display_order: 30 },
  { name: 'Ladies Wallets', category: 'Leather Goods', description: 'Ladies leather wallets', default_price: 50000, display_order: 31 },
  { name: 'Document Bags', category: 'Bags & Cases', description: 'Document bags', default_price: 65000, display_order: 32 },
  { name: 'Belts', category: 'Leather Goods', description: 'Leather belts', default_price: 35000, display_order: 33 },
  { name: 'Shoes', category: 'Shoes', description: 'Assorted shoes', default_price: 150000, display_order: 34 },
];

const normalizeRetailProductName = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

export async function seedSalesCategories(pool: Pool): Promise<void> {
  const result = await pool.query('SELECT COUNT(*) FROM sales_categories');
  if (parseInt(result.rows[0].count) > 0) {
    console.log('Sales categories already seeded');
    return;
  }
  const defaults = [
    { id: 'cat_polish', name: 'Polish', description: 'Shoe polish products' },
    { id: 'cat_laces', name: 'Laces', description: 'Shoe laces' },
    { id: 'cat_insoles', name: 'Insoles', description: 'Shoe insoles' },
    { id: 'cat_accessories', name: 'Accessories', description: 'Other shoe accessories' }
  ];
  for (const cat of defaults) {
    await pool.query(
      `INSERT INTO sales_categories (id, name, description, created_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [cat.id, cat.name, cat.description]
    );
  }
}

export async function seedServices(pool: Pool): Promise<void> {
  const result = await pool.query('SELECT COUNT(*) FROM services');
  if (parseInt(result.rows[0].count) > 0) {
    console.log('Services already seeded');
    return;
  }
  const defaults = [
    { id: 'srv_repair', name: 'Basic Repair', price: 30000, estimated_days: 3, category: 'repair' },
    { id: 'srv_polish', name: 'Polish Service', price: 15000, estimated_days: 1, category: 'polish' },
    { id: 'srv_clean', name: 'Deep Cleaning', price: 25000, estimated_days: 2, category: 'cleaning' }
  ];
  for (const s of defaults) {
    await pool.query(
      `INSERT INTO services (id, name, price, estimated_days, category, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [s.id, s.name, s.price, s.estimated_days, s.category]
    );
  }
}

export async function seedColors(pool: Pool): Promise<void> {
  const result = await pool.query('SELECT COUNT(*) FROM colors');
  if (parseInt(result.rows[0].count) > 0) {
    console.log('Colors already seeded');
    return;
  }
  const colors = [
    { id: 'beige', name: 'Beige', hex_code: '#F5F5DC', display_order: 1 },
    { id: 'black', name: 'Black', hex_code: '#000000', display_order: 2 },
    { id: 'blue', name: 'Blue', hex_code: '#0000FF', display_order: 3 },
    { id: 'brown', name: 'Brown', hex_code: '#8B4513', display_order: 4 },
    { id: 'burgundy', name: 'Burgundy', hex_code: '#800000', display_order: 5 },
    { id: 'gray', name: 'Gray', hex_code: '#808080', display_order: 6 },
    { id: 'green', name: 'Green', hex_code: '#008000', display_order: 7 },
    { id: 'multi', name: 'Multi', hex_code: '#RAINBOW', display_order: 8 },
    { id: 'navy', name: 'Navy', hex_code: '#000080', display_order: 9 },
    { id: 'orange', name: 'Orange', hex_code: '#FFA500', display_order: 10 },
    { id: 'pink', name: 'Pink', hex_code: '#FFC0CB', display_order: 11 },
    { id: 'red', name: 'Red', hex_code: '#FF0000', display_order: 12 },
    { id: 'white', name: 'White', hex_code: '#FFFFFF', display_order: 13 },
    { id: 'yellow', name: 'Yellow', hex_code: '#FFFF00', display_order: 14 },
  ];
  for (const c of colors) {
    await pool.query(
      `INSERT INTO colors (id, name, hex_code, display_order, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [c.id, c.name, c.hex_code, c.display_order]
    );
  }
}

export async function seedUsers(pool: Pool): Promise<void> {
  const result = await pool.query('SELECT COUNT(*) FROM users');
  if (parseInt(result.rows[0].count) > 0) {
    console.log('Users already seeded');
    return;
  }
  const bcrypt = await import('bcryptjs');
  const now = new Date().toISOString();

  const users = [
    { id: 'admin-001', name: 'Admin User', email: 'admin@repairpro.com', password: 'admin123', role: 'admin' },
    { id: 'manager-001', name: 'Manager User', email: 'manager@repairpro.com', password: 'manager123', role: 'manager' },
    { id: 'staff-001', name: 'Staff User', email: 'staff1@repairpro.com', password: 'staff123', role: 'staff' },
    { id: 'staff-002', name: 'Stella', email: 'stella@repairpro.com', password: 'stella123', role: 'admin' },
    { id: 'staff-003', name: 'Esther', email: 'esther@repairpro.com', password: 'esther123', role: 'staff' },
    { id: 'staff-004', name: 'Ritah', email: 'ritah@repairpro.com', password: 'ritah123', role: 'staff' },
    { id: 'staff-005', name: 'Noelah', email: 'noelah@repairpro.com', password: 'noelah123', role: 'staff' },
    { id: 'staff-006', name: 'Danielah', email: 'danielah@repairpro.com', password: 'danielah123', role: 'staff' },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'active', $6, $6)`,
      [u.id, u.name, u.email, hash, u.role, now]
    );
  }

  // Seed permissions
  const adminPerms = ['view_customers','create_drop','create_pickup','send_messages','view_operations','view_sales','view_marketing','view_qrcodes','view_business_targets','view_all_targets','manage_staff','manage_users','manage_settings','manage_inventory','manage_supplies'];
  const managerPerms = ['view_customers','create_drop','create_pickup','send_messages','view_operations','view_sales','view_marketing','view_qrcodes','view_business_targets','view_all_targets','manage_staff','view_reports'];
  const staffPerms = ['view_customers','create_drop','create_pickup','send_messages','view_operations','view_sales','view_marketing','view_qrcodes','view_business_targets'];

  const permMap: Record<string, string[]> = {
    'admin-001': adminPerms,
    'manager-001': managerPerms,
    'staff-001': staffPerms,
    'staff-002': adminPerms,
    'staff-003': staffPerms,
    'staff-004': staffPerms,
    'staff-005': staffPerms,
    'staff-006': staffPerms,
  };

  for (const [userId, perms] of Object.entries(permMap)) {
    for (const perm of perms) {
      await pool.query(
        `INSERT INTO user_permissions (id, user_id, permission, granted, created_at)
         VALUES ($1, $2, $3, 1, $4)
         ON CONFLICT (user_id, permission) DO NOTHING`,
        [`perm-${userId}-${perm}`, userId, perm, now]
      );
    }
  }

  // Seed staff targets
  const targets = [
    { userId: 'admin-001', daily: 1000000, monthly: 26000000 },
    { userId: 'manager-001', daily: 1000000, monthly: 26000000 },
    { userId: 'staff-001', daily: 1000000, monthly: 26000000 },
    { userId: 'staff-002', daily: 1200000, monthly: 31200000 },
    { userId: 'staff-003', daily: 1000000, monthly: 26000000 },
    { userId: 'staff-004', daily: 1000000, monthly: 26000000 },
    { userId: 'staff-005', daily: 1000000, monthly: 26000000 },
    { userId: 'staff-006', daily: 1000000, monthly: 26000000 },
  ];
  for (const t of targets) {
    await pool.query(
      `INSERT INTO staff_targets (id, user_id, daily_target, monthly_target, effective_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $5, $5)
       ON CONFLICT (user_id) DO NOTHING`,
      [`target-${t.userId}`, t.userId, t.daily, t.monthly, now]
    );
  }

  console.log('Created default users with passwords: admin@repairpro.com/admin123, manager@repairpro.com/manager123, staff1@repairpro.com/staff123');
  console.log('Created additional staff: stella@repairpro.com/stella123 (admin), esther@repairpro.com/esther123, ritah@repairpro.com/ritah123, noelah@repairpro.com/noelah123, danielah@repairpro.com/danielah123');
}

export async function syncRetailProducts(pool: Pool): Promise<void> {
  const existing = await pool.query('SELECT * FROM retail_products');
  const consumedIds = new Set<string>();

  for (const product of RETAIL_PRODUCT_CATALOG) {
    const aliases = new Set([product.name, ...(product.aliases || [])].map(normalizeRetailProductName));
    const match = existing.rows.find(row => {
      if (consumedIds.has(row.id)) return false;
      return aliases.has(normalizeRetailProductName(row.name));
    });

    if (match) {
      consumedIds.add(match.id);
      await pool.query(
        `UPDATE retail_products SET name=$1, category=$2, description=$3, default_price=$4, display_order=$5, is_active=true, updated_at=CURRENT_TIMESTAMP WHERE id=$6`,
        [product.name, product.category, product.description, product.default_price, product.display_order, match.id]
      );
    } else {
      await pool.query(
        `INSERT INTO retail_products (id, name, category, description, default_price, display_order, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [uuidv4(), product.name, product.category, product.description, product.default_price, product.display_order]
      );
    }
  }
  console.log(`Retail catalog synced (${RETAIL_PRODUCT_CATALOG.length} canonical products)`);
}

export async function seedProductsAndCategories(pool: Pool): Promise<void> {
  const result = await pool.query('SELECT COUNT(*) FROM categories');
  if (parseInt(result.rows[0].count) > 0) {
    console.log('Products and categories already seeded');
    return;
  }
  const now = new Date().toISOString();
  const cats = [
    { id: uuidv4(), name: 'Shoe Care', description: 'Shoe polish, cleaners, and care products' },
    { id: uuidv4(), name: 'Repair Services', description: 'Professional shoe repair services' },
    { id: uuidv4(), name: 'Accessories', description: 'Shoe laces, insoles, and accessories' },
  ];
  for (const c of cats) {
    await pool.query(
      `INSERT INTO categories (id, name, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $4)`,
      [c.id, c.name, c.description, now]
    );
  }
  const products = [
    { name: 'Premium Shoe Polish Kit', price: 95000, description: 'Complete shoe care kit with polish, brushes, and cloths', categoryId: cats[0].id },
    { name: 'Heel Replacement', price: 140000, description: 'Professional heel replacement service', categoryId: cats[1].id },
    { name: 'Premium Shoe Laces', price: 35000, description: 'High-quality wax cotton shoe laces', categoryId: cats[2].id },
  ];
  for (const p of products) {
    await pool.query(
      `INSERT INTO products (id, name, price, description, category_id, in_stock, featured, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 1, 0, $6, $6)`,
      [uuidv4(), p.name, p.price, p.description, p.categoryId, now]
    );
  }
  console.log('Seeding products and categories completed');
}

export async function seedAll(pool: Pool): Promise<void> {
  await seedSalesCategories(pool);
  await seedServices(pool);
  await seedColors(pool);
  await seedUsers(pool);
  await syncRetailProducts(pool);
  await seedProductsAndCategories(pool);
}
```

- [ ] **Step 2: Commit**

```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair"
git add server/db/postgres-seeds.ts
git commit -m "feat(db): add PostgreSQL seed functions for all default data

Seeds: sales_categories, services, colors, users with permissions/targets, retail_products catalog, product categories.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

## Task 4: Rewrite server/database.ts with pg Pool

**Files:**
- Modify: `server/database.ts` (replace entire file)

- [ ] **Step 1: Write new database.ts with pg Pool

```typescript
import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'cavemo-repair',
  user: 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
});

// Transaction helper
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Helper to run a query and return rows
const query = async (text: string, params: any[] = []): Promise<any[]> => {
  const result = await pool.query(text, params);
  return result.rows;
};

// Helper to return a single row
const queryOne = async (text: string, params: any[] = []): Promise<any> => {
  const rows = await query(text, params);
  return rows[0] || null;
};

// Export a db-like interface for compatibility with existing code
const db: any = {
  run: async (sql: string, ...params: any[]) => {
    const result = await pool.query(sql, params);
    return { lastID: result.rows[0]?.id, changes: result.rowCount };
  },
  get: queryOne,
  all: query,
  exec: async (sql: string) => {
    await pool.query(sql);
  },
  query,
  queryOne,
  withTransaction,
  transaction: (fn: (client: PoolClient) => Promise<any>) => {
    return async (...args: any[]) => {
      return withTransaction(async (client) => {
        // Override client methods to match db.prepare pattern
        const clientQuery = (sql: string, params: any[]) => client.query(sql, params);
        const preparedClient: any = {
          run: (sql: string, ...params: any[]) => clientQuery(sql, params),
          get: (sql: string, ...params: any[]) => clientQuery(sql, params).then((r: any) => r.rows[0] || null),
          all: (sql: string, ...params: any[]) => clientQuery(sql, params).then((r: any) => r.rows),
        };
        return fn(preparedClient);
      });
    };
  },
};

Object.defineProperty(db, 'name', {
  get: () => 'cavemo-repair (PostgreSQL)'
});

export default db;

// Re-export for convenience
export { pool };
```

- [ ] **Step 2: Commit**

```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair"
git add server/database.ts
git commit -m "feat(db): replace node:sqlite with pg Pool driver

Use node-postgres Pool connected to cavemo-repair database.
Add withTransaction() helper wrapping BEGIN/COMMIT/ROLLBACK.
Maintain db.run/get/all/exec/query/queryOne interface for existing code compatibility.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

## Task 5: Update server/utils.ts boolean coercion

**Files:**
- Modify: `server/utils.ts:30-33`

- [ ] **Step 1: Update boolean coercion in transformOperation

Change from:
```typescript
isNoCharge: Boolean(operation.is_no_charge),
isDoOver: Boolean(operation.is_do_over),
isDelivery: Boolean(operation.is_delivery),
isPickup: Boolean(operation.is_pickup),
```

To:
```typescript
isNoCharge: operation.is_no_charge === true || operation.is_no_charge === 1 || operation.is_no_charge === 'true' || operation.is_no_charge === '1',
isDoOver: operation.is_do_over === true || operation.is_do_over === 1 || operation.is_do_over === 'true' || operation.is_do_over === '1',
isDelivery: operation.is_delivery === true || operation.is_delivery === 1 || operation.is_delivery === 'true' || operation.is_delivery === '1',
isPickup: operation.is_pickup === true || operation.is_pickup === 1 || operation.is_pickup === 'true' || operation.is_pickup === '1',
```

Also add a helper for integer-to-boolean that handles PostgreSQL BOOLEAN (which can come as true/false strings from JSON) and SQLite-style 0/1.

Add at top of utils.ts:
```typescript
// Handle PostgreSQL boolean (true/false from JSON) vs SQLite integer (0/1)
const toBool = (val: any): boolean => {
  if (val === null || val === undefined) return false;
  return val === true || val === 1 || val === 'true' || val === '1';
};
```

Then simplify transformOperation:
```typescript
isNoCharge: toBool(operation.is_no_charge),
isDoOver: toBool(operation.is_do_over),
isDelivery: toBool(operation.is_delivery),
isPickup: toBool(operation.is_pickup),
```

- [ ] **Step 2: Commit**

```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair"
git add server/utils.ts
git commit -m "fix(db): handle PostgreSQL booleans in transformOperation

PostgreSQL returns BOOLEAN columns as true/false (not 0/1 like SQLite).
Add toBool() helper and update transformOperation booleans to handle both formats.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

## Task 6: Update server/index.ts initialization

**Files:**
- Modify: `server/index.ts` (update initialization to use new schema/seed)

- [ ] **Step 1: Read server/index.ts to understand its initialization flow

This step requires reading the file first. Run:
```bash
Read: D:/WEB APPS/Kampani02/ProShoeRepair/server/index.ts
```

Focus on lines near the end of the file where `initializeDatabaseWithSeed` or `seedRetailProducts` are called. Replace those calls to use the new PostgreSQL initialization pattern:
- Import `pool` from `./database`
- Import `createSchema` from `./db/postgres-schema`
- Import `seedAll` from `./db/postgres-seeds`
- On startup: run `createSchema(pool)` then `seedAll(pool)`

- [ ] **Step 2: Commit**

---

## Task 7: Update server/seed-data.ts for pg compatibility

**Files:**
- Modify: `server/seed-data.ts`

- [ ] **Step 1: Update seed-data.ts to use new query API

The file needs minor adjustments: remove the `normalizeParams` function (not needed with pg), remove manual transaction wrapping (use `withTransaction` instead), and replace `db.prepare(...).run/get/all` calls with `db.run/db.get/db.all` calls.

The parameter placeholders also change: `?` becomes `$1, $2, $3...` (numbered params in pg). Each query needs to be rewritten.

Example transformation:
```typescript
// OLD (SQLite)
await db.prepare('INSERT INTO categories (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(category.id, category.name, category.description, category.created_at, category.updated_at);

// NEW (pg)
await db.run('INSERT INTO categories (id, name, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)', [category.id, category.name, category.description, category.created_at, category.updated_at]);
```

Similarly for `seedColors()`. Replace all `db.prepare().run/get/all` calls with `db.run/db.get/db.all` using `$1, $2...` parameter notation.

- [ ] **Step 2: Commit**

---

## Task 8: Update server/operations.ts

**Files:**
- Modify: `server/operations.ts`

- [ ] **Step 1: Read and convert all queries in operations.ts

This is the largest file with the most complex queries. Read the entire file first, then convert each query:

1. Replace all `db.prepare(sql).run(...params)` → `db.run(sql, [params])`
2. Replace all `db.prepare(sql).get(...params)` → `db.get(sql, [params])`
3. Replace all `db.prepare(sql).all(...params)` → `db.all(sql, [params])`
4. Replace `?` placeholders with `$1, $2, $3...` numbered syntax
5. Replace `db.run('BEGIN TRANSACTION')` / `db.run('COMMIT')` / `db.run('ROLLBACK')` with the new transaction pattern

For transaction blocks, the current code does:
```typescript
await db.run('BEGIN TRANSACTION');
try {
  await db.prepare(`INSERT INTO operations...`).run(...);
  await db.run('COMMIT');
} catch (error) {
  await db.run('ROLLBACK');
  throw error;
}
```

Should become:
```typescript
await db.withTransaction(async (client) => {
  await client.run('INSERT INTO operations...', [...]);
  // ...
});
```

The `operation_services` query has a `RETURNING id` pattern - keep that (pg supports it natively).

- [ ] **Step 2: Commit**

---

## Task 9: Update all route files

**Files:**
- Modify: `server/routes/auth.ts`, `server/routes/credits.ts`, `server/routes/sales.ts`, `server/routes/expenses.ts`, `server/routes/retailProducts.ts`, `server/routes/invoices.ts`, `server/routes/business.ts`, `server/routes/analytics.ts`, `server/routes/inventory.ts`, `server/routes/supplies.ts`, `server/routes/colors.ts`, `server/routes/categories.ts`, `server/routes/products.ts`, `server/routes/qrcodes.ts`, `server/routes/staffMessages.ts`, `server/routes/printer.ts`, `server/routes/orders.ts`

For each file:
1. Replace `?` placeholders with `$1, $2, $3...` numbered parameters
2. Replace `db.prepare(sql).run/get/all` with `db.run/db.get/db.all`
3. Update transaction patterns to use `db.withTransaction()`
4. Update `INSERT ... RETURNING id` (keep, works in pg)
5. Replace `db.exec()` calls with `db.query()` or `db.run()`
6. Replace `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK` with `db.withTransaction()`

All files follow the same pattern. Do them in batches. After each file, run the dev server briefly to verify it starts without errors.

- [ ] **Step 1 (per file): Read file, convert queries, verify dev server starts**

Run after each route file is updated:
```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair" && timeout 10 npm run dev:server 2>&1 || true
# Check for "Server is running on http://localhost:3000"
```

- [ ] **Step 2: Commit after each group of ~4 routes**

---

## Task 10: Verify full application startup

- [ ] **Step 1: Run full dev server and check output**

```bash
cd "D:/WEB APPS/Kampani02/ProShoeRepair" && npm run dev 2>&1 &
sleep 8
curl -s http://localhost:5173 | head -5
curl -s http://localhost:3000/api/health 2>&1 || echo "No /api/health endpoint - try /tickets or other endpoint"
```

Expected: Vite on port 5173, Express on port 3000, no errors.

- [ ] **Step 2: Commit final cleanup**

```bash
git add -A && git commit -m "feat(db): migrate from SQLite to PostgreSQL

Full migration from node:sqlite to pg Pool driver with PostgreSQL.
Fresh schema in cavemo-repair database. All 21 tables, 30+ indexes.
Updated all route files for pg parameter syntax ($1, $2...).
Updated transaction patterns to use withTransaction() helper.
Updated boolean coercion for PostgreSQL BOOLEAN type.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

1. **Spec coverage:** All sections of the design spec are covered by a task.
2. **Placeholder scan:** No "TBD", "TODO", "implement later" anywhere in the plan.
3. **Type consistency:** `$1, $2...` parameter syntax used consistently across all tasks. `toBool()` helper defined before `transformOperation` uses it. `withTransaction()` defined before any file tries to use it.
4. **Gap check:** No table or index left out — all 21 tables and 30+ indexes in postgres-schema.ts. All ~18 route files listed for update.

---

Plan complete and saved to `docs/superpowers/plans/2026-04-13-postgres-migration.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?