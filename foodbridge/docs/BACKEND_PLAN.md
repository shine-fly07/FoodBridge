# FoodBridge Backend & PostgreSQL Hardening Plan

**Status**: PROPOSED — Awaiting User Approval  
**Date**: November 2026  
**Scope**: `backend/`, `database/`, API contract harmonization, authentication, state transition concurrency, and frontend API sync. No visual design or landing copy changes.

---

## 1. Audit of Current Backend & Database

### 1.1 Summary of Current Architecture
- **Server Framework**: Node.js 20+ with Express 4.19 (`backend/src/server.js`).
- **Database Driver**: `pg` Pool (`backend/src/config/db.js`) pointing to `DATABASE_URL`.
- **Identity Model**: Client sends raw `x-user-id` header (no tokens, no passwords).
- **Core Entities**:
  - `users` (id, name, role, org, created_at)
  - `listings` (id, donor_id, title, meals, pickup_address, notes, expires_at, status, volunteer_id, ngo_id, timestamps)
  - `audits` (physical food rescue inspections, bulk synced via Python CLI using `x-api-key`)
  - `players` & `scores` (2D side game leaderboard, isolated from real food rescue metrics)
- **Data Fallback**: `backend/src/config/db.js` intercepts failed Postgres queries and silently runs an in-memory mock store.

---

### 1.2 Comprehensive Endpoint Audit Table

| Endpoint | Method | Frontend / Script Caller | Request Payload | Response Shape | Fragility & Mismatches Found |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | `checkBackendHealth()` in `api.js` | None | `{ ok: true }` | **Fragile**: Returns static `{ ok: true }` without checking if PostgreSQL is connected or reachable. |
| `/api/users` | `GET` | `apiCall("/api/users")` | None | `Array<User>` | **Security**: Returns all user objects with no pagination or field filtering. |
| `/api/users` | `POST` | `registerUser()` in `api.js` | `{ name, role, org }` | Created `User` | **Bug**: No password or email field. Missing schema validation; any string accepted. |
| `/api/users/login` | `POST` | `loginUser()` in `api.js`, `AuthModal` | `{ name, role, org? }` | `User` object | **Major Bug**: No password authentication. Looks up user by name; if missing, auto-creates user in DB without verification. |
| `/api/listings` | `GET` | `useListings` (20s poll), `LandingView` | None | `Array<Listing>` with urgency | **Performance**: Hardcoded `LIMIT 200` without cursor or limit/offset pagination. Urgency computed dynamically per row. |
| `/api/listings` | `POST` | `DonateView` via `createListing()` | `{ title, meals, pickupAddress, notes, expiresInMinutes }` | `{ id }` | **Mismatch**: Frontend sends camelCase `pickupAddress`, DB column is `pickup_address`. Controller returns only `{ id }`, while frontend expects full created listing. |
| `/api/listings/:id/claim` | `POST` | `CourierView`, `LandingView` teaser | None (`x-user-id` header) | `{ ok: true }` | **Concurrency**: Single UPDATE without transaction. Does not return updated listing; frontend must issue separate refetch. |
| `/api/listings/:id/collect` | `POST` | `CourierView` | None (`x-user-id` header) | `{ ok: true }` | **Fragile**: Requires `volunteer_id = req.user.id`. Returns generic `{ ok: true }`. |
| `/api/listings/:id/distribute`| `POST` | `NgoView` | None (`x-user-id` header) | `{ ok: true }` | **Fragile**: Sets `ngo_id = req.user.id`. Does not check if user role is NGO in SQL (only in middleware). |
| `/api/impact/monthly` | `GET` | `ImpactView`, `App.jsx` | Query: `?donorId=` | `{ meals, listings, org }` | **Bug**: Only counts listings where `collected_at >= date_trunc('month', now())`. Doesn't return waste_kg or co2e_kg; frontend calculates locally. |
| `/api/impact/summary` | `GET` | `LandingHeroStats`, `ImpactView` | None | `{ available, claimed, collected, distributed, active_listings, meals_diverted }` | **Mismatch**: Missing server-side `waste_kg` and `co2e_kg` in Postgres query; frontend re-derives them. |
| `/api/audits/bulk` | `POST` | `community-audit/audit_sync.py` | `{ rows: [...] }`, `x-api-key` | `{ received, inserted, skippedDuplicates }` | **Fragile**: Ad-hoc row validation in JS loop. Rollback on failure drops entire batch instead of reporting row-by-row errors. |
| `/api/audits/summary` | `GET` | `ImpactView` | None | `{ verified_meals, total_kg, audits, recent: [...] }` | **Audit**: Works, but lacks date-range filtering. |
| `/api/scores` | `POST` | `game-client/src/scenes/GameScene.js`| `{ playerName, points, itemsSaved, itemsWasted }` | `{ id, estimatedMeals }` | **Audit**: Works, uses separate players table. |
| `/api/scores/leaderboard` | `GET` | `GameRedirectView`, game client | None | `Array<{ name, best_points, total_meals, games }>` | **Audit**: Works cleanly. |
| `/api/scores/impact` | `GET` | None (Unregistered) | None | `{ meals, games }` | **Bug**: Controller function `getImpactTotal` is exported in `scoreController.js:61` but never registered in `server.js`. |

---

### 1.3 Key Problems Found (With Code References)

1. **Silent Fallback to In-Memory Data (`backend/src/config/db.js:51-62`)**:
   - `pool.query` catches all errors and transparently routes to `handleMemoryQuery`. If PostgreSQL is offline, down, or misconfigured, the backend pretends everything is fine and operates on static dummy data.
   - **Fix**: Remove silent fallback. Add strict `DEMO_MODE=true` environment flag requirement for mock mode. Boot must fail fast if Postgres is down in standard mode.

2. **Insecure Identity via Header (`backend/src/controllers/userController.js:6-37`)**:
   - Identity is completely unauthenticated: clients send arbitrary `x-user-id: 1` or `x-user-id: "volunteer"`.
   - `schema.sql` lacks password hashing columns, email verification, or session tokens.
   - **Fix**: Real authentication with bcrypt password hashing, signed JWT tokens issued via `POST /api/users/login` and `POST /api/users/signup`, verified via `Authorization: Bearer <token>`.

3. **Port Conflict Crash on `EADDRINUSE` (`backend/src/server.js:40-41`)**:
   - `app.listen(port)` does not handle the `error` event. If a stale instance is running on port 4000, Node crashes with an unhandled exception stack trace.
   - **Fix**: Listen for `'error'` event, display a clean human-readable instruction (`"Port 4000 is in use. Run npm run kill:ports or set PORT=..."`), and exit with code 1. Add graceful shutdown (`SIGINT`, `SIGTERM`).

4. **Missing Idempotent Database Migrations (`backend/database/schema.sql`)**:
   - Schema exists only as a monolithic raw SQL file without version tracking or rollback support.
   - **Fix**: Numbered idempotent migration scripts (`001_initial_schema.sql`, `002_add_auth_and_constraints.sql`) with a lightweight Node.js migration runner (`npm run db:migrate`) and separate seed script (`npm run db:seed`).

5. **Inconsistent Error Shapes and Unhandled Promise Rejections**:
   - Endpoints return varied error shapes: `{ error: string }`, `{ error: string, csvLines: [...] }`, or plain text on unhandled rejections.
   - **Fix**: Standardized error envelope `{ error: { code, message, details? } }` with global Express error handler and `asyncHandler` wrapper.

6. **Race Conditions in State Transitions (`backend/src/controllers/listingController.js:48-78`)**:
   - Claim/collect/distribute transitions do not lock records in a transaction (`SELECT ... FOR UPDATE` or atomic single-statement UPDATE with `RETURNING`).
   - Double-claiming by two couriers simultaneously must guarantee exactly one 200 success and one 409 Conflict.
   - **Fix**: Atomic SQL transition with `RETURNING *` and transactional concurrency test.

7. **Missing Expiry Transition Worker**:
   - Expired listings are filtered out at query time, but their database row remains `status = 'available'`.
   - **Fix**: Background timer job in `server.js` marking `status = 'expired'` when `expires_at <= now()` and `status = 'available'`.

8. **Missing Environmental Impact Server Computations**:
   - Impact constants (`KG_PER_MEAL = 0.40`, `CO2E_PER_KG_WASTE = 2.50`) are currently calculated partly in frontend React components and partly in controllers.
   - **Fix**: Define constants centrally in backend and return canonical `meals`, `waste_kg`, `co2e_kg` in `GET /api/impact/summary` and `GET /api/impact/monthly`.

---

## 2. Proposed Database Schema & Migrations

### 2.1 Migration Strategy
Migrations are plain SQL files executed in numerical order inside an explicit database transaction (`BEGIN ... COMMIT`) and tracked in a `schema_migrations` table:
```sql
CREATE TABLE IF NOT EXISTS schema_migrations (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL UNIQUE,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.2 Baseline & Safe Incremental Migrations

#### Migration 001: Baseline Schema (Matching Existing Tables with IF NOT EXISTS)
File: `backend/database/migrations/001_baseline.sql`
- Ensures tables `players`, `scores`, `audits`, `users`, and `listings` exist matching the legacy schema safely without failing on existing deployments.

#### Migration 002: Authentication, Integrity Constraints & Enums
File: `backend/database/migrations/002_auth_and_constraints.sql`
- **Safely ALTERs `users` table**:
  - Adds `email VARCHAR(120)`, `password_hash VARCHAR(255)`, `phone VARCHAR(20)`, `updated_at TIMESTAMPTZ DEFAULT now()`.
  - For existing rows without email: populates placeholder email (`user_<id>@placeholder.foodbridge.local`) and sets a placeholder bcrypt password hash requiring a password reset before standard email login.
  - Adds `UNIQUE (email)` constraint.
- **Audit Table Deduplication**:
  - Cleans up any existing duplicate records before enforcing uniqueness:
    ```sql
    DELETE FROM audits a USING audits b
    WHERE a.id < b.id
      AND a.audit_date = b.audit_date
      AND a.location = b.location
      AND a.volunteer = b.volunteer
      AND a.food_type = b.food_type;
    ```
  - Enforces `UNIQUE (audit_date, location, volunteer, food_type)`.
- **Listings Enhancements**:
  - Expands `status` check constraint: `CHECK (status IN ('available', 'claimed', 'collected', 'distributed', 'expired', 'cancelled'))`.
  - Adds `CONSTRAINT chk_expiry_future CHECK (expires_at > created_at)`.
  - Adds foreign key `ON DELETE` rules (`ON DELETE RESTRICT` for donors, `ON DELETE SET NULL` for couriers/NGOs).
  - Indexes: `(status, expires_at)`, `(donor_id)`, `(volunteer_id)`, `(ngo_id)`.

### 2.3 Seed Data (`npm run db:seed`)
File: `backend/database/seed.js`
- **Production Safety Gate**: Refuses execution immediately if `NODE_ENV === "production"`.
- Creates standard demo users with hashed passwords (using bcrypt, 10 rounds):
  1. Donor: `donor@foodbridge.org` / password: `password123` / Org: `Green Valley Dining Hall`
  2. Volunteer: `volunteer@foodbridge.org` / password: `password123` / Name: `Courier Alex`
  3. NGO: `ngo@foodbridge.org` / password: `password123` / Org: `Hope Community Shelter`
- Populates sample active and completed listings.
- `npm run db:init` runs migrations followed by seed.

---

## 3. Standardized API Contract (`docs/API.md`)

All responses adhere to a consistent contract. Errors always return an explicit error code, human message, and optional validation field details.

### 3.1 Standard Response Envelopes
- **Success (Single Resource)**: `{ "data": { ... } }` or direct resource payload
- **Success (Paginated Collection)**: `{ "data": [ ... ], "pagination": { "total": 42, "limit": 20, "offset": 0, "hasMore": true } }`
- **Standard Error Envelope**:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Title and pickup address are required.",
      "details": [
        { "field": "meals", "message": "Meals must be an integer greater than 0" }
      ]
    }
  }
  ```

### 3.2 Canonical HTTP Status Codes
- `200 OK`: Successful retrieval or update
- `201 Created`: Successful resource creation
- `400 Bad Request`: Malformed JSON or invalid syntax
- `401 Unauthorized`: Missing or invalid Bearer JWT (or invalid `x-api-key`)
- `403 Forbidden`: Authenticated user lacks required role or resource ownership
- `404 Not Found`: Listing or user does not exist
- `409 Conflict`: State conflict (e.g. listing already claimed or expired)
- `422 Unprocessable Entity`: Semantic validation failures
- `500 Internal Server Error`: Unhandled server exception (stack trace redacted in production)

### 3.3 Core Endpoints Specification

#### System & Health
- `GET /api/health`
  - Headers: None
  - Response `200`: `{ "status": "ok", "uptime": 124.5, "database": "connected", "version": "0.1.0" }`
  - Response `503`: `{ "status": "degraded", "database": "disconnected" }`

#### Authentication & Users
- `POST /api/users/signup`
  - Body: `{ name: string, email: string, password: string, role: "donor"|"volunteer"|"ngo", org?: string }`
  - Response `201`: `{ "token": string, "user": { id, name, email, role, org } }`
- `POST /api/users/login`
  - Body: `{ email: string, password: string }` OR `{ demoRole: "donor"|"volunteer"|"ngo" }` (for 1-click dev demo login)
  - Response `200`: `{ "token": string, "user": { id, name, email, role, org } }`
- `GET /api/users/me`
  - Headers: `Authorization: Bearer <token>`
  - Response `200`: `{ id, name, email, role, org }`

#### Food Rescue Listings
- `GET /api/listings`
  - Query: `?status=available|claimed|collected|distributed&limit=50&offset=0`
  - Response `200`:
    ```json
    {
      "listings": [
        {
          "id": 1,
          "title": "50 Servings Fresh Veg Curry & Rice",
          "meals": 50,
          "pickupAddress": "Gate 3",
          "notes": "Hot containers",
          "expiresAt": "2026-11-25T14:00:00.000Z",
          "status": "available",
          "urgency": "green",
          "minutesLeft": 135,
          "donor": { "id": 1, "name": "Manager", "org": "Dining Hall" },
          "volunteer": null,
          "ngo": null,
          "createdAt": "2026-11-25T11:45:00.000Z"
        }
      ],
      "total": 1
    }
    ```
- `POST /api/listings`
  - Headers: `Authorization: Bearer <token>` (Role: `donor`)
  - Body: `{ title: string, meals: number, pickupAddress: string, notes?: string, expiresInMinutes: number }`
  - Response `201`: Full created `Listing` object
- `POST /api/listings/:id/claim`
  - Headers: `Authorization: Bearer <token>` (Role: `volunteer`)
  - Response `200`: Full updated `Listing` (status = `claimed`, `volunteer_id` set)
  - Response `409`: `{ "error": { "code": "ALREADY_CLAIMED", "message": "This listing has already been claimed or has expired." } }`
- `POST /api/listings/:id/collect`
  - Headers: `Authorization: Bearer <token>` (Role: `volunteer`, must be claiming volunteer)
  - Response `200`: Full updated `Listing` (status = `collected`, `collected_at` set)
  - Response `403`: `{ "error": { "code": "NOT_OWNER", "message": "Only the courier who claimed this rescue can mark it collected." } }`
- `POST /api/listings/:id/distribute`
  - Headers: `Authorization: Bearer <token>` (Role: `ngo`)
  - Response `200`: Full updated `Listing` (status = `distributed`, `ngo_id` set, `distributed_at` set)
- `POST /api/listings/:id/cancel`
  - Headers: `Authorization: Bearer <token>` (Role: `donor`, must be listing owner)
  - Response `200`: Full updated `Listing` (status = `cancelled`)

#### Impact & Audits
- `GET /api/impact/summary`
  - Response `200`:
    ```json
    {
      "available": 3,
      "claimed": 1,
      "collected": 2,
      "distributed": 14,
      "activeListings": 4,
      "mealsDiverted": 640,
      "wasteKg": 256.0,
      "co2eKg": 640.0
    }
    ```
- `GET /api/impact/monthly`
  - Response `200`: `{ "monthly": [ { "month": "Nov", "meals": 640, "wasteKg": 256.0, "co2eKg": 640.0 } ] }`
- `POST /api/audits/bulk`
  - Headers: `x-api-key: <AUDIT_API_KEY>`
  - Body: `{ "rows": [ { audit_date, location, volunteer, food_type, weight_kg, meals_served, notes } ] }`
  - Response `201`: `{ "received": 25, "inserted": 25, "skippedDuplicates": 0 }`
  - Response `422`: `{ "error": { "code": "INVALID_AUDIT_ROWS", "message": "Validation failed on 2 rows", "details": [...] } }`

---

## 4. API Hardening & Security Specifications

1. **Database Connection Pool**:
   - `pg.Pool` initialized with:
     - `max: 20` clients
     - `idleTimeoutMillis: 30000`
     - `connectionTimeoutMillis: 5000`
   - Explicit failure handling: if DB connection fails at boot, the process logs a clean diagnostic message and terminates immediately (no silent fake-mode fallback unless `DEMO_MODE=true` is explicitly set in env).

2. **Boot Validation & Environment Integrity**:
   - Validate presence of: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `AUDIT_API_KEY`, `CORS_ORIGIN`.
   - In production (`NODE_ENV === "production"`), reject default secrets (`AUDIT_API_KEY === "change-me"` or short `JWT_SECRET`).

3. **Port Conflict Handling & Clean Exit**:
   ```javascript
   const server = app.listen(port, () => console.log(`FoodBridge API active on :${port}`));
   server.on("error", (err) => {
     if (err.code === "EADDRINUSE") {
       console.error(`\n[FATAL] Port ${port} is already in use by another process.`);
       console.error(`Stop the existing process or specify an alternative PORT in .env.\n`);
       process.exit(1);
     }
     throw err;
   });
   ```

4. **Graceful Process Shutdown**:
   - Capture `SIGINT` and `SIGTERM`.
   - Close HTTP listener, stop background expiry intervals, drain DB pool (`await pool.end()`), and exit with code 0.

5. **Atomic State Transitions**:
   - Claim transition query:
     ```sql
     UPDATE listings
     SET status = 'claimed', volunteer_id = $2, claimed_at = now(), updated_at = now()
     WHERE id = $1 AND status = 'available' AND expires_at > now()
     RETURNING *;
     ```
   - If `rowCount === 0`, verify whether listing is already claimed vs expired vs non-existent and return appropriate 409 or 404 code.

6. **Automatic Expiry Sweeper**:
   - `setInterval` running every 60 seconds executing:
     ```sql
     UPDATE listings
     SET status = 'expired', updated_at = now()
     WHERE status = 'available' AND expires_at <= now();
     ```

7. **Middleware & Security**:
   - `helmet` for security response headers.
   - `express-rate-limit`:
     - Global limiter: 150 requests / minute
     - Auth routes (`/api/users/login`, `/api/users/signup`): 25 requests / 15 minutes
   - `zod` schemas for request body and query parameter validation.

---

## 5. Authentication Architecture

1. **Password Security**:
   - Passwords hashed using `bcryptjs` with salt rounds = 10.
2. **Token Security**:
   - Signed JSON Web Tokens (`jsonwebtoken`) containing `{ id, role, email, name }`.
   - Expiration: 7 days.
   - Header: `Authorization: Bearer <token>`.
3. **Demo Quick-Login Compatibility**:
   - To preserve one-click role switching in dev and testing, `POST /api/users/login` supports `{ demoRole: "donor"|"volunteer"|"ngo" }`, returning a valid signed JWT for that role's seeded user account.
4. **Token Expiration Handling in Frontend**:
   - If an API request returns `401 Unauthorized`, `api.js` dispatches an auth expiration event.
   - `AuthContext` clears stored token, presents an informative toast (*"Your session has expired. Please sign in again."*), opens `AuthModal`, and preserves queued actions.

---

## 6. Frontend <-> Backend Synchronization

1. **API Client (`web-portal/src/services/api.js`)**:
   - Attaches `Authorization: Bearer <token>` to all authenticated requests.
   - Translates backend snake_case fields to frontend camelCase properties (`pickup_address` -> `pickupAddress`, `expires_at` -> `expiresAt`, `safe_until` mapped cleanly).
   - Maps backend error codes to user-friendly UI toasts:
     - `ALREADY_CLAIMED` (409) -> *"Another courier just claimed this batch."*
     - `NOT_OWNER` (403) -> *"Only the assigned courier can mark this delivery collected."*
     - `UNAUTHENTICATED` (401) -> Prompts login modal.
2. **Immediate Data Freshness**:
   - After `claim`, `collect`, `distribute`, or `createListing`, the frontend updates local state immediately and triggers a background refetch rather than waiting 20s.
   - Window focus listener (`visibilitychange`) resumes polling when the tab is visible and pauses when backgrounded.
3. **Cross-Platform Dev Scripts**:
   - Add `kill:ports` using a lightweight cross-platform Node script (`kill_ports.js`) terminating processes on ports 4000, 5174, 5173.
   - Update `npm run dev:all` with reliable startup messaging.

---

## 7. Comprehensive Test Plan

### 7.1 Backend Integration Tests (`npm run test:backend`)
Framework: `supertest` + Node test runner / `vitest` / `mocha`.
- **Auth & Permissions**:
  - `POST /api/users/signup` with valid payload -> 201 + valid JWT
  - `POST /api/users/signup` with duplicate email -> 409 Conflict
  - `POST /api/users/login` with invalid password -> 401 Unauthorized
  - Protected route access without Bearer token -> 401
  - Donor attempting to claim delivery -> 403 Forbidden
- **Listings Lifecycle**:
  - Donor posts listing -> 201 + status `available`
  - Volunteer claims listing -> 200 + status `claimed` + volunteer assigned
  - Other volunteer attempts to claim claimed listing -> 409 Conflict
  - Volunteer collects listing -> 200 + status `collected`
  - Non-assigned volunteer attempts to collect -> 403 Forbidden
  - NGO confirms receipt -> 200 + status `distributed`
- **Concurrency Test (Double Claim Race)**:
  - Spawn 10 concurrent HTTP claim requests against the same available listing.
  - Assert: Exactly 1 request receives `200 OK`, exactly 9 receive `409 Conflict`.
- **Expiry Sweeper**:
  - Insert listing with past `expires_at`.
  - Trigger sweeper -> listing status changes to `expired`.
- **Community Audit Sync**:
  - `POST /api/audits/bulk` with valid `x-api-key` -> 201 + inserts recorded.
  - `POST /api/audits/bulk` with missing/wrong key -> 401 Unauthorized.
  - `POST /api/audits/bulk` with malformed rows -> 422 with line errors.
- **Health Check**:
  - `GET /api/health` returns 200 with database status.

### 7.2 End-to-End Browser Tests (`npm run test:e2e`)
Extended Puppeteer suite validating:
1. One-click role login generates real tokens and updates navbar.
2. Donor creates listing -> appears immediately on live surplus board.
3. Volunteer claims listing -> queued auth flow completes -> moves to Courier board.
4. Courier marks collected -> status moves to collected.
5. NGO confirms distribution -> impact counter increments.
6. Error toast appears when attempting invalid action.
7. Graceful offline fallback if backend process is killed.

---

## 8. Rollout Plan by Phases

- **Phase 2 (Database)**: Migrations table, `001_core_schema.sql`, migration runner, seed script.
- **Phase 3 (API Hardening)**: Express error middleware, zod schemas, atomic transitions, expiry sweeper, port conflict handler, rate limiting.
- **Phase 4 (Authentication)**: Bcrypt password hashing, JWT generation & verification middleware, demo login fallback.
- **Phase 5 (Frontend Sync)**: Update `api.js`, `AuthContext.jsx`, `AuthModal.jsx`, data normalization, toast mappings.
- **Phase 6 (Verification & Tests)**: Execute backend supertest suite, concurrency test, audit script test, and Puppeteer suite.

---

*This plan is ready for review. Once approved, implementation will proceed systematically phase by phase.*
