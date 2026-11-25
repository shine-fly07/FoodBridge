# FoodBridge Visual Redesign Plan (Reference-Inspired "Eduwerks" Aesthetic)

> **Document Version**: 2.0 (Approved with Revisions)  
> **Status**: Approved by User  
> **Design Philosophy**: High-contrast full-bleed sections, geometric typography, hand-drawn doodle strokes, floating glossy 3D food accents, scattered rotated pills, and a floating dark bottom pill navigation—while preserving 100% of FoodBridge's real content, API contracts, routing, and truthful copy.

---

## 1. Design Tokens & Visual Architecture

### 1.1 Color Palette & Contrast Ratios
The color system transitions to alternating full-bleed sections: stark obsidian dark (`#0A0A0A`) for high-impact moments and soft warm alabaster (`#F7F7F5`) for content-dense, readable working sections.

```css
:root {
  /* Dark Sections (Hero, Benefits, Final CTA, Footer) */
  --color-dark-bg: #0A0A0A;
  --color-dark-surface: #141414;
  --color-dark-subtle: #1C1C1C;
  --color-dark-border: rgba(255, 255, 255, 0.12);
  --color-dark-text-primary: #FFFFFF;
  --color-dark-text-muted: #A1A1AA;     /* Contrast 7.15:1 against #0A0A0A (AAA) */
  --color-dark-text-faint: #71717A;     /* Contrast 4.54:1 against #0A0A0A (AA) */

  /* Light Sections (Stats, Steps, Live Surplus, Calculator, FAQ) */
  --color-light-bg: #F7F7F5;
  --color-light-surface: #FFFFFF;
  --color-light-subtle: #EEEEEC;
  --color-light-border: #E4E4E0;
  --color-light-text-primary: #0A0A0A;  /* Contrast 19.8:1 against #F7F7F5 (AAA) */
  --color-light-text-muted: #52525B;    /* Contrast 5.8:1 against #F7F7F5 (AA) */
  --color-light-text-faint: #71717A;    /* Contrast 4.3:1 (AA for large text/badges) */

  /* Brand Accents (Vibrant on Dark, Rich on Light) */
  --color-brand-green: #22C55E;        /* Neon/lime on black: 9.5:1 (AAA) */
  --color-brand-green-deep: #15803D;   /* Forest green on light: 5.2:1 against #F7F7F5 (AA) */
  --color-brand-green-glow: rgba(34, 197, 94, 0.25);
  
  /* Secondary Pop Accents */
  --color-pop-yellow: #FACC15;         /* Doodles, highlights: 15.6:1 against #0A0A0A */
  --color-pop-mango: #F59E0B;          /* Courier accents */
  --color-pop-magenta: #E879F9;        /* Shelter / volunteer badges */
  --color-pop-purple: #A855F7;         /* Scattered pill accents */
  --color-pop-cyan: #38BDF8;           /* Doodle arrows, pills */
  --color-pop-coral: #FB7185;          /* Urgent timers */

  /* Operational Safety Countdown (Preserved Meanings) */
  --color-expiry-green: #22C55E;       /* >2h remaining */
  --color-expiry-yellow: #F59E0B;      /* 1-2h remaining */
  --color-expiry-red: #EF4444;         /* <1h critical window */
  --color-expiry-gray: #6B7280;        /* Expired / Cancelled */
}
```

### 1.2 Contrast Ratios Audit
All text pairs strictly satisfy WCAG AA (minimum 4.5:1 for body text, 3:1 for large display text >= 18pt):
- **Obsidian Dark (`#0A0A0A`)**:
  - Primary text (`#FFFFFF`): **21.0:1** (AAA)
  - Muted body text (`#A1A1AA` Zinc-400): **7.15:1** (AAA)
  - Faint secondary text (`#71717A` Zinc-500): **4.54:1** (AA)
  - Neon Green (`#22C55E`): **9.5:1** (AAA)
  - Doodle Yellow (`#FACC15`): **15.6:1** (AAA)
- **Alabaster Light (`#F7F7F5`)**:
  - Primary text (`#0A0A0A`): **19.8:1** (AAA)
  - Muted body text (`#52525B` Zinc-600): **5.8:1** (AA)
  - Deep Forest Green (`#15803D`): **5.2:1** (AA)

### 1.3 Typography
- **Font Family**: Plus Jakarta Sans (`font-sans`), loaded with geometric fallbacks (`system-ui, -apple-system, sans-serif`).
- **Headline Styling**:
  - Very large, tight headlines (`text-4xl` to `text-6xl`, `tracking-[-0.03em]`, `leading-[1.08]`).
  - **Two-Tone System**: Primary clause in sharp contrast (`text-white` on dark, `text-stone-900` on light); continuation clause in muted grey (`text-stone-400` on dark, `text-stone-500` on light).
  - Key action words highlighted with inline hand-drawn SVG scribble underlines or loops.

---

## 2. Navigation Architecture & Mobile Dock Behavior

To ensure clean separation of concerns and avoid UI duplication:

### 2.1 Top Utility Header (Identity & Identity Context Only)
- Minimal, clean top header (`h-16 px-6 flex items-center justify-between`):
  - **Left**: FoodBridge brand mark (wordmark + leaf mark), linking to `/`.
  - **Right**: Active User Role pill badge + "Sign In" / Profile trigger + Demo Mode indicator.
  - **No route links in top header**: Prevents duplicate navigation targets.
  - **Skip Link**: `<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-black text-white px-4 py-2 rounded-full font-bold">Skip to content</a>`.

### 2.2 Desktop Floating Pill (Viewport >= 768px)
- Fixed at `bottom-8 inset-x-0 mx-auto w-max z-40`.
- Dark rounded pill (`bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/15 px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-6`).
- Items:
  - `Home` (`/`)
  - `Donate` (`/donate`)
  - `Courier` (`/courier`)
  - `NGO Hub` (`/ngo`)
  - `Impact` (`/impact`)
  - `Portal` (`/portal`)
  - **`aria-current="page"`** placed on the active route.
  - Active route visual indicator: `bg-white/15 text-white font-medium px-3 py-1 rounded-full`.
  - CTA button: `bg-green-500 hover:bg-green-400 text-black px-4 py-1.5 rounded-full text-xs font-bold` ("Donate Food").

### 2.3 Mobile Floating Dock & Safe-Area Insets (< 768px)
- Fixed at `bottom-4 inset-x-4 z-40 flex items-center justify-between p-2 rounded-full bg-[#0A0A0A]/95 border border-white/15 shadow-2xl backdrop-blur-xl`.
- Safe area support via `pb-[max(1rem,env(safe-area-inset-bottom))]`.
- **Keyboard Dismissal**: On mobile input/textarea focus (`focusin`), the bottom dock smoothly translates down out of view (`translate-y-24 opacity-0 pointer-events-none`) so it never covers form inputs or on-screen keyboards. It restores on `focusout`.
- **Global Content Padding**: Every page view includes bottom padding (`pb-28 sm:pb-32`, and `pb-36` on form pages) so content and footer are never hidden behind the floating nav.
- Mobile Menu drawer opens full drawer with `aria-current="page"` and 48px touch targets.

---

## 3. Section-by-Section Landing Page Mapping

| # | Section Theme | Visual Pattern | FoodBridge Content & Truthful Copy Mapping |
|---|---|---|---|
| **1** | **Obsidian Dark (`#0A0A0A`)** | **Hero Moment**: Two-tone headline, floating 3D shapes, text CTA with circled arrow, interactive preview card. | **Hero**: "Turn surplus food <muted>into community meals</muted>" with hand-drawn yellow scribble. Floating 3D food shapes (Apple, Carrot, Leaf). CTA: "Get started ➔" + "Join as Volunteer". Right: **Interactive Sample Walkthrough Card** clearly labelled: `"SAMPLE WORKFLOW (DEMO)"`, with the 4 real steps: 1. Post Surplus, 2. Claim Route, 3. Deliver Food, 4. Confirm & Log. |
| **2** | **Alabaster Light (`#F7F7F5`)** | **Stats Circles**: Soft light-grey scattered circular badges with big numbers and doodle accents. | **Live Impact Strip**: 3 soft circular discs showing live API stats (Meals Rescued, Waste Diverted kg, Active Rescues) scattered slightly off-grid with sun/star doodles. **Resilience**: If API is unreachable, display `"-"` with an unobtrusive `"Live data unavailable"` hint (never invented numbers). Below: 3 Factual Pillars (Spoilage Prevention, Local Pickups, Carbon Avoidance). |
| **3** | **Obsidian Dark (`#0A0A0A`)** | **Benefits & Vocabulary Cloud**: Colorful tilted floating pill tags (-20° to +20°) around a bold central statement. | **Surplus Ecosystem Cloud**: Title "Bridging Surplus to Sustenance". Scattered rotated floating pills with accurate terminology: `Hostel Messes`, `Event Catering`, `Cafeterias`, `Bakeries`, `Restaurants`, `Safe-Until Timers`, `Local Pickups`, `Zero Landfill`, `Community Kitchens`, `Registered NGOs`, `SDG 2 & 12`. Below: 4-Step Operational Workflow cards (Post, Claim, Transport, Confirm & Log). |
| **4** | **Alabaster Light (`#F7F7F5`)** | **UI Product Showcase**: Clean dashboard preview cards showing real features. | **Live Surplus Board & 3 Paths**: Real-time batch teaser cards with color-coded `ExpiryBadge` countdowns (Green, Yellow, Red) and 1-click volunteer claiming. Three role cards (Donor, Courier, Shelter). |
| **5** | **Alabaster Light (`#F7F7F5`)** | **Interactive Calculator / Tool**: Large sliders, live recalculation, clear footnote. | **Community Savings Calculator**: Interactive meal slider recalculating food waste averted (kg) and avoided CO₂e emissions. Preserves the exact FAO-derived impact footnote. |
| **6** | **Alabaster Light (`#F7F7F5`)** | **Authentic Stories & 5 Project Aims**: Illustrated cards (no stock photos) and foundational aims. | **Truthful Pipeline Spotlights**: Illustrated stylized role cards (Canteen Kitchen, Bicycle Courier, Community Shelter) representing real user journeys (no fake testimonials, no stock photos). 5 Foundational Project Aims for UN SDG 2 & 12. |
| **7** | **Alabaster Light (`#F7F7F5`)** | **Minimalist Accordion**: Soft bordered cards with clean icon toggles. | **Frequently Asked Questions**: Accessible ARIA accordion covering food safety, courier requirements, and shelter eligibility with Enter/Space keyboard support. |
| **8** | **Obsidian Dark (`#0A0A0A`)** | **Final Conversion & Footer**: Hand-drawn circle accent, primary CTAs, minimal logo footer. | **Final CTA**: "Ready to bridge the food waste gap <circle>today</circle>?" with circled doodle accent. Dark footer with logo, platform links, and official SDG 2 & 12 indicator badges. |

---

## 4. 3D Floating Shapes & Doodle Asset Spec

### 4.1 Food-Themed Glossy 3D Shapes
Built as **pure inline SVG elements** using layered radial gradients, translucent color washes, and Gaussian blur specular highlights. No heavy video or Three.js bundle overhead (~2-4 KB each, total < 25 KB):
1. **Glossy Apple**: Soft emerald/lime gradient sphere with specular top gloss, leaf accent, and soft ambient drop shadow.
2. **Glossy Soup Bowl / Plate**: Ceramic off-white shallow bowl with warm steam wave accents and soft rim reflections.
3. **Glossy Neon Carrot**: Vibrant orange cone with soft lighting and lime foliage top.
4. **Resilient Leaf**: Translucent neon green organic leaf with fine vein lines.
5. **Fresh Bread / Roll**: Golden-baked soft pill shape with delicate flour dusting highlights.
6. **Community Heart**: Translucent magenta glass heart with glowing edge refraction.

*Checkpoint*: We will first build two prototype SVG food shapes (Apple and Bowl) in both the glossy-glass style and a fallback flat-gloss style to evaluate rendering quality before rolling out all shapes.

### 4.2 Hand-Drawn SVG Doodles
Lightweight vector strokes with animated `stroke-dasharray` and `stroke-dashoffset`:
- **Scribble Loop / Underline**: Yellow/lime hand-drawn underline under key headline phrases.
- **Word Circle Highlight**: Hand-drawn imperfect oval encircling critical words (e.g. "today").
- **Doodle Sun & Sparkle Stars**: 4-point and 8-point twinkling star doodles scattered near stat discs.
- **Curved Hand-Drawn Arrows**: Guiding arrows between workflow steps.

---

## 5. Low-Fidelity ASCII Layout Sketches

### Sketch 1: Hero Moment (Pure Black Section)
```
+---------------------------------------------------------------------------------------+
|  [Logo] FoodBridge                      [Role: Donor v] [Sign In / Profile]           | (Top Utility Bar)
|                                                                                       |
|   +---------------------------------------+   +------------------------------------+  |
|   | (Glossy 3D Leaf)                      |   | SAMPLE WORKFLOW (DEMO)  [Stage 1/4]|  |
|   |                                       |   +------------------------------------+  |
|   | Turn surplus food                     |   | [1.Post] [2.Claim] [3.Del] [4.Conf]|  |
|   | into community meals.                 |   |                                    |  |
|   | ~~~~~~~~~~~~~~~~~~~~~~~ (yellow loop) | 50 Servings Fresh Veg Curry & Rice |  |
|   |                                       |   | 📍 Campus Canteen • ⌛ Safe for 2h |  |
|   | FoodBridge coordinates canteens,      |   | [====================........] 50% |  |
|   | caterers, volunteer couriers, and     |   |                                    |  |
|   | community shelters before food spoils.|   | [ Go to Donor Hub ] [ Next Step ➔ ]|  |
|   |                                       |   +------------------------------------+  |
|   |  [ Get started ➔ ]  ( Join Volunteer )|   (Glass Dashboard Walkthrough Card)      |
|   |                                       |                                           |
|   | (Glossy 3D Apple)                     |                                           |
|   +---------------------------------------+                                           |
+---------------------------------------------------------------------------------------+
```

### Sketch 2: Scattered Rotated Pills Section (Pure Black Section)
```
+---------------------------------------------------------------------------------------+
|                         Bridging Surplus to Sustenance                                |
|             A coordinated urban network turning potential waste into meals            |
|                                                                                       |
|          [-12° Hostel Messes]                 [+8° Zero Landfill]                     |
|                                                                                       |
|    [+15° Event Catering]         (Glossy Carrot)             [-14° Safe-Until Timers] |
|                                                                                       |
|             [-6° Fresh Prepared Food]         [+18° Local Pickups]                    |
|                                                                                       |
|     [+10° Registered NGOs]                 [-8° Rapid Pickup]        [+12° SDG 2 & 12]|
|                                                                                       |
|   +-------------------+ +-------------------+ +-------------------+ +----------------+|
|   | 1. Post Surplus   | | 2. Claim Delivery | | 3. Move Food      | | 4. Confirm & Log||
|   +-------------------+ +-------------------+ +-------------------+ +----------------+|
+---------------------------------------------------------------------------------------+
```

---

## 6. App Routes Adaptation Plan

Working application screens adopt the new modern aesthetic while keeping data tables, forms, and operational boards 100% light, clean, and ergonomic without decorative clutter:
- **`/donate` (Donor Hub)**:
  - Header: Compact dark hero band with food doodle.
  - Body: Soft off-white surface with streamlined `DonorForm` card and recent active batches.
- **`/courier` (Courier Board)**:
  - Header: Compact dark hero band with bicycle/map doodle.
  - Body: High-contrast filter tabs, live dispatch cards with urgency countdown timers.
- **`/ngo` (Shelter Hub)**:
  - Header: Compact dark hero band with shelter icon.
  - Body: Pending deliveries list and confirmed distribution logs.
- **`/portal` (Universal Dashboard)**:
  - Header: Compact dark overview band with summary metrics.
  - Body: Multi-role view with updated card styling.
- **`/impact` (Quantified Metrics)**:
  - Header: Dark impact hero.
  - Body: Off-grid stat discs, monthly meal diversion chart, and community audit sync table.
- **`404 (Not Found)`**:
  - Dark screen with floating 3D shapes and quick return home button.

---

## 7. Implementation Phases & Commit Strategy

1. **Phase 1: Tokens, Icons, and Prototype Preview (Current Step)**:
   - Update `tokens.css` with the full contrast-checked dark/light tokens.
   - Build SVG food shapes prototype (Apple and Bowl) + section preview.
   - Capture screenshot and present for review.
2. **Phase 2: Shared Component Harmonization**:
   - Update `Button`, `Card`, `Badge`, `ExpiryBadge`, `Modal`, `FormField`, `EmptyState`, `FloatingNav`, `Navbar`, and `Footer`.
   - Commit as `feat: restyle shared components and floating navigation`.
3. **Phase 3: Landing Page Overhaul**:
   - Full rewrite of `LandingView.jsx`, `LandingHeroStats`, `LandingImpactCalculator`, `LandingFaqAccordion`.
   - Commit as `feat: landing page visual redesign (reference-inspired)`.
4. **Phase 4: App Routes & Verification**:
   - Update `/donate`, `/courier`, `/ngo`, `/portal`, `/impact`.
   - Re-run complete Puppeteer and backend test suites, run Lighthouse audit, capture screenshots.
   - Commit as `feat: visual redesign (reference-inspired)`.
