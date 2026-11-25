ALTER TABLE listings ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE listings ADD CONSTRAINT listings_status_check
CHECK (status IN ('available', 'accepted', 'claimed', 'collected', 'delivered', 'distributed', 'cancelled', 'expired'));
