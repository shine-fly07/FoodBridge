import { pool } from "../config/db.js";
import { AppError } from "../middleware/errors.js";

export function requireApiKey(req, _res, next) {
  const apiKey = req.get("x-api-key");
  if (!process.env.AUDIT_API_KEY || apiKey !== process.env.AUDIT_API_KEY) {
    return next(new AppError("UNAUTHORIZED_API_KEY", 401, "Missing or invalid x-api-key header."));
  }
  next();
}

function validateRow(r) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(r.audit_date) &&
    r.location && String(r.location).trim() &&
    r.volunteer && String(r.volunteer).trim() &&
    r.food_type && String(r.food_type).trim() &&
    !isNaN(Number(r.weight_kg)) && Number(r.weight_kg) >= 0 &&
    Number.isInteger(Number(r.meals_served)) && Number(r.meals_served) >= 0
  );
}

/**
 * Bulk upload for community physical audits.
 * Uses ON CONFLICT DO NOTHING so duplicate rows are skipped and unique entries committed.
 * Compatible with community-audit/audit_sync.py.
 */
export async function bulkInsertAudits(req, res, next) {
  const rows = req.body?.rows;
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 500) {
    return next(new AppError("VALIDATION_ERROR", 400, "Send between 1 and 500 rows in { rows: [...] }."));
  }

  const badLines = rows.map((r, i) => (validateRow(r) ? null : i + 2)).filter(Boolean);
  if (badLines.length > 0) {
    return next(
      new AppError("INVALID_AUDIT_ROWS", 422, "One or more CSV rows failed schema validation.", {
        csvLines: badLines,
      })
    );
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let inserted = 0;

    for (const r of rows) {
      const result = await client.query(
        `INSERT INTO audits (audit_date, location, volunteer, food_type, weight_kg, meals_served, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (audit_date, location, volunteer, food_type) DO NOTHING`,
        [
          r.audit_date,
          String(r.location).trim().slice(0, 80),
          String(r.volunteer).trim().slice(0, 60),
          String(r.food_type).trim().slice(0, 40),
          Number(r.weight_kg),
          Number(r.meals_served),
          r.notes ? String(r.notes).trim() : null,
        ]
      );
      inserted += result.rowCount || 0;
    }

    await client.query("COMMIT");
    res.json({
      received: rows.length,
      inserted,
      skippedDuplicates: rows.length - inserted,
      totalProcessed: rows.length,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

/**
 * Retrieve verified community physical audit totals and recent inspections.
 */
export async function getAuditSummary(_req, res, next) {
  try {
    const totals = await pool.query(
      `SELECT COALESCE(SUM(meals_served), 0)::int AS verified_meals,
              COALESCE(SUM(weight_kg), 0)::float AS total_kg,
              COUNT(*)::int AS audits
       FROM audits`
    );

    const recent = await pool.query(
      `SELECT audit_date, location, food_type, weight_kg::float, meals_served
       FROM audits
       ORDER BY audit_date DESC, id DESC
       LIMIT 8`
    );

    res.json({
      verified_meals: totals.rows[0]?.verified_meals || 0,
      total_kg: totals.rows[0]?.total_kg || 0,
      audits: totals.rows[0]?.audits || 0,
      recent: recent.rows || [],
    });
  } catch (err) {
    next(err);
  }
}
