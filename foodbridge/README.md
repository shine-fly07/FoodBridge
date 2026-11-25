# FoodBridge: Surplus Food to Nearby People

**SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption & Production)**

Restaurants, college canteens, hostels, and catered events often have safe, edible surplus while communities nearby need food. FoodBridge connects them in real time through an integrated React SPA before food safety countdowns lapse.

---

## Unified Rescue Pipeline

```
Donor Posts Surplus (e.g. 50 meals) ➔ Volunteer Courier Claims ➔ Courier Collects at Dock ➔ Shelter Hub Distributes
[ Available ]                    ➔ [ Claimed ]             ➔ [ Collected ]             ➔ [ Distributed ]
```

* **Live Expiry Countdown**:
  * 🟢 **2+ hours remaining**: Standard safe window.
  * 🟡 **1 to 2 hours remaining**: Urgent pickup window.
  * 🔴 **Under 1 hour remaining**: Critical window (priority dispatch).
  * Expired unclaimed listings automatically clear from the board.

* **Quantified Community Impact**:
  * Live tracking of verified meals diverted, organic food waste averted (`0.40 kg/meal`), and equivalent greenhouse gas emissions avoided (`2.50 kg CO2e/kg waste`).

---

## Role Pathways

| Role | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Mission, problem statement, live workflow simulator, four action pathways, and impact preview |
| **Donor / Canteen** | `/donate` | Post surplus food listings with portions, pickup dock address, and safe expiry window |
| **Volunteer Courier** | `/courier` | View urgent campus listings, claim pickups, and mark food collected |
| **NGO Shelter Hub** | `/ngo` | View incoming deliveries, confirm receipt, and log distributed portions |
| **Unified Portal** | `/portal`, `/portal/:role` | Multi-role command center with search, status filters, and live stats |
| **Impact & Audits** | `/impact` | Monthly progress trajectory, carbon calculations, and verified physical audit ledger |
| **Side Game** | `/game` | Launch 2D Food Rescue Runner (Phaser mini-game on port 5173) |

---

## Quick Start

### 1. Install Dependencies
```bash
# In project root:
npm --prefix backend install
npm --prefix web-portal install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Start Development Servers
```bash
# Run both Backend API (:4000) and Web Portal (:5174):
npm run dev:all

# Or run separately:
npm run dev:backend   # Express API listening on :4000
npm run dev:portal    # Vite React SPA on http://localhost:5174
```

### 4. Build for Production
```bash
npm run build         # Builds web-portal to dist/ with Vite
```

---

## Architecture & Technology Stack

* **Frontend**: `web-portal/` — Vite 5 + React 19 + Tailwind 4 + Lucide React + React Router v7. Single SPA entry at `web-portal/index.html`.
* **Design System**: Warm Earth & Harvest palette (Cream `#FFF8EC`, Leaf Green `#2F5D3A`, Mango `#F2B33D`, Tomato `#E8643C`) with `Fraunces` display serif and `Quicksand` / `Inter` body sans.
* **Backend**: `backend/` — Node.js Express REST API on `:4000` with PostgreSQL connection and graceful memory-store fallback when local database is offline.
* **Authentication**: Simulated role context via `x-user-id` header (`1` for donor, `2` for volunteer, `3` for ngo).
