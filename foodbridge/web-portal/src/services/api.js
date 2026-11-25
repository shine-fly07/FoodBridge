/**
 * FoodBridge Unified API Client & Resilient Fallback Service
 * 
 * Communicates with backend endpoints (/api/listings, /api/impact/monthly, /api/users, etc.)
 * adding the required `x-user-id` header for authenticated role context.
 * 
 * Provides an in-memory/localStorage fallback when the backend is unreachable,
 * alerting components via isDemoMode flag.
 */

import { calculateWasteKg, calculateCo2eKg } from "../constants/impact";

let demoModeListeners = new Set();
let isDemoModeActive = false;

export function subscribeDemoMode(callback) {
  demoModeListeners.add(callback);
  callback(isDemoModeActive);
  return () => demoModeListeners.delete(callback);
}

function setDemoMode(active) {
  if (isDemoModeActive !== active) {
    isDemoModeActive = active;
    demoModeListeners.forEach((fn) => fn(active));
  }
}

export function getIsDemoMode() {
  return isDemoModeActive;
}

// Initial Seed Data for local fallback mode
export const SEED_USERS = {
  donor: { id: 1, name: "Campus Canteen Manager", role: "donor", org: "Green Valley Dining Hall" },
  volunteer: { id: 2, name: "Courier Alex", role: "volunteer", org: "Swift Rescue Network" },
  ngo: { id: 3, name: "Hope Community Shelter", role: "ngo", org: "Hope Shelter Kitchen" },
};

export const SEED_LISTINGS = [
  {
    id: 1,
    donor_id: 1,
    donor_name: "Green Valley Dining Hall",
    donor_org: "Campus Canteen",
    title: "50 Servings Fresh Veg Curry & Rice",
    meals: 50,
    pickup_address: "Student Center Gate 3, Central Campus",
    notes: "Packed in sanitized hot containers. Ready for immediate pickup.",
    expires_at: new Date(Date.now() + 140 * 60000).toISOString(), // ~2h 20m (Green)
    safe_until: new Date(Date.now() + 140 * 60000).toISOString(),
    status: "available",
    volunteer_id: null,
    volunteer_name: null,
    ngo_id: null,
    ngo_org: null,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 2,
    donor_id: 1,
    donor_name: "Green Valley Dining Hall",
    donor_org: "Campus Canteen",
    title: "35 Packets Fresh Sandwiches & Fruit",
    meals: 35,
    pickup_address: "Faculty Club Dining, West Wing",
    notes: "Vegetarian and vegan options clearly labeled.",
    expires_at: new Date(Date.now() + 75 * 60000).toISOString(), // ~1h 15m (Yellow)
    safe_until: new Date(Date.now() + 75 * 60000).toISOString(),
    status: "available",
    volunteer_id: null,
    volunteer_name: null,
    ngo_id: null,
    ngo_org: null,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 3,
    donor_id: 1,
    donor_name: "Green Valley Dining Hall",
    donor_org: "Campus Canteen",
    title: "20 Servings Bakery Rolls & Muffins",
    meals: 20,
    pickup_address: "Bakery Hub, North Gate Entrance",
    notes: "Freshly baked this morning.",
    expires_at: new Date(Date.now() + 40 * 60000).toISOString(), // ~40m (Red / Urgent)
    safe_until: new Date(Date.now() + 40 * 60000).toISOString(),
    status: "available",
    volunteer_id: null,
    volunteer_name: null,
    ngo_id: null,
    ngo_org: null,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 4,
    donor_id: 1,
    donor_name: "Green Valley Dining Hall",
    donor_org: "Campus Canteen",
    title: "40 Portions Pasta & Salad Trays",
    meals: 40,
    pickup_address: "Main Kitchen Receiving Dock",
    notes: "Chilled storage. Van pickup required.",
    expires_at: new Date(Date.now() + 90 * 60000).toISOString(),
    safe_until: new Date(Date.now() + 90 * 60000).toISOString(),
    status: "claimed",
    volunteer_id: 2,
    volunteer_name: "Courier Alex",
    ngo_id: null,
    ngo_org: null,
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
    claimed_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 5,
    donor_id: 1,
    donor_name: "Green Valley Dining Hall",
    donor_org: "Campus Canteen",
    title: "60 Servings Steamed Rice & Dal",
    meals: 60,
    pickup_address: "Hostel 4 Canteen Kitchen",
    notes: "Delivered to Hope Shelter.",
    expires_at: new Date(Date.now() - 10 * 60000).toISOString(),
    safe_until: new Date(Date.now() - 10 * 60000).toISOString(),
    status: "distributed",
    volunteer_id: 2,
    volunteer_name: "Courier Alex",
    ngo_id: 3,
    ngo_org: "Hope Community Shelter",
    created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    distributed_at: new Date(Date.now() - 20 * 60000).toISOString(),
  },
];

function getStoredListings() {
  try {
    const raw = localStorage.getItem("fb_mock_listings");
    if (raw) return JSON.parse(raw);
  } catch (_e) {}
  localStorage.setItem("fb_mock_listings", JSON.stringify(SEED_LISTINGS));
  return SEED_LISTINGS;
}

function setStoredListings(listings) {
  try {
    localStorage.setItem("fb_mock_listings", JSON.stringify(listings));
  } catch (_e) {}
}

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (res.ok) {
      setDemoMode(false);
      return true;
    }
    setDemoMode(false);
    return false;
  } catch (_networkErr) {
    setDemoMode(true);
    return false;
  }
}

/**
 * Execute HTTP API requests with fallback to local mock store on connection failure.
 */
export async function apiCall(path, { method = "GET", body, userId } = {}) {
  const currentUserId = userId || localStorage.getItem("fb_user_id") || "1";
  const token = localStorage.getItem("fb_token");

  try {
    const headers = {
      "Content-Type": "application/json",
      "x-user-id": String(currentUserId),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message =
        typeof data.error === "object"
          ? data.error?.message || "Operation failed."
          : data.error || data.message || `Request failed with status ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.code = data.error?.code || data.code;
      err.details = data.error?.details || data.details;
      err.data = data;

      // Handle token expiration or unauthorized sessions
      if (res.status === 401 && (err.code === "TOKEN_EXPIRED" || err.code === "UNAUTHENTICATED")) {
        localStorage.removeItem("fb_token");
        window.dispatchEvent(new CustomEvent("foodbridge:session-expired", { detail: { message } }));
      }

      // Real backend response (4xx/5xx) -> not demo mode
      setDemoMode(false);
      throw err;
    }

    setDemoMode(false);
    return data;
  } catch (err) {
    // If backend returns an explicit HTTP error status (400, 401, 403, 409, 500), rethrow it!
    if (err.status) {
      setDemoMode(false);
      throw err;
    }

    // Only for network error (Failed to fetch, connection refused, offline):
    console.warn(`[FoodBridge API] Backend unreachable at ${path}. Using offline fallback.`);
    setDemoMode(true);
    return handleLocalMockApi(path, method, body, currentUserId);
  }
}

function handleLocalMockApi(path, method, body, userId) {
  let listings = getStoredListings();

  // GET /api/listings
  if (path.startsWith("/api/listings") && method === "GET") {
    const now = Date.now();
    return listings.filter((l) => l.status !== "available" || !l.expires_at || new Date(l.expires_at).getTime() > now);
  }

  // POST /api/listings
  if (path === "/api/listings" && method === "POST") {
    const safeUntilDate = body.safe_until
      ? new Date(body.safe_until)
      : new Date(Date.now() + (Number(body.expiresInMinutes) || 120) * 60000);

    const newListing = {
      id: Date.now(),
      donor_id: Number(userId) || 1,
      donor_name: body.donor_name || "Green Valley Dining Hall",
      donor_org: body.donor_org || "Campus Canteen",
      title: body.title,
      meals: Number(body.meals),
      pickup_address: body.pickup_address || body.pickupAddress,
      notes: body.notes || "",
      expires_at: safeUntilDate.toISOString(),
      safe_until: safeUntilDate.toISOString(),
      status: "available",
      volunteer_id: null,
      volunteer_name: null,
      ngo_id: null,
      ngo_org: null,
      created_at: new Date().toISOString(),
    };
    listings.unshift(newListing);
    setStoredListings(listings);
    return newListing;
  }

  // POST /api/listings/:id/claim
  if (path.match(/\/api\/listings\/\d+\/claim/) && method === "POST") {
    const id = Number(path.split("/")[3]);
    const item = listings.find((l) => l.id === id);
    if (!item) throw new Error("Listing not found");

    if (item.status !== "available") {
      const conflictErr = new Error("This listing has already been claimed by another courier.");
      conflictErr.status = 409;
      throw conflictErr;
    }

    item.status = "claimed";
    item.volunteer_id = Number(userId) || 2;
    item.volunteer_name = "Courier Alex";
    item.claimed_at = new Date().toISOString();
    setStoredListings(listings);
    return item;
  }

  // POST /api/listings/:id/collect
  if (path.match(/\/api\/listings\/\d+\/collect/) && method === "POST") {
    const id = Number(path.split("/")[3]);
    const item = listings.find((l) => l.id === id);
    if (!item) throw new Error("Listing not found");
    item.status = "collected";
    item.collected_at = new Date().toISOString();
    setStoredListings(listings);
    return item;
  }

  // POST /api/listings/:id/distribute
  if (path.match(/\/api\/listings\/\d+\/distribute/) && method === "POST") {
    const id = Number(path.split("/")[3]);
    const item = listings.find((l) => l.id === id);
    if (!item) throw new Error("Listing not found");
    item.status = "distributed";
    item.ngo_id = Number(userId) || 3;
    item.ngo_org = "Hope Community Shelter";
    item.distributed_at = new Date().toISOString();
    setStoredListings(listings);
    return item;
  }

  // POST /api/listings/:id/cancel
  if (path.match(/\/api\/listings\/\d+\/cancel/) && method === "POST") {
    const id = Number(path.split("/")[3]);
    const item = listings.find((l) => l.id === id);
    if (!item) throw new Error("Listing not found");
    item.status = "cancelled";
    setStoredListings(listings);
    return item;
  }

  // POST /api/users/login
  if (path === "/api/users/login" && method === "POST") {
    const roleKey = body?.role || "donor";
    const seed = SEED_USERS[roleKey] || SEED_USERS.donor;
    return {
      id: seed.id,
      name: body?.name || seed.name,
      role: roleKey,
      org: body?.org || seed.org,
    };
  }

  // POST /api/users
  if (path === "/api/users" && method === "POST") {
    return {
      id: Date.now(),
      name: body?.name || "New Member",
      role: body?.role || "donor",
      org: body?.org || "Community Partner",
    };
  }

  // GET /api/users
  if (path === "/api/users" && method === "GET") {
    return Object.values(SEED_USERS);
  }

  // GET /api/impact/monthly or /summary
  if (path.includes("/api/impact")) {
    const now = Date.now();
    const collectedAndDistributed = listings.filter((l) => l.status === "collected" || l.status === "distributed");
    const totalMeals = collectedAndDistributed.reduce((sum, l) => sum + (l.meals || 0), 0);
    const availableCount = listings.filter((l) => l.status === "available" && (!l.expires_at || new Date(l.expires_at).getTime() > now)).length;
    const activeCount = availableCount + listings.filter((l) => l.status === "claimed").length;

    return {
      available: availableCount,
      active_listings: activeCount,
      meals_diverted: totalMeals,
      meals: totalMeals,
      waste_kg: calculateWasteKg(totalMeals),
      co2e_kg: calculateCo2eKg(totalMeals),
      monthly: [
        { month: "Aug", meals: 180, waste_kg: 72 },
        { month: "Sep", meals: 340, waste_kg: 136 },
        { month: "Oct", meals: 520, waste_kg: 208 },
        { month: "Nov", meals: totalMeals || 610, waste_kg: Math.round((totalMeals || 610) * 0.4) },
      ],
    };
  }

  // GET /api/audits/summary
  if (path.includes("/api/audits")) {
    return {
      verified_meals: 450,
      total_kg: 180.0,
      audits: 12,
      recent: [
        { audit_date: "2026-10-04", location: "Central Dining Hall", food_type: "Veg Meals", weight_kg: 40, meals_served: 100 },
        { audit_date: "2026-10-03", location: "West Canteen", food_type: "Sandwiches", weight_kg: 15, meals_served: 37 },
      ],
    };
  }

  return { ok: true };
}

/* -------------------------------------------------------------------------- */
/* High-Level Helper Functions                                                */
/* -------------------------------------------------------------------------- */

export async function fetchListings() {
  return apiCall("/api/listings");
}

export async function createListing(data, user) {
  const mins = Number(data.expiresInMinutes) || (data.safe_until ? Math.max(15, Math.min(1440, Math.floor((new Date(data.safe_until) - Date.now()) / 60000))) : 120);
  const payload = {
    title: data.title,
    meals: Number(data.meals),
    pickupAddress: data.pickupAddress || data.pickup_address,
    notes: data.notes || null,
    expiresInMinutes: mins,
  };
  return apiCall("/api/listings", {
    method: "POST",
    body: payload,
    userId: user?.id || 1,
  });
}

export async function claimListing(id, user) {
  return apiCall(`/api/listings/${id}/claim`, {
    method: "POST",
    userId: user?.id || 2,
  });
}

export async function collectListing(id, user) {
  return apiCall(`/api/listings/${id}/collect`, {
    method: "POST",
    userId: user?.id || 2,
  });
}

export async function distributeListing(id, user) {
  return apiCall(`/api/listings/${id}/distribute`, {
    method: "POST",
    userId: user?.id || 3,
  });
}

export async function cancelListing(id, user) {
  return apiCall(`/api/listings/${id}/cancel`, {
    method: "POST",
    userId: user?.id || 1,
  });
}

export async function loginUser(credentials) {
  return apiCall("/api/users/login", {
    method: "POST",
    body: credentials,
  });
}

export async function registerUser(userData) {
  return apiCall("/api/users", {
    method: "POST",
    body: userData,
  });
}

export async function fetchImpactSummary() {
  return apiCall("/api/impact/summary");
}

export async function fetchMonthlyImpact() {
  return apiCall("/api/impact/monthly");
}

export async function fetchAuditSummary() {
  return apiCall("/api/audits/summary");
}
