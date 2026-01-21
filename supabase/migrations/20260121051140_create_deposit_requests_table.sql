/*
  # Create Deposit Requests Table

  1. New Tables
    - `deposit_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `amount` (numeric)
      - `payment_method` (text)
      - `status` (text: pending, approved, rejected)
      - `reference_number` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `processed_at` (timestamptz)
      - `processed_by` (uuid, references profiles)

  2. Security
    - Enable RLS on `deposit_requests` table
    - Users can read and create their own deposit requests
    - Admins can read and update all deposit requests
*/

CREATE TABLE IF NOT EXISTS deposit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL DEFAULT 'bank_transfer',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reference_number text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processed_by uuid REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_created_at ON deposit_requests(created_at DESC);

ALTER TABLE deposit_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own deposit requests"
  ON deposit_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all deposit requests"
  ON deposit_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can create deposit requests"
  ON deposit_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update deposit requests"
  ON deposit_requests FOR UPDATE
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
