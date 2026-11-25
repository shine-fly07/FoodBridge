ALTER TABLE listings ADD COLUMN IF NOT EXISTS dropoff_address VARCHAR(160);

ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE listings ADD CONSTRAINT listings_status_check
CHECK (status IN ('available', 'accepted', 'claimed', 'collected', 'distributed', 'cancelled', 'expired'));
