# meraaquii-interactive
Backend and admin panel for interactive.meraaquii 

# Meraaqui Admin Migration Guide

## Project Purpose
This project is a PHP-based admin panel for real estate/project management and customer tracking. The goal is to migrate the current monolithic PHP application into a modern monolithic stack using React for the frontend and Node.js for the backend with an MVC-style structure.

## What this README contains
- Project start instructions
- Project end / delivery checklist
- Recommended database structure improvements
- Core migration plan and best practices

---

## 1. Project Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- MariaDB/MySQL server installed and running
- PHP/MySQL database dump available: `class/meraaqui_admin.sql`
- Code editor such as VS Code

### Initial setup
1. Clone or copy the project workspace.
2. Create a backend folder and initialize Node:
   - `mkdir backend`
   - `cd backend`
   - `npm init -y`
3. Create a frontend folder and initialize React:
   - `mkdir frontend`
   - `cd frontend`
   - `npm create vite@latest . -- --template react`
4. Install backend dependencies:
   - `npm install express mysql2 dotenv cors bcrypt jsonwebtoken`
5. Install frontend dependencies:
   - `npm install axios react-router-dom`
6. Create a `.env` file in `backend/` with database credentials and server settings.
7. Import the existing SQL dump into MariaDB/MySQL.

### First migration step
- Map the current PHP pages to API endpoints.
- Identify core entities and translate them to REST resources.
- Start with the auth and login flow.

### Recommended backend structure
```
backend/
  app.js
  package.json
  config/
    db.js
    env.js
  controllers/
  models/
  routes/
  services/
  middlewares/
  utils/
```

### Recommended frontend structure
```
frontend/
  src/
    App.jsx
    index.jsx
    pages/
    components/
    services/
    routes/
    context/
```

---

## 2. Project End

### Final delivery checklist
- [ ] All existing functionality is available via React UI and Node APIs
- [ ] Login / OTP / forgot-password flows work correctly
- [ ] Client, project, device, tower, floor, apartment, and typology CRUD are implemented
- [ ] Comments and replies are migrated or replaced with the same behavior
- [ ] Reports / missed call data access is available
- [ ] Database schema is normalized and indexed correctly
- [ ] Backend validation and error handling is implemented
- [ ] Frontend navigation is stable and responsive
- [ ] Old PHP pages are retired cleanly
- [ ] Deployment instructions are documented

### Final release actions
1. Run full application test cycle in staging.
2. Validate database migration and data integrity.
3. Remove or archive legacy PHP UI pages.
4. Update deployment configuration for the new stack.
5. Publish release notes and project handoff documentation.

---

## 3. Recommended Database Structure Improvements

### General database best practices
- Use `InnoDB` and enforce foreign key constraints.
- Add primary keys with `AUTO_INCREMENT`.
- Use consistent naming conventions: `snake_case` is acceptable.
- Normalize data where appropriate.
- Avoid storing JSON in text fields unless necessary.
- Add timestamp and audit columns: `created_at`, `updated_at`, `deleted_at` if soft deletes are used.
- Create indexes on foreign keys and searchable fields.

### Core tables to improve

#### `admin_user`
- Primary key: `user_id INT AUTO_INCREMENT PRIMARY KEY`
- Keep `user_type` as enum or small lookup table.
- Replace `user_password VARCHAR(50)` with length 255 and store bcrypt hashes.
- Add `created_at DATETIME DEFAULT CURRENT_TIMESTAMP` and `updated_at DATETIME`.
- Create unique constraints on `user_email` and `user_no`.

#### `mr_client`
- Primary key: `client_id INT AUTO_INCREMENT PRIMARY KEY`
- Add `created_at` and `updated_at`.
- Add a foreign key to subscription table: `subscribtion_id`.
- Add indexes on `client_status` and `client_email`.

#### `mr_project_master`
- Primary key: `project_id INT AUTO_INCREMENT PRIMARY KEY`
- `client_id` should reference `mr_client(client_id)`.
- `proj_details_id` should reference `mr_project_details(proj_details_id)`.
- Add `created_at` and `updated_at`.

#### `mr_project_details`
- Primary key: `proj_details_id INT AUTO_INCREMENT PRIMARY KEY`
- Use consistent naming for fields like `project_tower_count`, `project_floor_count`, `project_flat_count`.
- Use `TEXT` only for long text fields.

#### `mr_customer`
- Primary key: `cus_id INT AUTO_INCREMENT PRIMARY KEY`
- Add `created_at` and `updated_at`.
- Add foreign keys: `client_id`, `salesman_id`.

#### `mr_device`
- Primary key: `device_id INT AUTO_INCREMENT PRIMARY KEY`
- Use `device_password VARCHAR(255)` and hash credentials if storing passwords.
- Add `created_at`, `updated_at`, and `device_status` index.

#### `mr_tower_master`, `mr_floor_master`, `mr_appartment_master` and `mr_typology`
- Use explicit FK relationships:
  - `tower.project_id` → `mr_project_master(project_id)`
  - `floor.project_id`, `floor.tower_id`
  - `apartment.project_id`, `apartment.tower_id`, `apartment.floor_id`, `apartment.typology_id`
- Add meaningful indexes to speed lookups.

#### `mr_customer_log`
- Primary key: `customer_log_id INT AUTO_INCREMENT PRIMARY KEY`
- Foreign keys to customer, project, tower, floor, apartment.

#### `mr_otp_log`
- Primary key: `otp_log_id INT AUTO_INCREMENT PRIMARY KEY`
- Keep OTP records with `user_id`, `otp_code`, `otp_type`, `created_at`.
- Avoid storing OTP in plaintext for long duration; keep short lived.

#### Comment / reply tables
- `anush_web_comment` primary key `comment_id INT AUTO_INCREMENT PRIMARY KEY`
- `amush_web_reply` primary key `web_reply_id INT AUTO_INCREMENT PRIMARY KEY`
- Add `comment_id` foreign key to comments.
- Add `created_at` and `updated_at`.

### Example improved table definition
```sql
CREATE TABLE admin_user (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_type ENUM('A','C','Cu','S') NOT NULL DEFAULT 'A',
  user_name VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_status ENUM('A','I') NOT NULL DEFAULT 'A',
  user_no VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_contact_no VARCHAR(50) DEFAULT NULL,
  user_address TEXT DEFAULT NULL,
  login_otp VARCHAR(10) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_user_email (user_email),
  UNIQUE KEY uq_admin_user_no (user_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 4. Migration Plan

### Phase 1: Setup and scaffolding
- Build Node backend skeleton
- Build React frontend scaffold
- Import database and verify tables

### Phase 2: Core API development
- Auth and session management
- Client CRUD
- Project CRUD
- Device CRUD
- Salesman CRUD
- Customer and customer log
- Tower/floor/apartment/typology CRUD

### Phase 3: UI migration
- Login page
- Dashboard page
- Core list/detail pages
- Forms and modals for create/update
- Comments / replies pages

### Phase 4: Data and DB cleanup
- Normalize and refactor tables
- Remove duplicate or unused fields
- Add indexes and constraints
- Migrate existing data as needed

### Phase 5: Testing and deployment
- Functional tests for APIs
- UI validation and end-to-end flow
- Final deployment to staging/production
- Archive legacy PHP codebase once stable

---

## 5. Recommended endpoints and resources
Use JSON REST endpoints for these main resources:
- `/api/auth/login`
- `/api/auth/otp`
- `/api/users`
- `/api/clients`
- `/api/projects`
- `/api/devices`
- `/api/salesmen`
- `/api/customers`
- `/api/towers`
- `/api/floors`
- `/api/apartments`
- `/api/typologies`
- `/api/comments`
- `/api/replies`
- `/api/reports`
- `/api/misscalls`

---

## 6. Notes for the current PHP project
- The existing app uses `class/helper/db_conn.php` for raw SQL.
- Stored procedures are invoked from `class/class.webservice.php`.
- Legacy PHP views are in `class/view/`.
- Current DB dump uses mixed charset and mostly `utf8mb3` / `latin1`.
- The new system should standardize on `utf8mb4` for all tables.

---

## 7. Multi-tenant architecture concept
This project can evolve into a multi-tenant SaaS backend by using a single NestJS deployable app and PostgreSQL.
The core multi-tenant model is path-based tenancy with hybrid storage:
- `sub.domain.com/admin` → super admin mode
- `sub.domain.com/{tenant_slug}` → tenant request

### Tenant resolution
- The tenant slug is resolved from the first URL segment.
- If the first segment is `admin`, the request is treated as super admin and tenant data is not applied.
- Otherwise, the slug is used to look up tenant metadata.
- Tenant metadata includes tenancy type:
  - `shared` tenant uses a shared database with `tenant_id` filtering
  - `dedicated` tenant uses its own database connection

### Hybrid tenancy decision
- Shared tenancy: a common Postgres database stores rows for many tenants.
  - Every query includes `tenant_id`.
  - This is efficient for standard plans.
- Dedicated tenancy: premium tenants get a separate Postgres database.
  - The app selects a dedicated connection pool for that tenant.
  - Data is physically isolated.

### Runtime flow
1. Request enters NestJS.
2. Middleware extracts `tenant_slug` from path.
3. Tenant service loads tenant metadata from the master database or cache.
4. The system records tenant context in request-scoped storage.
5. DB manager chooses the correct pool:
   - shared pool for shared tenants
   - dedicated pool for premium tenants
6. Service and repository operations execute using tenant-aware connections.
7. Shared queries add `WHERE tenant_id = currentTenantId`.
8. Dedicated queries use the tenant-specific DB directly.

### Tenant context management
- Use `AsyncLocalStorage` or request-scoped providers to store tenant state.
- This prevents tenant leakage between asynchronous requests.
- Services and repositories read from this context rather than relying on global variables.
- Example state includes: `{ tenantSlug, tenantId, tenancyType, dbConfig }`.

### Authentication
- JWT tokens should include tenant metadata:
  - `tenant_slug`
  - `tenant_id` (for shared DB)
  - `roles`
- On each request, validate that the token tenant matches the URL tenant.
- If the token tenant does not match the path tenant, reject the request.

### Why repositories must be tenant-aware
- In a shared database, failure to filter by tenant_id causes data leakage.
- In dedicated mode, the repository must use the correct tenant database client.
- Tenant-aware repositories enforce isolation and prevent horizontal privilege escalation.

### Sample NestJS folder structure
```
src/
  main.ts
  app.module.ts
  common/
    tenancy/
      tenant.middleware.ts
      tenant.context.ts
      tenant.service.ts
    database/
      db.manager.ts
      prisma.manager.ts
  modules/
    auth/
    tenants/
    users/
    projects/
    orders/
    reports/
```

### Example tenant middleware
```ts
import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../common/tenancy/tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const segments = req.path.split('/').filter(Boolean);
    const slug = segments[0];

    if (!slug) {
      throw new NotFoundException('Tenant slug missing');
    }

    if (slug === 'admin') {
      req['tenantContext'] = { isAdmin: true };
      return next();
    }

    const tenant = await this.tenantService.findBySlug(slug);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    this.tenantService.setContext(req, tenant);
    next();
  }
}
```

### Example DB manager pseudo-code
```ts
class DbManager {
  private sharedClient = new PrismaClient({ datasources: { db: { url: process.env.SHARED_DB_URL } } });
  private dedicatedClients = new Map<string, PrismaClient>();

  getClient(tenantContext) {
    if (!tenantContext || tenantContext.isAdmin) {
      return this.sharedClient;
    }

    if (tenantContext.tenancyType === 'shared') {
      return this.sharedClient;
    }

    const key = tenantContext.tenantSlug;
    if (!this.dedicatedClients.has(key)) {
      const client = new PrismaClient({
        datasources: { db: { url: tenantContext.dedicatedDbUrl } },
      });
      this.dedicatedClients.set(key, client);
    }
    return this.dedicatedClients.get(key);
  }
}
```

### Performance optimizations for 1000+ tenants
- Cache tenant metadata aggressively.
- Use pgBouncer between NestJS and Postgres.
- Limit dedicated DB pools with an LRU eviction policy.
- Keep shared tables indexed on `tenant_id`.
- Use JWT auth to avoid sticky session state.
- Move heavy reports off the request path.

---

## 8. Final remarks
This README is the baseline for starting and finishing the React + Node migration.
Use it as the project charter, the database improvement guide, and the release checklist.

If you want, I can next generate the actual monorepo scaffold and a concrete `backend/` + `frontend/` starter setup.
