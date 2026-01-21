/*
  # Create Transactions Table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text: deposit, withdrawal, profit_credit, balance_adjustment)
      - `amount` (numeric)
      - `status` (text: pending, approved, rejected)
      - `description` (text)
      - `created_at` (timestamptz)
      - `processed_at` (timestamptz)
      - `processed_by` (uuid, references profiles)

  2. Security
    - Enable RLS on `transactions` table
    - Users can read their own transactions
    - Admins can read all transactions
    - Admins can insert/update transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'profit_credit', 'balance_adjustment')),
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processed_by uuid REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update transactions"
  ON transactions FOR UPDATE
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
