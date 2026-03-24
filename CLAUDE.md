# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack Point of Sale (POS) system for shoe repair businesses. Built with React + TypeScript (Vite) frontend and Express + SQLite backend.

## Development Commands

**Start development servers (both client and server):**
```bash
npm run dev
```

**Start individual servers:**
```bash
npm run dev:client  # Vite dev server on port 5173
npm run dev:server  # Express server on port 3000
```

**Build and lint:**
```bash
npm run build    # TypeScript compilation + Vite build
npm run lint     # ESLint with TypeScript rules
npm run preview  # Preview production build locally
```

**Database utilities:**
```bash
npm run init:supplies     # Initialize supplies table
npm run add:supplies      # Add dummy supply data
```

**Database seeding scripts (run via tsx):**
```bash
tsx server/reset_database.ts     # Reset and reinitialize database
tsx server/add_customers.ts      # Add sample customer data
tsx server/add_services.ts       # Add sample service data
```

## Architecture

### Backend (Express + SQLite)

- **Entry point:** `server/index.ts` - Express server on port 3000
- **Database:** SQLite (`server/database.db`) initialized in `server/database.ts`
- **Auto-seeding:** Database automatically seeds default categories, services, and products on first run via `server/seed-data.ts`

**Router structure:** Modular routers in `server/routes/`:
- `operations.ts` - Main router mounted at `/api/operations` (also at `server/operations.ts`)
- `inventory.ts` - Inventory management
- `sales.ts` - Sales endpoints
- `printer.ts` - Thermal printer integration
- `qrcodes.ts` - QR code generation
- `supplies.ts` - Supplies tracking
- `categories.ts` - Product categories
- `products.ts` - Product catalog

**Database schema key tables:**
- `customers` - Customer records with loyalty points, total_orders, total_spent
- `operations` - Repair orders (linked to customers, supports no_charge, do_over, delivery, pickup flags)
- `operation_shoes` - Individual shoes in an order
- `operation_services` - Services applied to each shoe
- `services` - Available services with pricing and estimated_days
- `sales_categories` / `sales_items` - Retail product categories and items
- `products` / `categories` - Additional product catalog (uses ProductContext)
- `supplies` - Supply inventory tracking with low-stock alerts
- `inventory_items` - Full inventory management system
- `sales` - Transaction tracking (repair, retail, pickup types)
- `qrcodes` - QR code storage

### Frontend (React + Vite)

**State management:** Context-based architecture with nested providers
- `CustomerProvider` → `OperationProvider` → `AdminProvider` → `CartProvider` → `ProductProvider`
- `CustomerContext` - Customer data and operations
- `OperationContext` - Repair order/ticket management
- `ProductContext` - Product/category catalog management
- `CartContext` - Shopping cart for sales
- `AdminContext` - Admin-specific state

**Authentication:** Local mock authentication using Zustand (`src/store/authStore.ts`)
- Mock users with roles: admin, manager, staff
- Credentials stored in localStorage
- Login component at `src/pages/LoginPage.tsx`
- Test credentials:
  - admin@repairpro.com / admin123
  - manager@repairpro.com / manager123
  - staff1@repairpro.com / staff123

**Routing:** `react-router-dom` v7 with nested routes
- All routes nested under main layout with collapsible sidebar
- Protected routes use `ProtectedRoute` component with role-based access
- Entry point: `src/App.tsx`
- Online/offline detection built-in with status indicator

**API integration:** Backend via Vite proxy:
- Vite dev server proxies `/api` requests to `http://localhost:3000`
- Direct fetch/axios calls to backend endpoints

**UI Components:**
- Material-UI (`@mui/material`) for base components
- Tailwind CSS for styling
- Radix UI for select/switch/toast components
- Lucide React icons
- React Hot Toast for notifications
- React Chart.js 2 for analytics

### Key Features

- **Repair orders:** Multi-step workflow (drop-off → assembly → racking → pickup)
- **Quick actions:** Hold/Quick Drop, No Charge/Do Over pages
- **Inventory management:** Supplies tracking with low-stock alerts
- **Sales:** Retail items for sale (polish, laces, insoles, accessories)
- **QR codes:** Generate printable QR codes for various purposes
- **Thermal printing:** Integration with thermal printers via USB
- **Role-based access:** Admin-only routes (staff page, admin page)
- **Reports:** Analytics dashboard with charts

## Important Notes

1. **Database location:** SQLite database file at `server/database.db` - created automatically on first server run.

2. **Transaction handling:** Backend uses manual BEGIN TRANSACTION / COMMIT / ROLLBACK for multi-step database operations. The database module also provides a transaction wrapper function.

3. **Column naming convention:** SQLite uses snake_case (e.g., `customer_id`), but TypeScript interfaces use camelCase. A transformer utility (`server/utils.ts`) converts between formats.

4. **Printer support:** Uses `escpos` and `node-thermal-printer` packages for USB thermal printer integration.

5. **Image uploads:** Images are converted to base64 data URLs for local storage (no cloud storage required).

6. **Online/offline detection:** App automatically detects network status and shows offline indicator when disconnected.

7. **Deployment:** Configured for Netlify (see `netlify.toml`). Note that the Express backend won't work on Netlify - it's designed for local development or a separate Node.js hosting.

## Database Schema Relationships

```
customers (1) ----< (many) operations
operations (1) ----< (many) operation_shoes
operation_shoes (1) ----< (many) operation_services
services (1) ----< (many) operation_services

categories (1) ----< (many) products
sales_categories (1) ----< (many) sales_items
```
