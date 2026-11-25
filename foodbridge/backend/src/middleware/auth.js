import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { AppError } from "./errors.js";

const JWT_SECRET = process.env.JWT_SECRET || "foodbridge-super-secret-jwt-dev-key-2026-min32chars";

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      org: user.org,
    },
    JWT_SECRET,
    { expiresIn: "24h" } // 24-hour token expiry as required
  );
}

/**
 * Authenticates requests via Bearer JWT token.
 * Falls back to x-user-id only in test mode if TEST_BYPASS_AUTH is set.
 */
export async function authenticate(req, _res, next) {
  const authHeader = req.get("authorization");
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }

  // Optional test bypass for quick mocking in test runners
  if (!token && process.env.TEST_BYPASS_AUTH === "true") {
    const rawId = req.get("x-user-id") || "1";
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [Number(rawId) || 1]);
    if (rows[0]) {
      req.user = rows[0];
      return next();
    }
  }

  if (!token) {
    return next(new AppError("UNAUTHENTICATED", 401, "Authentication token required. Please sign in."));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query("SELECT id, name, email, role, org, phone FROM users WHERE id = $1", [decoded.id]);
    
    if (!rows || rows.length === 0) {
      return next(new AppError("UNAUTHENTICATED", 401, "User session invalid or user deleted."));
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("TOKEN_EXPIRED", 401, "Your session has expired. Please sign in again."));
    }
    return next(new AppError("INVALID_TOKEN", 401, "Invalid authentication token."));
  }
}

/**
 * Enforces role-based permissions.
 * @param  {...string} roles - Allowed roles (e.g. 'donor', 'volunteer', 'ngo')
 */
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError("UNAUTHENTICATED", 401, "Authentication required."));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "UNAUTHORIZED",
          403,
          `Access restricted. Requires role: ${roles.join(" or ")}. Current role: ${req.user.role}`
        )
      );
    }

    next();
  };
}
