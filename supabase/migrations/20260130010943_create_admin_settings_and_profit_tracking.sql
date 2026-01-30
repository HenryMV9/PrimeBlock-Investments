/*
  # Create Admin Settings and Profit Tracking System

  1. New Tables
    - `admin_settings`
      - `id` (uuid, primary key)
      - `setting_key` (text, unique) - Setting identifier
      - `setting_value` (text) - Setting value
      - `updated_at` (timestamptz)
      - `updated_by` (uuid, references profiles)
    
    - `profit_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `amount` (numeric) - Profit increment amount
      - `plan_name` (text) - Investment plan at time of credit
      - `increment_type` (text) - 'automatic' or 'manual'
      - `created_at` (timestamptz)
  
  2. Default Settings
    - auto_profit_enabled: true
    - starter_increment_rate: 1.0
    - smart_increment_rate: 5.0
    - wealth_increment_rate: 15.0
    - elite_increment_rate: 50.0
    - max_daily_profit_cap: 10000
  
  3. Security
    - Enable RLS on both tables
    - Only admins can read/write admin_settings
    - Users can read their own profit_history
    - Admins can read all profit_history
*/

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

-- Create profit_history table
CREATE TABLE IF NOT EXISTS profit_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  plan_name text NOT NULL,
  increment_type text NOT NULL DEFAULT 'automatic',
  created_at timestamptz DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profit_history_user_id ON profit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_profit_history_created_at ON profit_history(created_at DESC);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profit_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_settings
CREATE POLICY "Admins can read all settings"
  ON admin_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert settings"
  ON admin_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update settings"
  ON admin_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for profit_history
CREATE POLICY "Users can view own profit history"
  ON profit_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profit history"
  ON profit_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "System can insert profit history"
  ON profit_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default settings
INSERT INTO admin_settings (setting_key, setting_value)
VALUES 
  ('auto_profit_enabled', 'true'),
  ('starter_increment_rate', '1.0'),
  ('smart_increment_rate', '5.0'),
  ('wealth_increment_rate', '15.0'),
  ('elite_increment_rate', '50.0'),
  ('max_daily_profit_cap', '10000'),
  ('increment_interval_hours', '24')
ON CONFLICT (setting_key) DO NOTHING;

-- Add last_profit_increment column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_profit_increment'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_profit_increment timestamptz;
  END IF;
END $$;

-- Add daily_profit_total column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'daily_profit_total'
  ) THEN
    ALTER TABLE profiles ADD COLUMN daily_profit_total numeric DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add auto_profit_enabled column to profiles (for per-user control)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'auto_profit_enabled'
  ) THEN
    ALTER TABLE profiles ADD COLUMN auto_profit_enabled boolean DEFAULT true NOT NULL;
  END IF;
END $$;