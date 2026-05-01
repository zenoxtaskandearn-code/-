-- Referral System & Change Password Migration

-- 1. Add referral columns to users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(10) UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);

-- 2. Create app settings table for admin-configurable values
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(60) NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Seed default referral reward amount
INSERT INTO app_settings (setting_key, setting_value)
VALUES ('referral_reward_amount', '"10"')
ON CONFLICT (setting_key) DO NOTHING;
