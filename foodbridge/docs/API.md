# FoodBridge API Specification & Contract Reference

**Version**: 2.0.0 (Hardened)  
**Base URL**: `http://localhost:4000` (or `FOODBRIDGE_API_URL`)  
**Standard Error Envelope**: `{ "error": { "code": string, "message": string, "details"?: any } }`

---

## 1. Breaking Changes from v1.0

1. **Authentication Mechanism**:
   - `x-user-id` header is removed for all identity derivation.
   - All protected endpoints now require:
     ```http
     Authorization: Bearer <jwt_token>
     ```
   - Tokens have a **24-hour expiration** and are issued upon successful login or signup.
2. **Login & Signup Endpoints**:
   - `POST /api/users/login` now requires `{ email, password }`. In development only, `{ demoRole: "donor"|"volunteer"|"ngo" }` is permitted when `DEMO_MODE=true` and `NODE_ENV !== 'production'`.
   - `POST /api/users/signup` is introduced for new registrations with `{ name, email, password, role, org? }`.
   - `POST /api/users` legacy endpoint redirects to `/api/users/signup` or requires authentication.
3. **Transition Response Shapes**:
   - Listing transitions return the **full updated Listing resource** (`{ id, title, meals, status, ... }`).
   - Workflow: donor creates (`available`), NGO accepts with a drop-off address (`accepted`), volunteer claims (`claimed`), collects (`collected`), reports drop-off (`delivered`), then the assigned NGO confirms receipt (`distributed`).
4. **Impact Calculation & Definitions**:
   - **"Meals Diverted" Definition**: A meal is officially counted as diverted from waste once it is physically collected by a volunteer courier from the donor facility (`status IN ('collected', 'delivered', 'distributed')`). Unclaimed listings and listings expired prior to collection are never counted.
   - Environmental factors are computed canonically by the backend:
     - `waste_kg = meals * 0.40` (Assumes ~0.4 kg edible portions per meal)
     - `co2e_kg = waste_kg * 2.50` (FAO-derived factor of ~2.5 kg CO2e per kg food waste)
   - `GET /api/impact/summary` returns server-computed `mealsDiverted`, `wasteKg`, and `co2eKg`.
   - `GET /api/impact/monthly` returns `{ monthly: [ ... ], totalMeals, totalWasteKg, totalCo2eKg }`. `?donorId=` optionally scopes to a specific donor's contributions.
5. **Collection Responses & Pagination**:
   - Collections (e.g. `GET /api/listings`) return `{ data: [...], pagination: { total, limit, offset, hasMore } }`.
6. **User Dump Restriction**:
   - `GET /api/users` is restricted. To fetch current profile, use `GET /api/users/me`.
7. **Listing Expiry & Claim Abandonment**:
   - When a listing passes `expires_at` while `status = 'available'` or `'accepted'`, it is marked `'expired'`.
   - When a listing passes `expires_at` while `status = 'claimed'` but **not collected**, it is automatically transitioned to `'expired'`, courier assignment is revoked, and the food is retired to guarantee food safety.

---

## 2. Authentication & User Endpoints

### 2.1 POST /api/users/signup
Registers a new platform user.

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123",
  "role": "donor",
  "org": "Downtown Bakery"
}
```
- `role`: Must be one of `"donor"`, `"volunteer"`, `"ngo"`.
- `password`: Minimum 8 characters.

**Success Response `201 Created`**:
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 4,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "donor",
    "org": "Downtown Bakery",
    "createdAt": "2026-11-25T12:00:00.000Z"
  }
}
```

**Errors**:
- `400 / 422`: `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }`
- `409`: `{ "error": { "code": "EMAIL_EXISTS", "message": "An account with this email already exists." } }`

---

### 2.2 POST /api/users/login
Authenticates an existing user and returns a 24h JWT.

**Request Body (Standard)**:
```json
{
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Request Body (Dev Demo Quick-Login)** *(Only when `DEMO_MODE=true` & `NODE_ENV!=='production'`)*:
```json
{
  "demoRole": "volunteer"
}
```

**Success Response `200 OK`**:
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 2,
    "name": "Courier Alex",
    "email": "volunteer@foodbridge.org",
    "role": "volunteer",
    "org": "Swift Rescue Network"
  }
}
```

**Errors**:
- `401`: `{ "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid email or password." } }`
- `403`: `{ "error": { "code": "DEMO_DISABLED", "message": "Demo quick login is disabled in this environment." } }`

---

### 2.3 GET /api/users/me
Retrieves current authenticated profile.

**Headers**: `Authorization: Bearer <token>`

**Success Response `200 OK`**:
```json
{
  "id": 2,
  "name": "Courier Alex",
  "email": "volunteer@foodbridge.org",
  "role": "volunteer",
  "org": "Swift Rescue Network"
}
```

---

## 3. Surplus Food Listings Endpoints

### 3.1 GET /api/listings
Returns active and historical surplus listings.

**Query Parameters**:
- `status` (optional): `available`, `accepted`, `claimed`, `collected`, `delivered`, `distributed`, `expired`, `cancelled`
- `limit` (optional, default: 50, max: 100)
- `offset` (optional, default: 0)

**Success Response `200 OK`**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "50 Servings Fresh Veg Curry & Rice",
      "meals": 50,
      "pickupAddress": "Student Center Gate 3, Central Campus",
      "dropoffAddress": "Hope Shelter, 10 Main Street",
      "notes": "Packed in sanitized containers",
      "expiresAt": "2026-11-25T14:30:00.000Z",
      "status": "accepted",
      "urgency": "green",
      "minutesLeft": 135,
      "donor": {
        "id": 1,
        "name": "Campus Canteen Manager",
        "org": "Green Valley Dining Hall"
      },
      "volunteer": null,
      "ngo": {
        "id": 3,
        "org": "Hope Community Shelter"
      },
      "createdAt": "2026-11-25T11:45:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### 3.2 POST /api/listings
Creates a new surplus batch.

**Headers**: `Authorization: Bearer <token>` (Must have role: `donor`)

**Request Body**:
```json
{
  "title": "40 Servings Rice & Dal",
  "meals": 40,
  "pickupAddress": "Hostel 3 Kitchen Dock",
  "notes": "Chilled, ready for bicycle or van transport",
  "expiresInMinutes": 120
}
```

**Success Response `201 Created`**:
Returns the complete created `Listing` resource.

---

### 3.3 POST /api/listings/:id/accept
An NGO reserves a donor listing and supplies the delivery destination.

**Headers**: `Authorization: Bearer <token>` (Must have role: `ngo`)

**Request Body**:
```json
{ "dropoffAddress": "Hope Shelter, 10 Main Street" }
```

Only the first NGO can accept a listing. The accepted NGO and drop-off address are attached to the order.

**Success Response `200 OK`**: Returns the updated listing with `status: "accepted"`, `ngo`, and `dropoffAddress`.

**Errors**:
- `409`: Listing was already accepted or is no longer available.

---

### 3.4 POST /api/listings/:id/claim
Volunteer courier claims an NGO-accepted batch for delivery.

**Headers**: `Authorization: Bearer <token>` (Must have role: `volunteer`)

**Success Response `200 OK`**:
Returns the complete updated `Listing` resource with `status: "claimed"`, `volunteer`, and `claimedAt`. The response includes both pickup and drop-off addresses.

**Errors**:
- `409`: `{ "error": { "code": "NOT_ACCEPTED", "message": "An NGO must accept this listing before a courier can claim it." } }` if not accepted.
- `409`: `ALREADY_CLAIMED` if another volunteer has claimed the accepted listing.

---

### 3.5 POST /api/listings/:id/collect
Volunteer confirms physical pickup from donor kitchen.

**Headers**: `Authorization: Bearer <token>` (Must have role: `volunteer`, must be the claiming volunteer)

**Success Response `200 OK`**:
Returns the updated `Listing` resource with `status: "collected"` and `collectedAt`.

**Errors**:
- `403`: `{ "error": { "code": "NOT_OWNER", "message": "Only the courier who claimed this delivery can mark it collected." } }`
- `409`: `{ "error": { "code": "INVALID_STATE", "message": "Listing must be claimed before it can be collected." } }`

---

### 3.6 POST /api/listings/:id/deliver
The assigned volunteer reports dropping off the food at the NGO address. This does not complete the order; the listing moves to `delivered` while awaiting NGO receipt confirmation.

**Headers**: `Authorization: Bearer <token>` (Must have role: `volunteer`, must be the claiming volunteer)

**Success Response `200 OK`**:
Returns the updated `Listing` resource with `status: "delivered"` and `deliveredAt`.

---

### 3.7 POST /api/listings/:id/confirm-delivery
The NGO assigned during acceptance confirms that the food was received at the drop-off location.

**Headers**: `Authorization: Bearer <token>` (Must have role: `ngo`, must be the assigned NGO)

**Success Response `200 OK`**:
Returns the updated `Listing` resource with `status: "distributed"` and `distributedAt`, preserving the volunteer's `deliveredAt` report timestamp.

**Errors**:
- `403`: Only the NGO assigned to the delivery can confirm receipt.
- `409`: The volunteer has not reported delivery, or receipt was already confirmed.

---

### 3.8 POST /api/listings/:id/cancel
Donor cancels an unclaimed surplus posting.

**Headers**: `Authorization: Bearer <token>` (Must have role: `donor`, must be posting owner)

**Success Response `200 OK`**:
Returns the updated `Listing` resource with `status: "cancelled"`.

**Errors**:
- `409`: `{ "error": { "code": "CANNOT_CANCEL", "message": "Cannot cancel a listing that is already claimed or collected." } }`

---

## 4. Impact & Community Audit Endpoints

### 4.1 GET /api/impact/summary
Live community diversion metrics.

**Success Response `200 OK`**:
```json
{
  "available": 2,
  "claimed": 1,
  "collected": 3,
  "delivered": 2,
  "distributed": 12,
  "activeListings": 3,
  "mealsDiverted": 640,
  "wasteKg": 256.0,
  "co2eKg": 640.0
}
```

---

### 4.2 GET /api/impact/monthly
Monthly diversion trajectory.

**Query Parameters**:
- `donorId` (optional): Filter to single donor organization.

**Success Response `200 OK`**:
```json
{
  "monthly": [
    { "month": "Aug", "meals": 180, "wasteKg": 72.0, "co2eKg": 180.0 },
    { "month": "Sep", "meals": 340, "wasteKg": 136.0, "co2eKg": 340.0 },
    { "month": "Oct", "meals": 520, "wasteKg": 208.0, "co2eKg": 520.0 },
    { "month": "Nov", "meals": 640, "wasteKg": 256.0, "co2eKg": 640.0 }
  ],
  "totalMeals": 640,
  "totalWasteKg": 256.0,
  "totalCo2eKg": 640.0
}
```

---

### 4.3 POST /api/audits/bulk
Bulk upload for physical canteen waste inspection logs. Maintained for `community-audit/audit_sync.py`.

**Headers**: `x-api-key: <AUDIT_API_KEY>`

**Request Body**:
```json
{
  "rows": [
    {
      "audit_date": "2026-11-20",
      "location": "North Campus Canteen",
      "volunteer": "Rohan Gupta",
      "food_type": "Cooked Rice & Lentils",
      "weight_kg": 45.5,
      "meals_served": 110,
      "notes": "Inspected fresh before dispatch"
    }
  ]
}
```

**Success Response `201 Created`**:
```json
{
  "received": 1,
  "inserted": 1,
  "skippedDuplicates": 0
}
```

---

### 4.4 GET /api/audits/summary
Returns physical inspection totals and 8 most recent audits.

---

## 5. System Health & Side Game Endpoints

### 5.1 GET /api/health
Checks database connectivity and server uptime.

**Success Response `200 OK`**:
```json
{
  "status": "ok",
  "uptime": 142.3,
  "database": "connected",
  "version": "0.1.0"
}
```

### 5.2 POST /api/scores & GET /api/scores/leaderboard & GET /api/scores/impact
Side runner game score submissions. Isolated from platform meal totals.

---

## 6. Known Limitations
1. **Unverified NGO Registrations**: Any visitor can register with `role: "ngo"`. Physical verification of NGO certificates (e.g. 12A/80G or Darpan registration) is currently an offline process.
2. **Client-Side JWT Storage**: Tokens are stored in browser `localStorage` and cannot be revoked server-side before their 24h expiration (mitigated by short 24h TTL).
