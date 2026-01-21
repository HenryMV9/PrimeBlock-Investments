/*
  # Create Portfolio Performance Table

  1. New Tables
    - `portfolio_performance`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `date` (date)
      - `portfolio_value` (numeric)
      - `daily_change` (numeric)
      - `daily_change_percent` (numeric)
      - `total_roi` (numeric)
      - `total_roi_percent` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `portfolio_performance` table
    - Users can read their own performance data
    - Admins can read and manage all performance data

  3. Notes
    - All values are simulated/managed by admin
    - No real trading calculations
*/

CREATE TABLE IF NOT EXISTS portfolio_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  portfolio_value numeric NOT NULL DEFAULT 0,
  daily_change numeric NOT NULL DEFAULT 0,
  daily_change_percent numeric NOT NULL DEFAULT 0,
  total_roi numeric NOT NULL DEFAULT 0,
  total_roi_percent numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_performance_user_id ON portfolio_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_performance_date ON portfolio_performance(date DESC);

ALTER TABLE portfolio_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own performance"
  ON portfolio_performance FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all performance"
  ON portfolio_performance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert performance"
  ON portfolio_performance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update performance"
  ON portfolio_performance FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete performance"
  ON portfolio_performance FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
