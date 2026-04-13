# PostgreSQL Migration Design

> **Goal:** Replace SQLite with PostgreSQL for the ProShoeRepair POS system. Fresh schema, no data migration.

## Architecture

Replace `node:sqlite` / `sqlite3` with `pg` (node-postgres). Keep raw SQL pattern throughout — no ORM. PostgreSQL connection via `Pool` with trust auth to local `cavemo-repair` database on port 5432.

## Tech Stack

- **Driver:** `pg` (node-postgres) v8.x
- **Database:** PostgreSQL 16, local install, `cavemo-repair` database, trust auth
- **Removal:** `sqlite3`, `better-sqlite3` packages

## Connection Config

```typescript
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'cavemo-repair',
  user: 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
});
```

## Query API Surface

Replace all sqlite calls with `pool.query()`:
- `db.run(sql, ...args)` → `pool.query(sql, [...args])`
- `db.all(sql, ...args)` → `pool.query(sql, [...args]).then(r => r.rows)`
- `db.get(sql, ...args)` → `pool.query(sql, [...args]).then(r => r.rows[0])`
- `db.prepare(sql).run/all/get()` → Same `pool.query()` — pg doesn't need prepared statement objects
- `db.exec(sql)` → `pool.query(sql)`

Transaction helper: custom `withTransaction(fn)` wrapping `BEGIN`/`COMMIT`/`ROLLBACK`.

## Schema Changes

### Column Type Mappings
| SQLite | PostgreSQL |
|--------|-----------|
| `INTEGER PRIMARY KEY` | `SERIAL PRIMARY KEY` |
| `TEXT` | `TEXT` |
| `REAL` | `DECIMAL(10,2)` |
| `DATETIME` | `TIMESTAMPTZ` |
| `INTEGER` | `INTEGER` |
| `BOOLEAN` | `BOOLEAN` (coerce 0/1 → true/false) |
| `AUTOINCREMENT` | `SERIAL` |

### Key Changes
1. **Boolean coercion** — Transform 0/1 from DB to true/false in utils
2. **ID generation** — Use `SERIAL`/`BIGSERIAL` instead of AUTOINCREMENT
3. **Foreign keys** — Add `ON DELETE CASCADE` where appropriate
4. **Index names** — Globally unique, use `idx_tablename_column` pattern
5. **`RETURNING` clause** — Use for INSERT to get generated IDs

### Tables (21 total)
customers, operations, operation_shoes, operation_services, operation_payments, operation_retail_items, services, customers_credits, invoices, sales, users, user_permissions, staff_targets, staff_conversations, staff_messages, colors, categories, products, sales_categories, sales_items, retail_products, supplies, inventory_items, expenses, daily_balance_archives, commission_archives, qrcodes

Plus 20+ indexes on foreign keys and frequent query columns.

## File Changes

### New Files
- `server/db/postgres-schema.ts` — All CREATE TABLE statements for PostgreSQL
- `server/db/postgres-seeds.ts` — Seed data functions for PostgreSQL

### Modified Files (high impact)
- `server/database.ts` — Replace Pool, remove sqlite, rebuild schema creation
- `server/utils.ts` — Update boolean coercion
- `server/index.ts` — Update initialization calls
- `server/operations.ts` — SQL syntax updates for PostgreSQL

### Modified Files (medium impact)
- `server/routes/auth.ts`, `credits.ts`, `sales.ts`, `expenses.ts`
- `server/routes/retailProducts.ts`, `invoices.ts`, `business.ts`, `analytics.ts`
- `server/routes/inventory.ts`, `supplies.ts`, `colors.ts`, `categories.ts`
- `server/routes/products.ts`, `qrcodes.ts`, `staffMessages.ts`, `printer.ts`, `orders.ts`

### No Changes
- All `src/` frontend files (API interface unchanged)
- `vite.config.ts` (proxy unchanged)

### package.json
- Add: `pg`
- Remove: `sqlite3`, `@types/better-sqlite3`

## No Data Migration

Starting fresh — existing SQLite data in `server/database.db` will not be copied to PostgreSQL.