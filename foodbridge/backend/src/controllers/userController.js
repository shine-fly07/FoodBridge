import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool } from "../config/db.js";
import { AppError } from "../middleware/errors.js";
import { signToken } from "../middleware/auth.js";

const isProduction = process.env.NODE_ENV === "production";
const isDemoMode = process.env.DEMO_MODE === "true" && !isProduction;

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Invalid email address").max(120),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  role: z.enum(["donor", "volunteer", "ngo"], {
    errorMap: () => ({ message: "Role must be 'donor', 'volunteer', or 'ngo'" }),
  }),
  org: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").optional(),
  password: z.string().min(1, "Password is required").optional(),
  demoRole: z.enum(["donor", "volunteer", "ngo"]).optional(),
}).refine(
  (data) => data.demoRole || (data.email && data.password),
  { message: "Either email and password or demoRole must be provided." }
);

/**
 * Register a new user with hashed password and return 24h JWT.
 */
export async function signupUser(req, res, next) {
  const { name, email, password, role, org, phone } = req.body;

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (existing.rows && existing.rows.length > 0) {
      throw new AppError("EMAIL_EXISTS", 409, "An account with this email address already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, org, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, org, phone, created_at`,
      [name, email.toLowerCase(), passwordHash, role, org || null, phone || null]
    );

    const user = rows[0];
    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        org: user.org,
        phone: user.phone,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Authenticate user with email + password or demoRole in dev mode.
 */
export async function loginUser(req, res, next) {
  const { email, password, demoRole } = req.body;

  try {
    // 1. Dev Demo Quick Login
    if (demoRole) {
      if (!isDemoMode) {
        throw new AppError(
          "DEMO_DISABLED",
          403,
          "Demo role quick-login is disabled in this environment. Please authenticate with email and password."
        );
      }

      const { rows } = await pool.query(
        "SELECT id, name, email, password_hash, role, org, phone FROM users WHERE role = $1 ORDER BY id ASC LIMIT 1",
        [demoRole]
      );

      if (!rows || rows.length === 0) {
        throw new AppError("NOT_FOUND", 404, `No demo user seeded for role: ${demoRole}. Please run db:seed.`);
      }

      const user = rows[0];
      const token = signToken(user);

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          org: user.org,
          phone: user.phone,
        },
      });
    }

    // 2. Standard Email + Password Login
    const { rows } = await pool.query(
      "SELECT id, name, email, password_hash, role, org, phone FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (!rows || rows.length === 0) {
      throw new AppError("INVALID_CREDENTIALS", 401, "Invalid email or password.");
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new AppError("INVALID_CREDENTIALS", 401, "Invalid email or password.");
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        org: user.org,
        phone: user.phone,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieve authenticated user's own profile.
 */
export async function getMe(req, res) {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      org: req.user.org,
      phone: req.user.phone,
    },
  });
}

/**
 * Restricted listing: only returns public organizational partner summaries.
 * Never dumps raw emails or passwords.
 */
export async function getPartners(_req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, role, org FROM users
       WHERE org IS NOT NULL
       ORDER BY id ASC LIMIT 30`
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}
