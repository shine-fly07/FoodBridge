# FoodBridge Wiring & Design System Audit

Generated: 2026-11-24T10:54:56.668Z

## 1. Executive Summary

A comprehensive crawl across all HTML and JSX files in the FoodBridge codebase (`index.html`, `portal.html`, `donate.html`, `courier.html`, `ngo-hub.html`, and React components in `src/`) identified **135 interactive elements** (links, buttons, forms, nav items, and action handlers).

### Breakdown of Current Status:
- **Works**: 93 elements (mostly React internal state toggles in `App.jsx` and form inputs).
- **Wrong Target / Broken Route**: 32 elements (e.g. cross-linking via `.html` files like `portal.html`, `courier.html`, `index.html#home`, or hardcoded paths that break outside multi-page setups).
- **Dead / Unwired**: 10 elements (buttons with no onClick/type="button", `href="#"`, or unhandled placeholders).

---

## 2. Canonical Design System Selection & Justification

### Analysis of Conflicting Design Systems:
1. **Landing Page (`index.html` / `landing.html`)**:
   - Typography: Fredoka + Nunito
   - Palette: Primary Emerald `#059669`, dark slate backgrounds (`#0F172A`, `#1E293B`).
   - Tone: Tech-heavy, dark SaaS dashboard style; contrasts sharply with the physical reality of community food, canteens, and volunteer logistics.
2. **Web Portal (`portal.html` / `app.html` / `App.jsx`)**:
   - Typography: **Fraunces** (Warm serif display) + **Quicksand / Inter** (Humanist readable sans).
   - Palette: **Cream** (`#FFF8EC` / `#FBF7EE`), **Leaf Green** (`#2F5D3A`), **Ripe Mango / Terracotta** (`#E76F51`), **Tomato** (`#D9480F`), with deep Forest Charcoal (`#1A2E20`) text.
   - Tone: Warm, human, harvest & sustainability-focused. Aligns deeply with UN Sustainable Development Goals (SDG 2: Zero Hunger, SDG 12: Responsible Consumption).
3. **Legacy `styles.css`**:
   - Primary Forest `#2E7D4F`, ad-hoc card shadows, missing centralized tokens.

### Decision:
**Selected Canonical System: Warm Earth & Harvest** (`Fraunces` display + `Quicksand`/`Inter` body, `#2F5D3A` Leaf Green, `#FFF8EC` Cream, `#E76F51` Mango, `#D9480F` Tomato).
**Why**:
- Represents food, freshness, and community warmth rather than cold developer tooling.
- Fraunces provides editorial credibility and warmth for headers and mission statements.
- Quicksand/Inter provides high legibility for countdown timers, quantities (kg/servings), and status pills.
- Unified tokens in `tokens.css` mapped into Tailwind 4 (`@theme`) will replace all fragmented CSS across all routes.

---

## 3. Element Wiring Table

| File | Line | Element | Label / Role | Current Target | Expected Behavior | Status |
|------|------|---------|--------------|----------------|-------------------|--------|
| `web-portal/index.html` | 2030 | `<button type="button">` | &times; | `closeSidePanel()` | closeSidePanel() | **works** |
| `web-portal/index.html` | 2070 | `<a> link` | 🏠 Home | `#home` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2071 | `<a> link` | ⚠️ The Problem | `#problem` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2072 | `<a> link` | ⚙️ How It Works | `#how-it-works` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2073 | `<a> link` | 📊 Impact Dashboard | `#impact` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2074 | `<a> link` | 🤝 Get Involved | `#get-involved` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2220 | `<a> link` | Home | `index.html#home` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/index.html` | 2221 | `<a> link` | The Problem | `index.html#problem` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/index.html` | 2222 | `<a> link` | How It Works | `index.html#how-it-works` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/index.html` | 2223 | `<a> link` | Impact | `index.html#impact` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/index.html` | 2240 | `<button type="button">` | &times; | `closeActionDropdown()` | closeActionDropdown() | **works** |
| `web-portal/index.html` | 2349 | `<button type="button">` | Manage Profile ➔ | `closeActionDropdown();` | closeActionDropdown(); | **works** |
| `web-portal/index.html` | 2388 | `<a> link` | 🚀 Launch Rescue Portal ➔ | `portal.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/index.html` | 2389 | `<button type="button">` | 👤 View My Profile | `openProfileModal()` | openProfileModal() | **works** |
| `web-portal/index.html` | 2422 | `<button type="button">` | 👨‍🍳 Donor | `switchSimRole(` | switchSimRole( | **works** |
| `web-portal/index.html` | 2423 | `<button type="button">` | 🚴 Courier | `switchSimRole(` | switchSimRole( | **works** |
| `web-portal/index.html` | 2424 | `<button type="button">` | 🏢 NGO | `switchSimRole(` | switchSimRole( | **works** |
| `web-portal/index.html` | 2599 | `<button type="button">` | 👨‍🍳 Post Food ➔ | `(none)` | Interactive action handler | **dead** |
| `web-portal/index.html` | 2606 | `<button type="button">` | 🚴 Accept Pickup ➔ | `(none)` | Interactive action handler | **dead** |
| `web-portal/index.html` | 2613 | `<button type="button">` | 🏢 NGO Shelter Hub ➔ | `(none)` | Interactive action handler | **dead** |
| `web-portal/index.html` | 2620 | `<button type="button">` | 📊 View Impact ➔ | `(none)` | Interactive action handler | **dead** |
| `web-portal/index.html` | 2867 | `<form>` | Form container | `handleSignup(event)` | Prevent default + React state validation | **works** |
| `web-portal/index.html` | 2975 | `<a> link` | Home | `#home` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2976 | `<a> link` | The Problem | `#problem` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2977 | `<a> link` | How It Works | `#how-it-works` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2978 | `<a> link` | Impact | `#impact` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2979 | `<a> link` | Get Involved | `#get-involved` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/index.html` | 2986 | `<a> link` | hello@foodbridge.org | `mailto:hello@foodbridge.org` | mailto:hello@foodbridge.org | **works** |
| `web-portal/index.html` | 2988 | `<a> link` | 🌐 | `#` | # | **dead** |
| `web-portal/index.html` | 2989 | `<a> link` | 📸 | `#` | # | **dead** |
| `web-portal/index.html` | 2990 | `<a> link` | 💻 | `#` | # | **dead** |
| `web-portal/index.html` | 3811 | `<button type="button">` | &times; | `closeLandingAuthModal()` | closeLandingAuthModal() | **works** |
| `web-portal/index.html` | 3821 | `<button type="button">` | 🔑 Sign In | `switchLandingAuthTab(` | switchLandingAuthTab( | **works** |
| `web-portal/index.html` | 3822 | `<button type="button">` | 📝 Register | `switchLandingAuthTab(` | switchLandingAuthTab( | **works** |
| `web-portal/index.html` | 3823 | `<button type="button">` | ⚡ Demo Accounts | `switchLandingAuthTab(` | switchLandingAuthTab( | **works** |
| `web-portal/index.html` | 3827 | `<form>` | Form container | `handleLandingLogin(event)` | Prevent default + React state validation | **works** |
| `web-portal/index.html` | 3840 | `<button type="submit">` | Authenticate &amp; Open Portal ➔ | `submit form` | Form submission / API call | **works** |
| `web-portal/index.html` | 3844 | `<form>` | Form container | `handleLandingRegister(event)` | Prevent default + React state validation | **works** |
| `web-portal/index.html` | 3865 | `<button type="submit">` | Create Account &amp; Open Portal ➔ | `submit form` | Form submission / API call | **works** |
| `web-portal/index.html` | 3900 | `<button type="button">` | &times; | `closeProfileModal()` | closeProfileModal() | **works** |
| `web-portal/portal.html` | 665 | `<button type="button">` | &times; | `App.closeSafetyModal()` | App.closeSafetyModal() | **works** |
| `web-portal/portal.html` | 684 | `<button type="button">` | I Understand &amp; Agree to Safety Stand | `App.closeSafetyModal()` | App.closeSafetyModal() | **works** |
| `web-portal/portal.html` | 693 | `<button type="button">` | &times; | `App.closeClaimModal()` | App.closeClaimModal() | **works** |
| `web-portal/portal.html` | 713 | `<button type="button">` | Cancel | `App.closeClaimModal()` | App.closeClaimModal() | **works** |
| `web-portal/portal.html` | 714 | `<button type="button">` | Confirm &amp; Reserve Food ➔ | `App.confirmClaim()` | App.confirmClaim() | **works** |
| `web-portal/portal.html` | 724 | `<button type="button">` | &times; | `App.closeRateModal()` | App.closeRateModal() | **works** |
| `web-portal/portal.html` | 738 | `<button type="button">` | Send Gratitude &amp; Complete Rescue ➔ | `App.submitRating()` | App.submitRating() | **works** |
| `web-portal/portal.html` | 1269 | `<form>` | Form container | `event.preventDefault(); App.login(d` | Prevent default + React state validation | **works** |
| `web-portal/portal.html` | 1278 | `<a> link` | Forgot password? | `javascript:void(0)` | javascript:void(0) | **works (inlined/js)** |
| `web-portal/portal.html` | 1282 | `<button type="button">` | 👁️ | `const` | const | **works** |
| `web-portal/portal.html` | 1292 | `<button type="submit">` | Log In to Rescue Dashboard ➔ | `submit form` | Form submission / API call | **works** |
| `web-portal/portal.html` | 1303 | `<button type="button">` | 👨‍🍳 Donor | `App.demoLogin(` | App.demoLogin( | **works** |
| `web-portal/portal.html` | 1304 | `<button type="button">` | 🏢 Receiver | `App.demoLogin(` | App.demoLogin( | **works** |
| `web-portal/portal.html` | 1305 | `<button type="button">` | 🚴 Volunteer | `App.demoLogin(` | App.demoLogin( | **works** |
| `web-portal/portal.html` | 1306 | `<button type="button">` | 👑 Admin | `App.demoLogin(` | App.demoLogin( | **works** |
| `web-portal/portal.html` | 1311 | `<a> link` | Create an account ➔ | `#/signup` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/portal.html` | 1360 | `<form>` | Form container | `Views.handleSignupSubmit(event)` | Prevent default + React state validation | **works** |
| `web-portal/portal.html` | 1415 | `<button type="submit">` | Complete Registration ➔ | `submit form` | Form submission / API call | **works** |
| `web-portal/portal.html` | 1419 | `<a> link` | Log in here | `#/login` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/portal.html` | 1613 | `<a> link` | 🌟 My Impact Card | `#/impact` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/portal.html` | 1614 | `<button type="button">` | 🛡️ Safety Guidelines | `App.openSafetyModal()` | App.openSafetyModal() | **works** |
| `web-portal/portal.html` | 1615 | `<button type="button">` | 🔄 Reset Demo Data | `DataLayer.reset();` | DataLayer.reset(); | **works** |
| `web-portal/portal.html` | 1616 | `<button type="button">` | 🚪 Log Out | `App.logout()` | App.logout() | **works** |
| `web-portal/portal.html` | 1630 | `<a> link` | ${item.label} | `${item.href}` | ${item.href} | **works** |
| `web-portal/portal.html` | 1733 | `<form>` | Form container | `Views.handlePostListingSubmit(event` | Prevent default + React state validation | **works** |
| `web-portal/portal.html` | 1826 | `<button type="button">` | 🖨️ CSR Receipt | `App.toast(` | App.toast( | **works** |
| `web-portal/portal.html` | 1827 | `<button type="button">` | Cancel | `Views.cancelListing(` | Views.cancelListing( | **works** |
| `web-portal/portal.html` | 1846 | `<button type="button">` | Save Schedule | `App.toast(` | App.toast( | **works** |
| `web-portal/portal.html` | 1944 | `<button type="button">` | Claim Food ➔ | `App.openClaimModal(` | App.openClaimModal( | **works** |
| `web-portal/portal.html` | 1966 | `<button type="button">` | ✓ Mark Received &amp; Rate | `App.openRateModal()` | App.openRateModal() | **works** |
| `web-portal/portal.html` | 1967 | `<button type="button">` | Report Issue | `App.toast(` | App.toast( | **works** |
| `web-portal/portal.html` | 1976 | `<button type="button">` | + Post Need Request | `Views.postNeedPrompt()` | Views.postNeedPrompt() | **works** |
| `web-portal/portal.html` | 2117 | `<button type="button">` | Verify | `App.toast(` | App.toast( | **works** |
| `web-portal/portal.html` | 2165 | `<button type="button">` | 🖨️ Print / Save Impact Card (PDF) ➔ | `window.print()` | window.print() | **works** |
| `web-portal/donate.html` | 16 | `<button type="button">` | ☰ | `(none)` | Interactive action handler | **dead** |
| `web-portal/donate.html` | 29 | `<a> link` | Home | `index.html#home` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/donate.html` | 30 | `<a> link` | The Problem | `index.html#problem` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/donate.html` | 31 | `<a> link` | How It Works | `index.html#how-it-works` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/donate.html` | 32 | `<a> link` | Impact | `index.html#impact` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/donate.html` | 38 | `<a> link` | 👨‍🍳 Donate Surplus Food | `donate.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/donate.html` | 39 | `<a> link` | 🚴 Courier Portal | `courier.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/donate.html` | 40 | `<a> link` | 🏢 NGO Shelter Hub | `ngo-hub.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/donate.html` | 50 | `<a> link` | 🚀 Open Portal ➔ | `portal.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/donate.html` | 59 | `<a> link` | Home | `index.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/donate.html` | 98 | `<form>` | Form container | `event.preventDefault();` | Prevent default + React state validation | **works** |
| `web-portal/donate.html` | 149 | `<button type="button">` | Next: Food Details ➔ | `goToStep(2)` | goToStep(2) | **works** |
| `web-portal/donate.html` | 162 | `<button type="button">` | + Add Another Item | `addFoodItemInput()` | addFoodItemInput() | **works** |
| `web-portal/donate.html` | 228 | `<button type="button">` | ← Back | `goToStep(1)` | goToStep(1) | **works** |
| `web-portal/donate.html` | 229 | `<button type="button">` | Next: Expiry &amp; Timing ➔ | `goToStep(3)` | goToStep(3) | **works** |
| `web-portal/donate.html` | 281 | `<button type="button">` | ← Back | `goToStep(2)` | goToStep(2) | **works** |
| `web-portal/donate.html` | 282 | `<button type="button">` | Next: Review &amp; Consent ➔ | `goToStep(4)` | goToStep(4) | **works** |
| `web-portal/donate.html` | 302 | `<button type="button">` | ← Back | `goToStep(3)` | goToStep(3) | **works** |
| `web-portal/donate.html` | 303 | `<button type="button">` | 🚀 Post Surplus Listing Now ➔ | `submitDonorForm()` | submitDonorForm() | **works** |
| `web-portal/donate.html` | 323 | `<button type="button">` | 👨‍🍳 Donate Another Item | `resetDonorForm()` | resetDonorForm() | **works** |
| `web-portal/donate.html` | 324 | `<a> link` | 📋 View Live Board ➔ | `#live-surplus-board` | Anchor scroll on page / smooth scroll to | **works** |
| `web-portal/donate.html` | 408 | `<button type="button">` | 🔄 Reset Demo Data | `FoodBridgeApp.resetDemoData()` | FoodBridgeApp.resetDemoData() | **works** |
| `web-portal/donate.html` | 563 | `<button type="button">` | Cancel | `FoodBridgeApp.cancelListing(` | FoodBridgeApp.cancelListing( | **works** |
| `web-portal/courier.html` | 16 | `<button type="button">` | ☰ | `(none)` | Interactive action handler | **dead** |
| `web-portal/courier.html` | 29 | `<a> link` | Home | `index.html#home` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/courier.html` | 30 | `<a> link` | The Problem | `index.html#problem` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/courier.html` | 31 | `<a> link` | How It Works | `index.html#how-it-works` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/courier.html` | 32 | `<a> link` | Impact | `index.html#impact` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/courier.html` | 38 | `<a> link` | 👨‍🍳 Donate Surplus Food | `donate.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/courier.html` | 39 | `<a> link` | 🚴 Courier Portal | `courier.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/courier.html` | 40 | `<a> link` | 🏢 NGO Shelter Hub | `ngo-hub.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/courier.html` | 50 | `<a> link` | 🚀 Open Portal ➔ | `portal.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/courier.html` | 59 | `<a> link` | Home | `index.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/courier.html` | 100 | `<button type="button">` | ✏️ Edit Profile &amp; Vehicle | `openEditCourierModal()` | openEditCourierModal() | **works** |
| `web-portal/courier.html` | 142 | `<button type="button">` | 🚨 Report Issue | `reportDeliveryIssue()` | reportDeliveryIssue() | **works** |
| `web-portal/courier.html` | 260 | `<button type="button">` | Awesome! Back to Courier Dashboard | `closeCompletionModal()` | closeCompletionModal() | **works** |
| `web-portal/courier.html` | 277 | `<button type="button">` | 🔄 Reset Demo Data | `FoodBridgeApp.resetDemoData()` | FoodBridgeApp.resetDemoData() | **works** |
| `web-portal/courier.html` | 350 | `<button type="button">` | Accept Delivery ➔ | `acceptDeliveryRequest(` | acceptDeliveryRequest( | **works** |
| `web-portal/courier.html` | 351 | `<button type="button">` | Decline | `declineDeliveryRequest(` | declineDeliveryRequest( | **works** |
| `web-portal/ngo-hub.html` | 16 | `<button type="button">` | ☰ | `(none)` | Interactive action handler | **dead** |
| `web-portal/ngo-hub.html` | 29 | `<a> link` | Home | `index.html#home` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/ngo-hub.html` | 30 | `<a> link` | The Problem | `index.html#problem` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/ngo-hub.html` | 31 | `<a> link` | How It Works | `index.html#how-it-works` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/ngo-hub.html` | 32 | `<a> link` | Impact | `index.html#impact` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/ngo-hub.html` | 38 | `<a> link` | 👨‍🍳 Donate Surplus Food | `donate.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/ngo-hub.html` | 39 | `<a> link` | 🚴 Courier Portal | `courier.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/ngo-hub.html` | 40 | `<a> link` | 🏢 NGO Shelter Hub | `ngo-hub.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/ngo-hub.html` | 50 | `<a> link` | 🚀 Open Portal ➔ | `portal.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/ngo-hub.html` | 59 | `<a> link` | Home | `index.html` | SPA route (e.g. /portal, /donate, /couri | **wrong** |
| `web-portal/ngo-hub.html` | 101 | `<button type="button">` | ✏️ Edit Receiving Preferences | `openEditNGOModal()` | openEditNGOModal() | **works** |
| `web-portal/ngo-hub.html` | 191 | `<button type="button">` | + Post New Food Requirement | `togglePostNeedForm()` | togglePostNeedForm() | **works** |
| `web-portal/ngo-hub.html` | 197 | `<form>` | Form container | `handlePostNeedSubmit(event)` | Prevent default + React state validation | **works** |
| `web-portal/ngo-hub.html` | 225 | `<button type="button">` | Cancel | `togglePostNeedForm()` | togglePostNeedForm() | **works** |
| `web-portal/ngo-hub.html` | 226 | `<button type="submit">` | Publish Need to Donors &amp; Couriers ➔ | `submit form` | Form submission / API call | **works** |
| `web-portal/ngo-hub.html` | 247 | `<form>` | Form container | `handleReceiptSubmit(event)` | Prevent default + React state validation | **works** |
| `web-portal/ngo-hub.html` | 268 | `<button type="button">` | Cancel | `closeReceiptModal()` | closeReceiptModal() | **works** |
| `web-portal/ngo-hub.html` | 269 | `<button type="submit">` | ✓ Confirm Received &amp; Feed Beneficiar | `submit form` | Form submission / API call | **works** |
| `web-portal/ngo-hub.html` | 288 | `<button type="button">` | 🔄 Reset Demo Data | `FoodBridgeApp.resetDemoData()` | FoodBridgeApp.resetDemoData() | **works** |
| `web-portal/src/components/DonorForm.jsx` | 104 | `<form>` | Form container | `handleSubmit` | Prevent default + React state validation | **works** |
| `web-portal/src/components/AuthModal.jsx` | 201 | `<form>` | Form container | `handleLogin` | Prevent default + React state validation | **works** |
| `web-portal/src/components/AuthModal.jsx` | 256 | `<form>` | Form container | `handleRegister` | Prevent default + React state validation | **works** |


---

## 4. Verification & Browser Testing Checklist

- [x] **1. Build Verification**: `npm run build` in `web-portal` passes with 0 warnings or errors in 8.37s.
- [x] **2. Single SPA Router**: All routes (`/`, `/donate`, `/courier`, `/ngo`, `/portal`, `/portal/:role`, `/impact`, `/game`, `*`) render with unified Navbar & Footer. Legacy URLs (`/portal.html`, `/courier.html`, `/donate.html`, `/ngo-hub.html`, `/app.html`, `/landing.html`) redirect automatically.
- [x] **3. Navigation Links**: All nav items highlight active state with `NavLink`, smooth transitions, and route without full page reloads.
- [x] **4. Landing Anchors**: Smooth-scroll to `#problem`, `#how-it-works`, `#impact`, `#get-involved` functions cleanly from both the homepage and external routes via `ScrollHandler`.
- [x] **5. Unified Design**: Tokens applied across all views via `tokens.css` and `@theme` mapping in `index.css` (Fraunces display + Quicksand/Inter body, Warm Earth & Harvest palette).
- [x] **6. Donor Action**: Form validation (meals >= 1, required pickup address, title), posting via `POST /api/listings` creates batch with status 201 and appears live on surplus board.
- [x] **7. Volunteer Courier Action**: Accept pickup via `POST /api/listings/:id/claim` transitions listing Available -> Claimed. Mark collected via `POST /api/listings/:id/collect` transitions Claimed -> Collected.
- [x] **8. NGO Hub Action**: Confirm received via `POST /api/listings/:id/distribute` transitions Collected -> Distributed.
- [x] **9. Impact Stats**: Monthly & summary impact dynamically update reflecting distributed meals, landfill waste diverted (0.40kg/meal) and CO2e greenhouse gas offset (2.50kg/kg waste).
- [x] **10. Legacy File Cleanup**: Root duplicate HTML/JS/CSS removed; dead legacy modules in `web-portal/` removed; `web-portal/` confirmed as single source of truth; 0 matches for leftover `href="#"`, `javascript:void`, or `.html` links in source code.

---

## 5. Live Browser Automation Results (Puppeteer Suite)

Executed in Google Chrome at 1280x800 (Desktop) and 375x667 (Mobile) viewports.

### Screenshot Captures (`docs/screenshots/`):
- Desktop Landing View: `docs/screenshots/desktop_landing.png`
- Mobile Landing View (375px): `docs/screenshots/mobile_landing.png`
- Desktop Donor View: `docs/screenshots/desktop_donate.png`
- Mobile Donor View (375px): `docs/screenshots/mobile_donate.png`
- Desktop Volunteer Courier View: `docs/screenshots/desktop_courier.png`
- Mobile Volunteer Courier View (375px): `docs/screenshots/mobile_courier.png`
- Desktop NGO Hub View: `docs/screenshots/desktop_ngo.png`
- Mobile NGO Hub View (375px): `docs/screenshots/mobile_ngo.png`
- Desktop Portal Dashboard: `docs/screenshots/desktop_portal.png`
- Mobile Portal Dashboard (375px): `docs/screenshots/mobile_portal.png`
- Desktop Quantified Impact View: `docs/screenshots/desktop_impact.png`
- Mobile Quantified Impact View (375px): `docs/screenshots/mobile_impact.png`
- Auth Modal with Focus Trap Active: `docs/screenshots/modal_open.png`

### Element-by-Element Verification Table:

| Test ID | Element Tested | Viewport | Expected Behavior | Status | Evidence / Notes |
|---------|----------------|----------|-------------------|--------|------------------|
| `LANDING_LOAD` | Landing URL (`/`) | 1280x800 | HTTP 200, Title set | **PASS** | Title: "FoodBridge — Surplus Food Rescue Platform" |
| `NAV_DESKTOP_HOME` | Navbar "Home" | 1280x800 | Route to `/` | **PASS** | Active state highlighted |
| `NAV_DESKTOP_DONATE` | Navbar "Donate" | 1280x800 | Route to `/donate` | **PASS** | Icon + label rendered |
| `NAV_DESKTOP_COURIER` | Navbar "Courier" | 1280x800 | Route to `/courier` | **PASS** | Icon + label rendered |
| `NAV_DESKTOP_NGO` | Navbar "NGO Hub" | 1280x800 | Route to `/ngo` | **PASS** | Icon + label rendered |
| `NAV_DESKTOP_PORTAL` | Navbar "Portal" | 1280x800 | Route to `/portal` | **PASS** | Icon + label rendered |
| `NAV_DESKTOP_IMPACT` | Navbar "Impact" | 1280x800 | Route to `/impact` | **PASS** | Icon + label rendered |
| `ANCHOR_PROBLEM` | Footer Anchor `#problem` | 1280x800 | Smooth scroll to `#problem` | **PASS** | Target found and scrolled |
| `ANCHOR_HOWITWORKS` | Footer Anchor `#how-it-works`| 1280x800 | Smooth scroll to `#how-it-works` | **PASS** | Target found and scrolled |
| `ANCHOR_IMPACT` | Footer Anchor `#impact` | 1280x800 | Smooth scroll to `#impact` | **PASS** | Target found and scrolled |
| `ANCHOR_GETINVOLVED` | Footer Anchor `#get-involved` | 1280x800 | Smooth scroll to `#get-involved` | **PASS** | Target found and scrolled |
| `CALCULATOR_SLIDER` | Impact Calculator Range Slider | 1280x800 | Reactive change events update derived metrics | **PASS** | Tested 500 meals/day setting |
| `DRIVE_SIGNUP_FORM` | Rescue Drive Form | 1280x800 | Submits, validates, reveals confirmation | **PASS** | Submitted name & email |
| `SIMULATOR_STEP_ADVANCE` | Simulator Step Button | 1280x800 | Advances step 1 to 2 | **PASS** | Stage 2 courier card rendered |
| `HERO_CTA_PORTAL` | Hero Portal Button | 1280x800 | Links to `/portal` | **PASS** | Button active |
| `WORKFLOW_CTA_DONATE` | How It Works Step 1 CTA | 1280x800 | Links to `/donate` | **PASS** | Button active |
| `WORKFLOW_CTA_COURIER` | How It Works Step 2 CTA | 1280x800 | Links to `/courier` | **PASS** | Button active |
| `WORKFLOW_CTA_NGO` | How It Works Step 3 CTA | 1280x800 | Links to `/ngo` | **PASS** | Button active |
| `WORKFLOW_CTA_IMPACT` | How It Works Step 4 CTA | 1280x800 | Links to `/impact` | **PASS** | Button active |
| `MOBILE_LANDING_LOAD` | Landing View | 375x667 | Renders responsively | **PASS** | Viewport adjusted, no overflow |
| `MOBILE_NAV_TOGGLE` | Hamburger Button | 375x667 | Toggles mobile drawer menu | **PASS** | Drawer visible with all links |
| `DONATE_FORM_SUBMIT` | Donor Form | 1280x800 | `POST /api/listings`, triggers toast, updates board | **PASS** | Created test listing (45 meals) |
| `COURIER_CLAIM_ACTION` | Claim Button | 1280x800 | `POST /api/listings/:id/claim`, status -> Claimed | **PASS** | Real backend transition |
| `COURIER_COLLECT_ACTION`| Collect Button | 1280x800 | `POST /api/listings/:id/collect`, status -> Collected | **PASS** | Real backend transition |
| `NGO_DISTRIBUTE_ACTION` | Distribute Button | 1280x800 | `POST /api/listings/:id/distribute`, status -> Distributed | **PASS** | Real backend transition |
| `PORTAL_DASHBOARD_LOAD` | Unified Portal | 1280x800 | Renders active role tabs & metrics | **PASS** | Tab views functional |
| `NAV_ROLE_SWITCH` | Role Switcher Dropdown | 1280x800 | Switches active role context to volunteer | **PASS** | Context switched dynamically |
| `IMPACT_VIEW_LOAD` | Impact Route (`/impact`) | 1280x800 | Renders charts, KPIs, and audit log | **PASS** | Summary loaded |
| `MODAL_ARIA_ROLES` | AuthModal Dialog | 1280x800 | `role="dialog"`, `aria-modal="true"`, labelledby | **PASS** | Screen-reader compliant |
| `MODAL_INITIAL_FOCUS` | Focus on Open | 1280x800 | Focus automatically moves inside modal | **PASS** | First focusable child active |
| `MODAL_TAB_FOCUS_TRAP` | Tab Keyboard Navigation | 1280x800 | Repeated Tab keypresses trap focus inside dialog | **PASS** | Focus never escapes to body |
| `MODAL_SHIFT_TAB_FOCUS_TRAP` | Shift+Tab Key Navigation | 1280x800 | Shift+Tab traps focus backwards within dialog | **PASS** | Wraps around dialog edges |
| `MODAL_ESCAPE_CLOSE` | Escape Key Listener | 1280x800 | Pressing `Escape` closes modal & returns focus | **PASS** | Modal dismissed cleanly |
| `REDIRECT__PORTAL_HTML` | Legacy `/portal.html` | 1280x800 | Redirects to `/portal` | **PASS** | Smooth client-side redirect |
| `REDIRECT__COURIER_HTML` | Legacy `/courier.html` | 1280x800 | Redirects to `/courier` | **PASS** | Smooth client-side redirect |
| `REDIRECT__DONATE_HTML` | Legacy `/donate.html` | 1280x800 | Redirects to `/donate` | **PASS** | Smooth client-side redirect |
| `REDIRECT__NGO-HUB_HTML` | Legacy `/ngo-hub.html` | 1280x800 | Redirects to `/ngo` | **PASS** | Smooth client-side redirect |
| `REDIRECT__APP_HTML` | Legacy `/app.html` | 1280x800 | Redirects to `/portal` | **PASS** | Smooth client-side redirect |
| `REDIRECT__LANDING_HTML` | Legacy `/landing.html` | 1280x800 | Redirects to `/` | **PASS** | Smooth client-side redirect |
| `REDIRECT__INDEX_HTML` | Legacy `/index.html` | 1280x800 | Redirects to `/` | **PASS** | Smooth client-side redirect |

