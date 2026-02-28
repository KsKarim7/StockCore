# Inventory Management System 
==================================================
1) PROJECT OVERVIEW
==================================================
You are a Senior Full-Stack Engineer and UI/UX Designer. Small retail business owners need a reliable Inventory Management System (IMS) to track stock, sales, purchases, returns, and supplier expenses with accurate accounting (BDT), simple UX for staff, and exportable reports. The goal is an owner-focused, production-ready MERN app (MongoDB, Express, React(vite), Node) that is simple to operate at a single physical store but designed for later extensibility.


This is NOT a public SaaS product. There are no payments, no
subscription plans, and no public signup. It is a private internal
tool accessed only by authorized staff via a simple login.

You must produce clean, maintainable, fully deployable code.

==================================================
ROLE DEFINITION
==================================================
Act as:
- Senior Frontend Engineer
- Senior Backend Engineer
- UI/UX Designer

==================================================
TECH STACK
==================================================
Frontend:
- React (Vite) + TypeScript
- Tailwind CSS
- ShadCN UI

Backend:
- Node.js + Express (custom REST API)
- express-async-errors for error handling
- multer for file upload handling
- axios for calling the Remove.bg API



Authentication:
- JWT-based login (access token + refresh token in HttpOnly cookie)
- Single hardcoded admin account seeded via script OR
  owner manually creates staff accounts from inside the app
- No public signup page

Status: Ready for product & engineering review

---


Business needs solved:
- Prevent stockouts and reconciliate stock changes
- Track purchases, supplier balances, and returns
- Record sales with partial payments and dues
- Produce printable/exportable reports (PDF / Excel)
- Maintain auditability and recoverability for financial data

---

## 2 — Audience & ideal customer
- Owner,manager or staffs are the only users , this is going to have three access point, only they to going to visit the site maybe from multiple devices thats it (no customer interaction with the site)


Persona (example):
- Name: "Rahim"
- Role: Owner of a single retail outlet
- Needs: Quick sales entry, accurate on-hand stock, purchase tracking, downloadable reports for accountant
- Devices: Desktop + occasional tablet; uses a USB barcode scanner (keyboard-emulating), not camera scanning.

---

## 3 — Platform & product scope (MVP)
- Platform: Responsive web app — desktop-first SPA built with React (Vite + TypeScript).
- Backend: Node.js + Express + Mongoose (run locally for MVP; no cloud deployment or backup strategy required at this stage).
- Storage: Product images stored via Cloudinary (only the image URL is saved in MongoDB). Maximum expected images: ~500, so this is lightweight. No S3 or CDN setup required.
- Scope: MVP supports single-store inventory (single warehouse), internal POS (owner-entered sales), purchases, purchase returns, sales returns, customer management, expense tracking, and reporting (PDF / XLSX). No supplier ledger — the owner is the sole supplier.
- Barcode: No camera scanning in MVP; support manual SKU or keyboard-emulating barcode scanners.
- Multi-store: Not in MVP. Schema designed for later multi-warehouse support.

---

## 4 — Roles & access
- Roles (MVP): Owner/Admin only — this is a single-owner internal tool. No public-facing registration. No staff or cashier access in MVP.
- RBAC structure is kept in code for future scalability (e.g., adding Manager or Staff roles later from inside the dashboard), but only the Owner role is active in MVP.
  - Owner/Admin: full access (all modules, settings, reports, user management)
  - Manager (future): product & purchase management, reports, approve returns
  - Staff (future): create sales/orders, view products
- Authentication: JWT access tokens (short-lived) + refresh tokens (HttpOnly cookie).
- Refresh token strategy: rotating refresh tokens stored hashed on user document (single-use rotation).
- Owner account created via a database seed script (backend/scripts/seed_users.js). No /auth/register endpoint or Register page exposed in the UI.

---

## 5 — Key functional requirements (MVP)

a) Category Management

- Owner/manager can add, edit, and delete product categories
- Each category has: name (unique), description (optional), 
  slug (auto-generated from name for URL use)
- Categories are managed from a dedicated settings/category 
  page — not inline on the product form
- A product must belong to exactly one category
- Deleting a category is only allowed if no products are 
  currently assigned to it (enforced by backend validation)
- Categories are searchable/filterable on the Products list page

b) Product Management

- CRUD products: name, product_code (unique), selling/buying price, unit, VAT policy (toggle on/off; if enabled, owner enters a custom VAT percentage for that specific product), description, image_url (Cloudinary), weight/weight unit
- Stock fields: on_hand (authoritative), reserved (optional), available (on_hand - reserved)
- Stock +/- manual adjustments (with inventory ledger entries written automatically)
- Search: MongoDB text index + product_code exact lookup; simple fuzzy/autocomplete with front-end regex/prefix (no Algolia/Atlas Search for self-hosting)


c) Customer Management 

- Full customer profiles: name, phone number, address
- Purchase history: linked list of all orders placed by that customer
- Searchable by name or phone number
- Customers are created at point of sale and reusable across orders


d) Orders / Sales 

- Create → Confirm workflow (no Draft step; orders are confirmed directly)
- Confirmed: stock decremented immediately upon confirmation
- Support: partial payments, record customer linked to customer profile
- Statuses: Confirmed, Partially Paid, Paid, Cancelled, Returned (Draft removed)
- Sales returns support (creates an inbound inventory movement; see Sales Returns below)


e) Sales Returns 

- Dedicated Sales Return module separate from the order confirm/cancel flow
- Each return entry records: returned product(s) with quantity, original order reference (snapshot — no hard DB link required), customer details (name, phone, address), return date
- Stock automatically increased upon return; a Stock Movement Log entry is written (reason: Sales Return)
- Dedicated list view of all sales returns with full details and filtering by date range
- Export to PDF and Excel supported


f) Purchases 

- Owner is the sole supplier — no external supplier entity required
- Single-step purchase record (receive + invoice): purchase date, products purchased (name, code, quantity, buying price per unit), net amount, paid amount, due amount (auto-calculated)
- Stock automatically increased when a purchase entry is created; Stock Movement Log entry written (reason: Purchase)
- Grand totals across all purchases viewable
- Downloadable Purchase Report: PDF & Excel; daily, weekly, monthly report generation


g) Purchase Returns 

- Owner can return products (remove from inventory without a sale)
- Records: product name, code, quantity returned, date; due amounts adjusted accordingly
- Stock automatically decreased; Stock Movement Log entry written (reason: Purchase Return)
- Viewable list of all purchase returns with full details
- Export to PDF and Excel supported


h) Expenses 

- Track all business-related expenses: date, party name, expense description/category, total amount, paid amount, due amount (auto-calculated)
- Filterable by date range, with summary totals (total expenses, total paid, total due)
- Daily, weekly, monthly report generation
- Export to PDF and Excel supported (previously missing — now included)


i) Stock Movement Log 

- Every stock change automatically recorded — sales, purchases, returns, manual adjustments
- Each log entry: product name & code, quantity changed (+/−), reason/source (Sale, Purchase, Purchase Return, Sales Return, Manual Adjustment), date & time, stock level before and after
- Viewable and filterable by product, date range, and reason type
- Export to PDF and Excel supported


j) Reporting & Exports 

- All modules support export: Sales, Purchases, Purchase Returns, Sales Returns, Expenses, Stock Movement Log
- Export formats: PDF (Puppeteer server-side HTML→PDF) and Excel (SheetJS or ExcelJS)
- All reports support daily, weekly, monthly, yearly, and custom date range filtering
- Scheduled exports: optional (future); on-demand supported in MVP

---

## 6 — Data model — core collections (high-level)
1) Design decisions:
- Inventory ledger: dedicated immutable collection inventory_transactions (movement_id)
- Money: stored in minor units (paisa) as 64-bit integers (NumberLong via mongoose-long)
- Historical integrity: orders & purchases store snapshots of relevant product/price fields
- Soft-delete: all finance-critical records (is_deleted + deletedAt + deletedBy); purge job uses retention config

2) Collections (key fields — abridged):

Categories:
- _id, name (unique), slug (unique, auto-generated), 
  description, is_deleted, createdAt
- Indexes: unique name, unique slug

Products:

  - _id, product_code (unique), name, description, category_id (ObjectId, ref: Category), unit, selling_price (in bdt), buying_price (in bdt), vat_percent, on_hand (int), reserved, available, image_url, is_deleted
  - Indexes: unique product_code (partial), text index (name, description, product_code), on_hand

Inventory_transactions:
  - _id, movement_id (MOV-...), product_id, product_code (snapshot), qty (positive in/negative out), type (purchase_in, sale_out, purchase_return, sale_return, adjustment), unit_cost_paisa, timestamp, source { doc_type, doc_id, doc_number }, createdBy
  - Indexes: (product_id, timestamp), movement_id unique, source.doc_type+doc_id

Orders:
  - _id, order_number (ORD-...), status, customer snapshot, lines [product snapshot, qty, unit_price_paisa, unit_cost_paisa, inventory_movements[]], subtotal_paisa, vat_total_paisa, total_paisa, payments[], amount_received_paisa, amount_due_paisa, is_deleted, retain_until
  - Indexes: order_number, createdAt, status

Purchases:
  - _id, purchase_number, supplier_id, supplier_name, date, lines, subtotal, vat, total, payments, inventory_movements[], is_deleted

Returns:
  - _id, return_number, type (supplier/customer), related_original_snapshot, lines, status, inventory_movements[], createdBy

Suppliers, users, audit_logs, counters:
  - counters: key (orders,purchases,movements) + seq (for monotonic human-friendly IDs)

Note: Counters are used via findOneAndUpdate ($inc) inside transactions to allocate human-readable numbers.

---

## 7 — Money & precision

- All monetary values are stored and displayed in Taka (BDT). Amounts with sub-taka precision are expressed as decimal values (e.g., ৳1,250.75 — where .75 represents 75 paisa).
- Internally, values are stored as integer paisa (1 BDT = 100 paisa, e.g., ৳1,250.75 stored as 125075) to avoid floating point arithmetic errors in calculations and aggregations.
- The API layer converts paisa integers to decimal Taka strings for all UI-facing responses (e.g., 125075 → "1250.75"). The frontend always displays values in Taka with two decimal places.
- All arithmetic (totals, VAT, due calculations) is performed server-side in integer paisa before converting to Taka for display. No floating point math on monetary values.

---

## 8 — Transactional & concurrency rules

MongoDB multi-document transactions used for critical flows that touch multiple documents:

  - Confirm order: read product.on_hand (session), ensure sufficient stock, decrement on_hand, insert inventory_transactions, update order to Confirmed, attach movement ids — commit or abort
  - Create purchase: insert purchase, increment product.on_hand, insert inventory_transactions
  - Returns/cancellations: create reversing inventory_transactions and update on_hand
- Rely on transactions to prevent negative stock under concurrent operations.
- For performance, keep transactions minimal (no heavy computations) and use optimistic reads where appropriate.

---

## 9 — Audit, retention & soft-delete
- audit_logs collection: event_id, entity_type, entity_id, action, changed_by, timestamp, diff
- Soft-delete (is_deleted + deletedBy + deletedAt + retain_until). Background purge job removes items older than soft-delete retention (configurable).
- Financial retention: keep financial records (orders/purchases/inventory_transactions/audit_logs) in live DB for 3 years by default; archival process exports older records to compressed/encrypted storage before deletion.
- Soft-delete default purge eligibility: 30 days (configurable via settings); admin override via retain_until.

---

10 — Search & product lookup 
- Self-hosted approach: MongoDB text index on name/description/product_code plus exact indexed product_code lookup for scanner/fast lookup.
- Autocomplete/fuzzy: frontend uses debounced prefix/regex and server side text search; Atlas Search / Elastic / Algolia can be introduced later if scale requires.


Order status lifecycle :

- Confirmed — order created and stock decremented
- Partially Paid — some payment received, balance due
- Paid — fully settled
- Cancelled — order voided; stock reinstated via inventory movement
- Returned — goods returned by customer; handled via Sales Return module
---

11 — API surface (high-level) 
Versioned base: /api/v1

Auth 

- POST /auth/login -> returns access token; sets HttpOnly refresh cookie
- POST /auth/refresh -> rotate refresh + return access token
- POST /auth/logout -> revoke refresh token
- GET /auth/me


Categories

- POST   /categories
- GET    /categories (list all active categories)
- GET    /categories/:id
- PUT    /categories/:id
- DELETE /categories/:id 
  (returns 400 if products exist under this category)


Products

-GET /products (search, filters, pagination, ?category_id= filter)
-POST /products
-GET /products/:id
-PUT /products/:id
-POST /products/:id/adjust  (create adjustment movement)


Customers 

-POST /customers
-GET /customers (search by name/phone, pagination)
-GET /customers/:id
-PUT /customers/:id
-GET /customers/:id/orders (purchase history)


Orders (sales) 

-POST /orders (create & confirm directly — no draft step)
-GET /orders (list, filter by status/date/customer)
-GET /orders/:id
-POST /orders/:id/pay
-POST /orders/:id/cancel



Sales Returns 

-POST /sales-returns (create return, auto-adjusts stock)
-GET /sales-returns (list, filter by date/customer)
-GET /sales-returns/:id


Purchases 

-POST /purchases (create & receive — transactional; no supplier_id required)
-GET /purchases (list, filter by date range)
-GET /purchases/:id


Purchase Returns

-POST /purchase-returns
-GET /purchase-returns


Inventory ledger

-GET /inventory/transactions (productId/from/to/type/reason)


Expenses

-POST /expenses
-GET /expenses (filter by date range)
-PUT /expenses/:id
-DELETE /expenses/:id


Reports & Exports 

-GET /reports/sales?from=&to=&format=json|excel|pdf
-GET /reports/purchases?from=&to=&format=json|excel|pdf
-GET /reports/sales-returns?from=&to=&format=json|excel|pdf
-GET /reports/purchase-returns?from=&to=&format=json|excel|pdf
-GET /reports/expenses?from=&to=&format=json|excel|pdf
-GET /reports/stock-movements?from=&to=&format=json|excel|pdf
-GET /reports/top-products


Admin

-Users CRUD, retention settings, audit logs



Implementation notes:

-Use consistent response envelope; use status codes (400/401/403/404/409/500)
-Long-running exports: enqueue jobs via background worker (recommended) and provide job endpoint /exports/:jobId for download links.
-All money values returned from API as decimal Taka strings (e.g., "1250.75") not paisa integers
---


## 12 — Frontend architecture (React + TypeScript)
- Tech: React + TypeScript (Vite), react-hook-form + yup, axios, react-router, minimal component library (MUI optional).
- State: local state + React Query (recommended lat	er) or simple data fetching with axios for MVP.
- Folder structure (recommended):

           -src/

                 -api/ (axios client + typed wrappers)
                 -auth/ (AuthContext, token handling)
                 -components/ (NavBar, DataTable, Form components, ExportButton — shared export utility)
                 -pages/ (Login, Dashboard, CategoryList, CategoryCreate, ProductsList, ProductCreate, CustomersList, CustomerDetail, OrdersList, OrderCreate, SalesReturnsList, SalesReturnCreate, PurchasesList, PurchaseCreate, PurchaseReturnsList, ExpensesList, StockMovementLog, Reports)
                 -utils/ (money convert — paisa ↔ Taka decimal, date utils)




-Key flows:

*)Auth: login → store access token in memory/localStorage + refresh cookie (HttpOnly). No Register page.
*)Category flow: owner manages categories from a dedicated Categories page; category selector appears as a dropdown on the Product create/edit form populated from GET /categories
*)Order flow: create order (confirm directly — no draft step), link to customer profile
*)Customer flow: create/view customer, browse purchase history from customer detail page
*)Sales Returns: create return linked to original order + customer; stock auto-adjusted
*)Reports: date range builder → request export → poll for job completion; all modules share the same ExportButton component



-UX considerations:

*)Confirm step shows stock pre-checks before calling confirm endpoint
*)Export jobs are async; UI shows progress and download link when ready
*)Image upload via Cloudinary presigned URL (frontend uploads directly to Cloudinary; URL saved via API)ghy

---

## 13 — Reporting & export libs
- PDF: server-side rendering using Puppeteer (headless Chrome) to produce print-ready PDFs from HTML templates (consistent rendering).
- Excel: SheetJS (xlsx) or ExcelJS server-side for streaming XLSX files.
- Shared export utility: A single reusable export service is built once and used across all modules — Sales, Purchases, Purchase Returns, Sales Returns, Expenses, and Stock Movement Log. Do not build module-specific exporters.
- All exports support daily, weekly, monthly, yearly, and custom date range filtering.
- For large exports: background jobs (Bull + Redis) recommended; can be synchronous for small datasets in MVP.
- Money values in all exported reports are displayed in Taka with two decimal places (e.g., ৳1,250.75).

---

## 14 — Infrastructure & deployment (MVP)
- Hosting: Self-hosted VPS (DigitalOcean / Hetzner / OVH) with:
  - App server(s) running Node (stateless) behind Nginx reverse proxy + TLS
  - MongoDB self-hosted (use a replica set even on 1 node initially to enable transactions)
  - S3-compatible object storage (DigitalOcean Spaces / AWS S3) for product images
- Backups:
  - Daily mongodump or snapshot; offsite retention >= 30 days
  - Exported archival for older financial data prior to purge
- CI/CD:
  - GitHub Actions (CI for lint/test/build)
  - Manual deploy (MVP): CI artifact built, deployment triggered manually; next step automating via Actions.
- Monitoring:
  - Sentry for error tracking, and CloudWatch / Prometheus for metrics (CPU, memory, request latency)
- Jobs:
  - Background worker (optional initially) for exports using Bull + Redis (add Redis when scaling/when using background jobs)

---

## 15 — Security & compliance
- HTTPS required in production; set COOKIE_SECURE=true
- Password hashing: bcrypt (salt rounds >= 12)
- Access tokens short-lived (15m), refresh tokens long-lived and rotated; refresh tokens stored hashed
- Rate-limit auth endpoints and critical write endpoints
- Use Decimal-safe money (paisa integer) to avoid rounding issues
- Retention policy default: financial records 3 years; soft-deleted purge after 30 days; archiving before deletion

---

## 16 — Performance & scale planning
- Designed for SMB: estimate <= 10k products, <= 10k orders/month
- Indexing strategy:
  - products: product_code unique, text index (name, description, product_code), on_hand index
  - orders: order_number index, createdAt
  - inventory_transactions: (product_id, timestamp)
  - counters: key unique
- Use MongoDB transactions for writes that update multiple documents; keep transactions short
- For heavy read/analytics: add pre-aggregated rollups or scheduled aggregation jobs; consider Redis cache for dashboard

---

## 17 — Trade-offs & assumptions
- Single-store only (MVP). Later multi-warehouse requires adding warehouse_id on product stock and lot/serial features if needed.
- No camera-based barcode scanning (MVP). Support keyboard-emulating scanners.
- Money as paisa (NumberLong). Chosen for performance and aggregation simplicity.
- Self-hosted MongoDB (VPS) — simpler & cheaper for MVP but increases ops overhead vs managed Atlas. If you want Atlas features (Atlas Search), choose MongoDB Atlas later.

---

## 18 — Risks & mitigation
- Risk: Concurrent sales causing stock races. Mitigation: use MongoDB transactions and pre-checks.
- Risk: Large exports blocking API. Mitigation: move exports to background worker and stream results.
- Risk: Data drift between inventory ledger & product.on_hand. Mitigation: scheduled reconciliation job to rebuild on_hand from ledger and alert on discrepancy.

---

## 19 — Deliverables (ready now)
- Database schema (Mongoose models) and samples (provided)
- REST API route structure + transactional controller code for Confirm Order and Create Purchase (provided)
- React TypeScript skeleton (Vite) with auth, products, order flows (provided)
- OpenAPI spec (openapi.yaml) — base provided
- Scripts: create_repo.sh and create_zip.sh (helpers provided)
- Tests: Jest + Supertest integration tests for auth, order, purchase flows (provided)

---

## 20 — Action items for product & engineering leadership
1. Product: Review/approve MVP scope and business rules:
   - Confirm immediate decrement on Confirmed orders (current design).
   - Confirm retention and purge policy (30-day soft-delete; 3-year financial live retention).
   - Confirm VAT policy per-product (vat_percent + price_includes_vat flag optional later).
2. Engineering:
   - Provision a dev VPS or local Mongo replica set (transactions require replica set).
   - Pull provided repo scaffold, run seed script, and run integration tests.
   - Review models & controller code and finalize input validation (Joi / express-validator).
   - Configure object storage (S3) and update env, implement S3 presigned uploads for images.
   - Implement background job worker for exports when moving heavy jobs off API thread (Bull + Redis).
3. Security & Ops:
   - Rotate and store JWT secrets in vault / environment securely.
   - Implement daily backups and recovery runbook.
4. UX/Design:
   - Product to provide branding assets (logo) and report template requirements (header/footer).

---

## 21 — Recommended next technical tasks (priority)
- [P0] Provision a MongoDB replica set (local or managed) so transactions work reliably.
- [P0] Backend: wire validation middleware and role-based middleware; finalize openapi.yaml & generate client stubs for frontend.
- [P0] Frontend: connect auth flows to real backend, run end-to-end walkthrough (create product, create order, confirm, create purchase).
- [P1] Add background job queue & implement export worker (Bull + Redis) and implement server-side Puppeteer + SheetJS export handlers.
- [P1] Configure S3 (or DO Spaces) and implement image presigned upload flow.
- [P2] Add monitoring (Sentry) and CI pipeline (GitHub Actions: lint/test/build) and automated build artifacts.

Estimated initial delivery time (approximate):
- Backend API + models + transactional endpoints + tests: 2–3 weeks (1 backend engineer)
- Frontend MVP pages + auth + POS flow: 2–3 weeks (1 frontend engineer)
- Integrations (S3, exports, CI, backups): +1–2 weeks

---

## 22 — Suggested tech stack & libraries
- Backend (Node/Express):
  - mongoose, mongoose-long (NumberLong), express-async-errors, bcrypt, jsonwebtoken, uuid
  - puppeteer (PDF), sheetjs or exceljs (XLSX), bull + ioredis (jobs)
- Frontend:
  - React + TypeScript (Vite), react-router, react-hook-form + yup, axios, react-query (recommended)
- Dev & Ops:
  - GitHub Actions for CI, Sentry for errors, Prometheus/CloudWatch, mongodump backups, S3 / CDN
- Testing:
  - Jest + Supertest for API tests; React Testing Library for frontend; Cypress for E2E

