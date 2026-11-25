# FoodBridge Landing Page Redesign Plan

**Document:** `docs/LANDING_PLAN.md`  
**Scope:** Route `/` (`LandingView.jsx` and landing-only components). Other routes, backend API contracts, and shared design tokens remain untouched.  
**Objective:** Transform the FoodBridge landing page into a clear, high-conversion, user-friendly entry point that communicates the value proposition in under 5 seconds and provides immediate 1-click role paths.

---

## 1. Target Audiences & Primary Intent

| Audience | Who They Are | Primary Job To Be Done | Key Objection / Concern | Landing CTA Path |
| :--- | :--- | :--- | :--- | :--- |
| **Food Donors** | Campus canteens, university dining halls, local eateries, catered events | Quickly list excess prepared food before it spoils; ensure liability & safety compliance. | "Is posting complicated? Will someone actually pick it up in time?" | **"Donate Food"** ➔ `/donate` |
| **Student Volunteers / Couriers** | Campus students, eco-clubs, cyclists with flexible between-class time | Claim nearby food rescues, deliver to local shelters, track community service hours/points. | "Do I need a car? Can I do a quick 20-min delivery between classes?" | **"Deliver with Us"** ➔ `/courier` (or Signup modal) |
| **Shelter & NGO Partners** | Community kitchens, homeless shelters, local food pantries | Receive reliable, safe, hot prepared meals to feed families without friction. | "Is the food fresh and safe? When does it arrive?" | **"Request Food"** ➔ `/ngo` |
| **Campus Sustainability Leads** | University administrators, ESG / SDG coordinators | Quantify campus food waste reduction and verified carbon offsets. | "Can we measure and audit our SDG 2 & SDG 12 impact?" | **"View Impact & Audits"** ➔ `/impact` |

---

## 2. Information Architecture & Section Wireframes

### Mobile (375px) Flow
```text
+-------------------------------------------------+
| [Logo] FoodBridge     [Donate] [Join] [= Menu]  | (Sticky Navbar)
+-------------------------------------------------+
| HERO                                            |
| H1: Turn Campus Surplus into Community Meals.   |
| Sub: Connect dining halls with student couriers |
|      and local shelters in real time.           |
|                                                 |
| [ Donate Surplus Food ➔ ] (Primary CTA)         |
| [ Become a Volunteer ]    (Secondary CTA)       |
|                                                 |
| 3 Live Stats Grid (Skeleton / Real Fallback):   |
| [ 1,420+ Meals ] [ 568 kg CO2e ] [ 3 Active ]   |
+-------------------------------------------------+
| ROLE SELECTION ("Who are you?")                 |
| [ 👨‍🍳 Canteens & Donors  ➔ List Surplus ]       |
| [ 🚴 Couriers & Students ➔ Deliver Meals ]      |
| [ 🏢 Shelters & NGOs     ➔ Receive Food ]       |
+-------------------------------------------------+
| HOW IT WORKS (4 Quick Steps)                    |
| (1) Post ➔ (2) Claim ➔ (3) Deliver ➔ (4) Impact |
| ⏱️ Expiry Timer Legend:                        |
| 🟢 Green: 2h+ | 🟡 Yellow: 1-2h | 🔴 Red: <1h   |
+-------------------------------------------------+
| LIVE SURPLUS TEASER                             |
| 3 live available listings with ExpiryBadge      |
| [ Claim as Volunteer ➔ ]  [ View All Listings ] |
+-------------------------------------------------+
| WHY IT MATTERS + COMPACT IMPACT CALCULATOR      |
| 3 Compact Metric Cards:                         |
| - 1/3 Food Wasted | Campus Hunger | Cold Chain  |
| Mini Slider: [==o=======] 250 meals/day         |
| -> Yields 7,500 meals/mo | 3,000 kg waste saved |
+-------------------------------------------------+
| TRUST & SAFETY GUARANTEES                       |
| - Thermal Safe Window Timers                    |
| - Verified Shelter & Courier Identity           |
| - Publicly Auditable Blockchain-Style Log       |
| [ Review Public Safety Audit Trail ➔ ]          |
+-------------------------------------------------+
| FREQUENTLY ASKED QUESTIONS (Accordion)          |
| [v] What food can campus dining donate?         |
| [>] Who delivers the food?                      |
| [>] How do you guarantee hygiene and safety?    |
| [>] Is there any cost for shelters?             |
| [>] How are community points & hours tracked?   |
+-------------------------------------------------+
| FINAL CONVERSION BANNER                         |
| "Ready to Bridge the Hunger Gap on Your Campus?"|
| [ Post Food Today ] [ Join Volunteer Network ]  |
+-------------------------------------------------+
| Unified Footer (Links, SDG 2 & 12, Mailto)      |
+-------------------------------------------------+
```

### Desktop (1280px) Section Breakdown
1. **Sticky Navbar (`Navbar.jsx`)**: Left logo & SDG badges; Center links (Home, Donate, Courier, NGO, Portal, Impact); Right: Live Demo/Live badge, prominent primary CTA `Donate Food` and secondary `Volunteer`.
2. **Hero Section (Split 7 / 5)**:
   - Left: High-impact H1 ("Turn Campus Food Surplus into Community Meals"), tight 2-line subtext, dual conversion buttons (`Donate Food` ➔ `/donate` and `Deliver with Us` ➔ `/courier`), micro-proof ("Zero landfill waste • 100% verified non-profit partners").
   - Right: Interactive 3-step dynamic visual card with live status indicator pill and mini-flow preview.
   - Across full width below hero: 3 live stats pill strip (`Meals Rescued`, `Landfill Waste Avoided`, `Active Surplus Batches`) fetched live from `/api/impact/summary` with skeleton pulse states and offline fallback.
3. **Role Cards ("Choose Your Path")**:
   - 3 clean interactive cards side-by-side:
     - **Donor**: "Have surplus prepared food?" ➔ `Post Food Listing ➔`
     - **Volunteer**: "Have 30 minutes between classes?" ➔ `Accept Rescue Runs ➔`
     - **Shelter/NGO**: "Need nutritious meal deliveries?" ➔ `Register Shelter Hub ➔`
4. **How It Works (Compact 4-Step Pipeline)**:
   - Horizontal progression (1. Post ➔ 2. Claim ➔ 3. Transport ➔ 4. Feed & Audit).
   - Single-line inline safety timer badge explanation: `🟢 Green: >2h safe window | 🟡 Yellow: 1-2h urgent window | 🔴 Red: <1h critical window`.
5. **Live Surplus Board Teaser**:
   - Live query of `GET /api/listings` filtered to `available`. Displays up to 3 cards using `ListingCard` / `ExpiryBadge`.
   - "Claim as Volunteer" directly initiates claim flow; "View All Listings ➔" navigates to `/courier`.
   - Accessible empty state if no active surplus currently needs pickup.
6. **Why It Matters & Compact Interactive Calculator**:
   - Left: 3 concise fact pillars (Campus Waste vs Community Need vs Carbon Impact).
   - Right: Embedded interactive monthly impact calculator slider (drag 20–1000 meals/day to calculate meals diverted and CO2e offset).
7. **Trust, Safety & Verification**:
   - 3 verified trust seals: Temperature/Safe-Until Timers, Verified 501(c)(3) / Registered Non-Profit Network, Tamper-Evident Audit Logs. Link to `/impact`.
8. **Accessible FAQ Accordion**:
   - 5 structured questions with semantic `<button aria-expanded="..." aria-controls="...">` and smooth animated height expansion. Full keyboard navigation support (Enter / Space / Tab).
9. **Final Conversion Banner**:
   - Full-width leaf-green gradient banner with high-contrast dual actions: `Start Donating Today` and `Sign Up as Volunteer`.
10. **Shared Footer (`Footer.jsx`)**: Existing unified footer with smooth-scrolling anchors and route navigation.

---

## 3. Copy Draft (Concise & Conversion-Focused)

### Hero
- **H1**: Turn Campus Food Surplus into Community Meals.
- **Subcopy**: FoodBridge connects university dining halls and campus caterers with student volunteer couriers to deliver hot, untouched meals directly to local shelters within hours.
- **Primary CTA**: Post Surplus Food ➔ (`/donate`)
- **Secondary CTA**: Deliver with Us (`/courier`)
- **Sub-CTA trust badge**: 🌿 Over 1,400 meals rescued across campus kitchens this semester.

### Live Metrics Bar
- **Stat 1**: `{meals_diverted}+` Meals Rescued
- **Stat 2**: `{waste_kg} kg` Waste Diverted (CO₂e Offset)
- **Stat 3**: `{active_listings}` Live Surplus Batches Available Now

### "Choose Your Path" (Role Cards)
1. **For Dining Halls & Canteens**:
   - *Title*: "I Have Surplus Food"
   - *Description*: Prevent waste at the end of every meal service. List verified food trays in under 60 seconds with strict safe-until windows.
   - *Button*: List Surplus Food ➔
2. **For Students & Couriers**:
   - *Title*: "I Can Deliver Between Classes"
   - *Description*: Pick up prepared meal trays on your campus bike or on foot. Deliver to nearby shelters and earn verified community impact hours.
   - *Button*: Claim a Delivery ➔
3. **For Shelters & Food Pantries**:
   - *Title*: "We Need Nutritious Meals"
   - *Description*: Receive verified, hot meal batches delivered directly to your kitchen dock at zero cost to your organization.
   - *Button*: Partner as an NGO ➔

### How It Works
- **Step 1: Post** — Canteens log surplus portions, packaging details, and safety window.
- **Step 2: Claim** — Nearby student couriers receive instant dispatch alerts and reserve the route.
- **Step 3: Deliver** — Meals are picked up in thermal containers and biked to verified shelter kitchens.
- **Step 4: Audit & Impact** — Shelters confirm receipt; carbon offsets and diverted meals are logged to the public impact audit.
- **Safety Timer Guide**: `🟢 Green: >2 Hours Remaining (Safe) • 🟡 Yellow: 1–2 Hours (Urgent) • 🔴 Red: <1 Hour (Critical Dispatch)`

### Live Surplus Teaser
- **Heading**: Live Campus Surplus Ready for Rescue
- **Subtitle**: Active listings posted by dining halls awaiting courier pickup right now.
- **Empty State**: "All clean! No urgent surplus waiting right now. Canteens typically post after lunch (2:00 PM) and dinner (8:30 PM)."

### Why It Matters + Interactive Calculator
- **Heading**: Small Surplus, Massive Community Impact
- **Fact 1**: Up to 35% of cooked dining hall food is discarded daily despite meeting temperature safety standards.
- **Fact 2**: 1 in 3 college students and thousands of nearby families experience recurring food insecurity.
- **Fact 3**: Every 100 kg of food diverted avoids 250 kg of greenhouse gas emissions from local landfills.
- **Calculator Headline**: Calculate Your Campus or Canteen Footprint:
  - Drag daily surplus slider (20 – 1,000 meals/day)
  - Live readout: Monthly Meals Rescued, Landfill Diverted (kg), CO₂e Emissions Prevented (kg).

### Trust & Safety
- **Safe-Window Clock**: Strict countdowns prevent expired distribution. Listings past safe limits are automatically archived.
- **Verified Receiver Network**: Every shelter partner is verified with campus authorities and health compliance checks.
- **Tamper-Evident Logs**: Every meal weight and handoff timestamp is recorded in the platform audit log.

### FAQ Items
1. **Q: What types of surplus food can university canteens donate?**  
   *A:* Prepared, untouched hot dishes (curries, rice, pasta), individually packaged sandwiches, salads, and fresh bakery items held at safe holding temperatures.
2. **Q: Who delivers the meals, and do volunteers need a vehicle?**  
   *A:* Most campus deliveries are completed by student volunteers on foot or bicycle using insulated thermal backpacks. Typical routes are under 1.5 miles.
3. **Q: How does FoodBridge ensure food safety and quality?**  
   *A:* Donors specify preparation time and thermal storage status. Each listing features a strict live expiry timer (green/yellow/red). Listings expire automatically if not claimed within the safety window.
4. **Q: Is there any cost for shelters or non-profits to receive food?**  
   *A:* No. FoodBridge is a community platform; all food distribution to verified shelters and food banks is 100% free of charge.
5. **Q: How can students track their volunteer hours?**  
   *A:* Once a delivery is confirmed by the receiving NGO, the rescue is recorded to your volunteer profile, generating an exportable community service verification log.

### Final Banner
- **Heading**: Ready to Bridge the Campus Hunger Gap?
- **Subcopy**: Join over 480 students, dining managers, and shelter coordinators today.
- **Actions**: `Post Surplus Food` (Primary) | `Sign Up as Volunteer` (Secondary)

---

## 4. Component Inventory (Reused vs New)

### Reused Shared Components (No duplication, strict token adherence)
- `Navbar.jsx`: Shared unified sticky header with active route styling.
- `Footer.jsx`: Shared unified footer with smooth-scrolling anchors.
- `ListingCard.jsx`: For the 3 live surplus teaser cards.
- `ExpiryBadge.jsx`: Real-time countdown timer badge with green/yellow/red color coding.
- `AuthModal.jsx`: Pre-populates selected role when triggered from CTAs.
- `ui/Button.jsx`: Shared button variants (`primary`, `secondary`, `mango`, `ghost`).
- `ui/Card.jsx`: Warm surface containers with standardized shadows and borders.
- `ui/Badge.jsx`: Role, status, and SDG indicators.
- `ui/EmptyState.jsx`: Clean state when 0 active surplus listings exist.
- `ui/Loader.jsx`: Accessible spinner for async stats loading.

### New Landing-Only Components (Colocated in `web-portal/src/views/landing/` or inline in `LandingView.jsx`)
1. `LandingHeroStats.jsx` (or inline section): 3-card live summary strip with animated counters, skeleton shimmer loader on fetch, and offline fallback from `fetchImpactSummary()`.
2. `LandingRoleCards.jsx`: 3 "Who are you?" interactive role selector cards with direct deep-links (`/donate`, `/courier`, `/ngo`).
3. `LandingFaqAccordion.jsx`: Accessible, keyboard-navigable FAQ component with `aria-expanded`, `aria-controls`, and smooth CSS transition.
4. `LandingImpactCalculator.jsx`: Compact slider with responsive 4-stat dynamic grid.

---

## 5. What Is Removed vs What Is Kept

| Existing Section in `LandingView.jsx` | Decision | Rationale |
| :--- | :--- | :--- |
| **785-line monolithic file** | **Refactor & modularize** | Hard to maintain; contains repeated layout styling and heavy code. |
| **Hero 3-step Simulation Card** | **Condense & streamline** | Keep visual interest of the live card, but eliminate redundant multi-paragraph subtext and duplicate action buttons that confuse visitors. |
| **Wall of Text Challenge Cards (4 long text cards)** | **Replace with 3 Scannable Role Cards + 3 Compact Pillars** | Visitors don't read 600 words of background text; role-based cards immediately route them to action. |
| **Redundant 5 Project Aims list** | **Fold into "Why It Matters"** | Academic list format replaced with high-impact, visual proof points. |
| **Standalone Rescue Drive Form** | **Replace with Modal Trigger** | Replaced with direct button that opens `AuthModal` with `tab="register"` and `role="volunteer"` pre-selected, eliminating duplicate registration form logic. |
| **Interactive Impact Calculator** | **Preserve & polish** | Great interactive engagement tool. Kept as a clean, compact component with improved responsive layout. |
| **How It Works 4 Steps** | **Preserve with Countdown Legend** | Keep the 4 steps (Post, Claim, Deliver, Impact) and add the explicit green/yellow/red timer legend requested in the prompt. |
| **Missing FAQ** | **Add Accessible Accordion** | Addresses user objections upfront (safety, logistics, volunteer eligibility). |
| **Missing Live Listings Teaser** | **Add Live Teaser** | Shows real listings from `GET /api/listings` with `ExpiryBadge` so visitors see the system working live. |

---

## 6. Accessibility, UX & Performance Commitments

1. **Accessibility (Target: 95+ Lighthouse Score)**:
   - Single semantic `<h1>` on the page; sequential heading structure (`<h2>` for sections, `<h3>` for cards).
   - Accordion items use `<button>` elements with `aria-expanded="true|false"` and `aria-controls="faq-answer-N"`.
   - All interactive controls have visible focus rings (`focus-visible:ring-2 focus-visible:ring-[var(--color-leaf-green)]`).
   - Minimum tap target size: 44x44px for all mobile touch targets.
   - Contrast ratio: verified AA (minimum 4.5:1 text-to-background using tokens `--color-forest-text`, `--color-leaf-green`, etc.).
   - `prefers-reduced-motion`: disable heavy animations for users requesting reduced motion.
2. **Responsive UX (375px to 1440px)**:
   - Zero horizontal overflow (`overflow-x-hidden`).
   - Short, scannable reading widths (`max-w-2xl`, ~65ch).
   - Consistent 8px token spacing scale.
3. **Performance (Target: 90+ Lighthouse Mobile Score)**:
   - Dynamic data loaded asynchronously without blocking initial paint.
   - Skeleton shimmer placeholders for live stats to prevent Layout Shifts (CLS < 0.1).
   - Lightweight icons from `lucide-react` (only needed SVGs).

---

## 7. Verification & Testing Plan

1. **Puppeteer Test Suite Update**:
   - Update `test_browser_suite.cjs` to test:
     - All 3 role card CTA clicks (`/donate`, `/courier`, `/ngo`).
     - Live listings teaser cards and ExpiryBadges.
     - Live stats loading (both when backend is running and when backend is simulated offline).
     - Full FAQ accordion expansion, collapse, and keyboard activation (Enter / Space).
     - Smooth scroll navigation to anchor sections.
     - Registration modal open with preselected volunteer role.
   - Run tests at **375x667** (Mobile) and **1280x800** (Desktop).
2. **Before / After Screenshots**:
   - Capture `docs/screenshots/landing_before_desktop.png` and `docs/screenshots/landing_before_mobile.png`.
   - Capture `docs/screenshots/landing_redesign_desktop.png` and `docs/screenshots/landing_redesign_mobile.png`.
3. **Route Regression Verification**:
   - Verify `/donate`, `/courier`, `/ngo`, `/portal`, `/impact` remain 100% functional and visually unchanged.
4. **Lighthouse Audit**:
   - Run audit tool and record performance, accessibility, best practices, and SEO scores.
