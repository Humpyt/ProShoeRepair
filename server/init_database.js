import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'shoerepair.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Drop existing tables
const tables = ['operation_services', 'operation_shoes', 'operations', 'services', 'customers'];
tables.forEach(table => {
  db.prepare(`DROP TABLE IF EXISTS ${table}`).run();
});

// Create tables
db.exec(`
  CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active',
    total_orders INTEGER DEFAULT 0,
    total_spent REAL DEFAULT 0,
    last_visit TEXT,
    loyalty_points INTEGER DEFAULT 0,
    created_at TEXT,
    updated_at TEXT
  );

  CREATE TABLE services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    estimated_days INTEGER,
    category TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT,
    updated_at TEXT
  );

  CREATE TABLE operations (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    status TEXT DEFAULT 'pending',
    total_amount REAL NOT NULL DEFAULT 0,
    paid_amount REAL DEFAULT 0,
    notes TEXT,
    promised_date TEXT,
    is_no_charge INTEGER DEFAULT 0,
    is_do_over INTEGER DEFAULT 0,
    is_delivery INTEGER DEFAULT 0,
    is_pickup INTEGER DEFAULT 0,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
  );

  CREATE TABLE operation_shoes (
    id TEXT PRIMARY KEY,
    operation_id TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT,
    notes TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (operation_id) REFERENCES operations (id)
  );

  CREATE TABLE operation_services (
    id TEXT PRIMARY KEY,
    operation_shoe_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    price REAL NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (operation_shoe_id) REFERENCES operation_shoes (id),
    FOREIGN KEY (service_id) REFERENCES services (id)
  );
`);

// Add sample services
const services = [
  { id: 'service_1', name: 'Sole Replacement', price: 80000, category: 'repair' },
  { id: 'service_2', name: 'Heel Repair', price: 40000, category: 'repair' },
  { id: 'service_3', name: 'Cleaning', price: 25000, category: 'cleaning' },
  { id: 'service_4', name: 'Polishing', price: 15000, category: 'cleaning' },
  { id: 'service_5', name: 'Waterproofing', price: 30000, category: 'protection' },
  { id: 'service_6', name: 'Stretching', price: 20000, category: 'adjustment' },
  { id: 'service_7', name: 'Elastic', price: 15000, category: 'repair' },
  { id: 'service_8', name: 'Hardware', price: 20000, category: 'repair' },
  { id: 'service_9', name: 'Heel Fix', price: 25000, category: 'repair' },
  { id: 'service_10', name: 'Misc', price: 8000, category: 'other' }
];

const insertService = db.prepare(`
  INSERT INTO services (
    id, name, price, category, status, created_at, updated_at
  ) VALUES (?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
`);

services.forEach(service => {
  insertService.run(
    service.id,
    service.name,
    service.price,
    service.category
  );
  console.log(`Added service: ${service.name}`);
});

console.log('Database initialized successfully!');
db.close();
