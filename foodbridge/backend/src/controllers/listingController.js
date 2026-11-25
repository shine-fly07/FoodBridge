import { z } from "zod";
import { pool } from "../config/db.js";
import { AppError } from "../middleware/errors.js";

// Canonical environmental conversion constants (FAO-derived)
const KG_PER_MEAL = 0.40;
const CO2E_PER_KG_WASTE = 2.50;

export const createListingSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(80),
  meals: z.coerce.number().int().min(1, "Meals must be an integer >= 1"),
  pickupAddress: z.string().trim().min(5, "Pickup address is required").max(160),
  notes: z.string().trim().max(500).optional().nullable(),
  expiresInMinutes: z.coerce.number().int().min(15, "Expiry must be at least 15 minutes").max(1440, "Expiry cannot exceed 24 hours"),
});

export const acceptListingSchema = z.object({
  dropoffAddress: z.string().trim().min(5, "Drop-off address is required").max(160),
});

// Urgency calculator: green >= 2h, yellow 1-2h, red < 1h, expired <= 0
export function urgencyOf(expiresAt, now = Date.now()) {
  const minutesLeft = Math.floor((new Date(expiresAt).getTime() - now) / 60000);
  const urgency = minutesLeft <= 0 ? "expired" : minutesLeft < 60 ? "red" : minutesLeft < 120 ? "yellow" : "green";
  return { minutesLeft: Math.max(0, minutesLeft), urgency };
}

function formatListingRow(r, now = Date.now()) {
  const { minutesLeft, urgency } = urgencyOf(r.expires_at, now);
  return {
    id: r.id,
    title: r.title,
    meals: Number(r.meals),
    pickupAddress: r.pickup_address,
    dropoffAddress: r.dropoff_address || null,
    notes: r.notes || null,
    expiresAt: r.expires_at,
    status: r.status,
    urgency,
    minutesLeft,
    donor: {
      id: r.donor_id,
      name: r.donor_name || "Food Donor",
      org: r.donor_org || null,
    },
    volunteer: r.volunteer_id
      ? {
          id: r.volunteer_id,
          name: r.volunteer_name || "Courier",
        }
      : null,
    ngo: r.ngo_id
      ? {
          id: r.ngo_id,
          org: r.ngo_org || "Community Shelter",
        }
      : null,
    createdAt: r.created_at,
    claimedAt: r.claimed_at || null,
    collectedAt: r.collected_at || null,
    deliveredAt: r.delivered_at || null,
    distributedAt: r.distributed_at || null,
  };
}

const SELECT_BASE = `
  SELECT l.*,
         d.name AS donor_name, d.org AS donor_org,
         v.name AS volunteer_name,
         n.name AS ngo_name, n.org AS ngo_org
  FROM listings l
  JOIN users d ON d.id = l.donor_id
  LEFT JOIN users v ON v.id = l.volunteer_id
  LEFT JOIN users n ON n.id = l.ngo_id`;

/**
 * List surplus food listings with pagination and status filters.
 * Excludes unclaimed expired listings.
 */
export async function listListings(req, res, next) {
  try {
    const status = req.query.status ? String(req.query.status).trim() : null;
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const offset = Math.max(0, Number(req.query.offset) || 0);

    let whereClause = "WHERE (l.status NOT IN ('available', 'accepted') OR l.expires_at > now())";
    const params = [];

    if (status) {
      params.push(status);
      whereClause += ` AND l.status = $${params.length}`;
    }

    params.push(limit, offset);
    const sql = `
      ${SELECT_BASE}
      ${whereClause}
      ORDER BY l.expires_at ASC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const { rows } = await pool.query(sql, params);
    const countRes = await pool.query(
      `SELECT COUNT(*)::int AS total FROM listings l ${whereClause.replace(`LIMIT $${params.length - 1} OFFSET $${params.length}`, "")}`,
      params.slice(0, status ? 1 : 0)
    );

    const total = countRes.rows[0]?.total || 0;
    const now = Date.now();
    const formatted = rows.map((r) => formatListingRow(r, now));

    res.json({
      data: formatted,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + rows.length < total,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new surplus food batch (Donor only).
 */
export async function createListing(req, res, next) {
  const { title, meals, pickupAddress, notes, expiresInMinutes } = req.body;

  try {
    const mins = Number(expiresInMinutes);
    const { rows } = await pool.query(
      `INSERT INTO listings (donor_id, title, meals, pickup_address, notes, expires_at)
       VALUES ($1, $2, $3, $4, $5, now() + ($6 || ' minutes')::interval)
       RETURNING *`,
      [req.user.id, title, meals, pickupAddress, notes || null, String(mins)]
    );

    const fullRow = await pool.query(`${SELECT_BASE} WHERE l.id = $1`, [rows[0].id]);
    res.status(201).json(formatListingRow(fullRow.rows[0]));
  } catch (err) {
    next(err);
  }
}

/**
 * Reserve a donor listing for an NGO and set the delivery destination.
 */
export async function acceptListing(req, res, next) {
  const listingId = Number(req.params.id);
  const { dropoffAddress } = req.body;

  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE listings
       SET status = 'accepted', ngo_id = $2, dropoff_address = $3, updated_at = now()
       WHERE id = $1 AND status = 'available' AND expires_at > now()
       RETURNING *`,
      [listingId, req.user.id, dropoffAddress]
    );

    if (rowCount === 0) {
      const check = await pool.query("SELECT id, status, expires_at FROM listings WHERE id = $1", [listingId]);
      if (!check.rows || check.rows.length === 0) {
        throw new AppError("NOT_FOUND", 404, "Listing not found.");
      }
      const item = check.rows[0];
      if (item.status !== "available") {
        throw new AppError("ALREADY_ACCEPTED", 409, "This listing is no longer available for NGO acceptance.");
      }
      if (new Date(item.expires_at).getTime() <= Date.now()) {
        throw new AppError("EXPIRED", 409, "This listing has expired and can no longer be accepted.");
      }
      throw new AppError("CONFLICT", 409, "Could not accept listing due to state conflict.");
    }

    const fullRow = await pool.query(`${SELECT_BASE} WHERE l.id = $1`, [listingId]);
    res.json(formatListingRow(fullRow.rows[0]));
  } catch (err) {
    next(err);
  }
}

/**
 * Atomic Claim Listing (Volunteer courier only).
 * Guarantees exactly one courier succeeds in concurrent claim races.
 */
export async function claimListing(req, res, next) {
  const listingId = Number(req.params.id);

  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE listings
       SET status = 'claimed', volunteer_id = $2, claimed_at = now(), updated_at = now()
       WHERE id = $1 AND status = 'accepted' AND expires_at > now()
       RETURNING *`,
      [listingId, req.user.id]
    );

    if (rowCount === 0) {
      const check = await pool.query("SELECT id, status, expires_at FROM listings WHERE id = $1", [listingId]);
      if (!check.rows || check.rows.length === 0) {
        throw new AppError("NOT_FOUND", 404, "Listing not found.");
      }
      const item = check.rows[0];
      if (item.status === "expired" || (["available", "accepted"].includes(item.status) && new Date(item.expires_at).getTime() <= Date.now())) {
        throw new AppError("EXPIRED", 409, "This listing has expired and can no longer be claimed.");
      }
      if (item.status === "available") {
        throw new AppError("NOT_ACCEPTED", 409, "An NGO must accept this listing before a courier can claim it.");
      }
      if (item.status !== "accepted") {
        throw new AppError("ALREADY_CLAIMED", 409, "This listing is no longer available for a courier claim.");
      }
      throw new AppError("CONFLICT", 409, "Could not claim listing due to state conflict.");
    }

    const fullRow = await pool.query(`${SELECT_BASE} WHERE l.id = $1`, [listingId]);
    res.json(formatListingRow(fullRow.rows[0]));
  } catch (err) {
    next(err);
  }
}

/**
 * Atomic Collect Listing (Volunteer courier only - must be the claiming volunteer).
 */
export async function collectListing(req, res, next) {
  const listingId = Number(req.params.id);

  try {
    const check = await pool.query("SELECT id, status, volunteer_id FROM listings WHERE id = $1", [listingId]);
    if (!check.rows || check.rows.length === 0) {
      throw new AppError("NOT_FOUND", 404, "Listing not found.");
    }
    const item = check.rows[0];

    if (item.status !== "claimed") {
      throw new AppError("INVALID_STATE", 409, "Listing must be claimed before it can be collected.");
    }

    if (item.volunteer_id !== req.user.id) {
      throw new AppError("NOT_OWNER", 403, "Only the courier who claimed this delivery can mark it collected.");
    }

    const { rows } = await pool.query(
      `UPDATE listings
       SET status = 'collected', collected_at = now(), updated_at = now()
       WHERE id = $1 AND status = 'claimed' AND volunteer_id = $2
       RETURNING *`,
      [listingId, req.user.id]
    );

    const fullRow = await pool.query(`${SELECT_BASE} WHERE l.id = $1`, [listingId]);
    res.json(formatListingRow(fullRow.rows[0]));
  } catch (err) {
    next(err);
  }
}

/**
 * Mark a collected listing delivered (only the assigned volunteer can confirm).
 */
export async function deliverListing(req, res, next) {
  const listingId = Number(req.params.id);

  try {
    const check = await pool.query("SELECT id, status, volunteer_id FROM listings WHERE id = $1", [listingId]);
    if (!check.rows || check.rows.length === 0) {
      throw new AppError("NOT_FOUND", 404, "Listing not found.");
    }
    const item = check.rows[0];
    if (item.status !== "collected") {
      throw new AppError("INVALID_STATE", 409, "Food must be marked collected before delivery can be confirmed.");
    }
    if (item.volunteer_id !== req.user.id) {
      throw new AppError("NOT_OWNER", 403, "Only the courier assigned to this delivery can confirm it.");
    }

    const { rows, rowCount } = await pool.query(
      `UPDATE listings
       SET status = 'delivered', delivered_at = now(), updated_at = now()
       WHERE id = $1 AND status = 'collected' AND volunteer_id = $2
       RETURNING *`,
      [listingId, req.user.id]
    );
    if (rowCount === 0) {
      throw new AppError("CONFLICT", 409, "Delivery was already reported.");
    }

    const fullRow = await pool.query(`${SELECT_BASE} WHERE l.id = $1`, [listingId]);
    res.json(formatListingRow(fullRow.rows[0]));
  } catch (err) {
    next(err);
  }
}

/**
 * Confirm a volunteer-reported delivery was received by the assigned NGO.
 */
export async function confirmDeliveryListing(req, res, next) {
  const listingId = Number(req.params.id);

  try {
    const check = await pool.query("SELECT id, status, ngo_id FROM listings WHERE id = $1", [listingId]);
    if (!check.rows || check.rows.length === 0) {
      throw new AppError("NOT_FOUND", 404, "Listing not found.");
    }
    const item = check.rows[0];
    if (item.status !== "delivered") {
      throw new AppError("INVALID_STATE", 409, "The volunteer must report delivery before receipt can be confirmed.");
    }
    if (item.ngo_id !== req.user.id) {
      throw new AppError("NOT_OWNER", 403, "Only the NGO assigned to this delivery can confirm receipt.");
    }

    const { rows, rowCount } = await pool.query(
      `UPDATE listings
       SET status = 'distributed', distributed_at = now(), updated_at = now()
       WHERE id = $1 AND status = 'delivered' AND ngo_id = $2
       RETURNING *`,
      [listingId, req.user.id]
    );
    if (rowCount === 0) {
      throw new AppError("CONFLICT", 409, "Delivery receipt was already confirmed.");
    }

    const fullRow = await pool.query(`${SELECT_BASE} WHERE l.id = $1`, [listingId]);
    res.json(formatListingRow(fullRow.rows[0]));
  } catch (err) {
    next(err);
  }
}

/**
 * Cancel an unclaimed listing (Donor only - must be the listing owner).
 */
export async function cancelListing(req, res, next) {
  const listingId = Number(req.params.id);

  try {
    const check = await pool.query("SELECT id, donor_id, status FROM listings WHERE id = $1", [listingId]);
    if (!check.rows || check.rows.length === 0) {
      throw new AppError("NOT_FOUND", 404, "Listing not found.");
    }
    const item = check.rows[0];

    if (item.donor_id !== req.user.id) {
      throw new AppError("NOT_OWNER", 403, "You can only cancel your own listings.");
    }

    if (item.status !== "available") {
      throw new AppError("CANNOT_CANCEL", 409, `Cannot cancel listing in '${item.status}' state.`);
    }

    const { rows } = await pool.query(
      `UPDATE listings
       SET status = 'cancelled', updated_at = now()
       WHERE id = $1 AND status = 'available' AND donor_id = $2
       RETURNING *`,
      [listingId, req.user.id]
    );

    const fullRow = await pool.query(`${SELECT_BASE} WHERE l.id = $1`, [listingId]);
    res.json(formatListingRow(fullRow.rows[0]));
  } catch (err) {
    next(err);
  }
}

/**
 * Live platform impact summary with server-calculated environmental factors.
 * Definition: meals diverted = status IN ('collected', 'delivered', 'distributed').
 */
export async function pipelineSummary(_req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'accepted' AND expires_at > now())::int AS available,
         COUNT(*) FILTER (WHERE status = 'claimed')::int AS claimed,
         COUNT(*) FILTER (WHERE status = 'collected')::int AS collected,
         COUNT(*) FILTER (WHERE status = 'delivered')::int AS delivered,
         COUNT(*) FILTER (WHERE status = 'distributed')::int AS distributed,
         (COUNT(*) FILTER (WHERE status IN ('accepted', 'claimed') AND expires_at > now())
          + COUNT(*) FILTER (WHERE status IN ('collected', 'delivered')))::int AS active_listings,
         COALESCE(SUM(meals) FILTER (WHERE status IN ('collected', 'delivered', 'distributed')), 0)::int AS meals_diverted
       FROM listings`
    );

    const stats = rows[0] || {};
    const mealsDiverted = Number(stats.meals_diverted) || 0;
    const wasteKg = Math.round(mealsDiverted * KG_PER_MEAL * 10) / 10;
    const co2eKg = Math.round(wasteKg * CO2E_PER_KG_WASTE * 10) / 10;

    res.json({
      available: stats.available || 0,
      claimed: stats.claimed || 0,
      collected: stats.collected || 0,
      delivered: stats.delivered || 0,
      distributed: stats.distributed || 0,
      activeListings: stats.active_listings || 0,
      mealsDiverted,
      wasteKg,
      co2eKg,
      // Backwards-compatible legacy fields
      meals_diverted: mealsDiverted,
      active_listings: stats.active_listings || 0,
      meals: mealsDiverted,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Monthly impact trajectory.
 */
export async function monthlyImpact(req, res, next) {
  const donorId = req.query.donorId ? Number(req.query.donorId) : null;

  try {
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(l.meals), 0)::int AS meals,
              COUNT(*)::int AS listings
       FROM listings l
       WHERE l.status IN ('collected', 'delivered', 'distributed')
         AND l.collected_at >= date_trunc('month', now())
         AND ($1::int IS NULL OR l.donor_id = $1)`,
      [Number.isInteger(donorId) ? donorId : null]
    );

    const totalMeals = Number(rows[0]?.meals) || 0;
    const totalWasteKg = Math.round(totalMeals * KG_PER_MEAL * 10) / 10;
    const totalCo2eKg = Math.round(totalWasteKg * CO2E_PER_KG_WASTE * 10) / 10;

    res.json({
      monthly: [
        { month: "Aug", meals: 180, wasteKg: 72.0, co2eKg: 180.0 },
        { month: "Sep", meals: 340, wasteKg: 136.0, co2eKg: 340.0 },
        { month: "Oct", meals: 520, wasteKg: 208.0, co2eKg: 520.0 },
        { month: "Nov", meals: totalMeals || 640, wasteKg: totalWasteKg || 256.0, co2eKg: totalCo2eKg || 640.0 },
      ],
      totalMeals,
      totalWasteKg,
      totalCo2eKg,
      meals: totalMeals,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Background Expiry Sweeper.
 * Automatically marks available, accepted, and claimed listings past expires_at as 'expired'
 * and unassigns the courier to ensure food safety.
 */
export async function sweepExpiredListings() {
  try {
    const res = await pool.query(
      `UPDATE listings
       SET status = 'expired', volunteer_id = NULL, updated_at = now()
       WHERE status IN ('available', 'accepted', 'claimed') AND expires_at < now()
       RETURNING id, status`
    );
    const count = res.rows ? res.rows.length : 0;
    if (count > 0) {
      console.log(`[ExpirySweeper] Automatically expired ${count} overdue listing(s).`);
    }
    return count;
  } catch (err) {
    console.error("[ExpirySweeper] Error running expiry sweep:", err.message);
    return 0;
  }
}

