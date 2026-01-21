/*
  # Create Withdrawal Requests Table

  1. New Tables
    - `withdrawal_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `amount` (numeric)
      - `withdrawal_method` (text)
      - `account_details` (text)
      - `status` (text: pending, approved, rejected)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `processed_at` (timestamptz)
      - `processed_by` (uuid, references profiles)

  2. Security
    - Enable RLS on `withdrawal_requests` table
    - Users can read and create their own withdrawal requests
    - Admins can read and update all withdrawal requests
*/

CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  withdrawal_method text NOT NULL DEFAULT 'bank_transfer',
  account_details text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processed_by uuid REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_created_at ON withdrawal_requests(created_at DESC);

ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can create withdrawal requests"
  ON withdrawal_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update withdrawal requests"
  ON withdrawal_requests FOR UPDATE
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
