-- ============================================================
-- Migration 002: Authentication, Integrity Constraints & Enums
-- Upgrades users, listings, and audits for production hardening.
-- ============================================================

-- 1. Upgrade users table with auth credentials
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(120);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Populate safe placeholder emails for existing records
UPDATE users
SET email = 'user_' || id || '@placeholder.foodbridge.local'
WHERE email IS NULL;

-- Populate placeholder password hash ($2a$10$placeholder) requiring password reset for legacy records
UPDATE users
SET password_hash = '$2a$10$e8k8h3y11Z260O40N9f2quYhB7k1B3H6V8I5z3N2o4B7m9v1w2y3z'
WHERE password_hash IS NULL;

UPDATE users
SET updated_at = now()
WHERE updated_at IS NULL;

ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- 2. Clean up any existing duplicate audits before enforcing UNIQUE constraint
DELETE FROM audits a USING audits b
WHERE a.id < b.id
  AND a.audit_date = b.audit_date
  AND a.location = b.location
  AND a.volunteer = b.volunteer
  AND a.food_type = b.food_type;

CREATE UNIQUE INDEX IF NOT EXISTS idx_audits_unique_record
ON audits (audit_date, location, volunteer, food_type);

CREATE INDEX IF NOT EXISTS idx_audits_date ON audits (audit_date DESC);

-- 3. Upgrade listings table constraints & indexes
ALTER TABLE listings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Expand status check constraint to include 'expired' and 'cancelled'
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE listings ADD CONSTRAINT listings_status_check
CHECK (status IN ('available', 'claimed', 'collected', 'distributed', 'cancelled', 'expired'));

-- Ensure expiry is in the future relative to creation
ALTER TABLE listings DROP CONSTRAINT IF EXISTS chk_expiry_future;
ALTER TABLE listings ADD CONSTRAINT chk_expiry_future
CHECK (expires_at > created_at);

-- Additional query indexes
CREATE INDEX IF NOT EXISTS idx_listings_donor_id ON listings (donor_id);
CREATE INDEX IF NOT EXISTS idx_listings_volunteer_id ON listings (volunteer_id);
CREATE INDEX IF NOT EXISTS idx_listings_ngo_id ON listings (ngo_id);
