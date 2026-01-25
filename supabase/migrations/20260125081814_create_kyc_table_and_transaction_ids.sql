/*
  # Add KYC Verification and Transaction IDs

  1. New Tables
    - `kyc_verifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `full_name` (text)
      - `id_type` (text) - national_id, passport, drivers_license
      - `id_number` (text)
      - `id_image_url` (text, nullable)
      - `status` (text) - not_submitted, under_review, verified, rejected
      - `submitted_at` (timestamptz)
      - `reviewed_at` (timestamptz, nullable)
      - `reviewed_by` (uuid, nullable)
      - `rejection_reason` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Table Modifications
    - Add `transaction_id` column to `deposit_requests` for unique tracking
    - Add `transaction_id` column to `withdrawal_requests` for unique tracking

  3. Security
    - Enable RLS on `kyc_verifications` table
    - Add policies for users to read/insert their own KYC data
    - Add policies for admins to manage all KYC data
*/

-- Create KYC verifications table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  id_type text NOT NULL CHECK (id_type IN ('national_id', 'passport', 'drivers_license')),
  id_number text NOT NULL,
  id_image_url text,
  status text NOT NULL DEFAULT 'under_review' CHECK (status IN ('not_submitted', 'under_review', 'verified', 'rejected')),
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Add transaction_id to deposit_requests if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deposit_requests' AND column_name = 'transaction_id'
  ) THEN
    ALTER TABLE deposit_requests ADD COLUMN transaction_id text UNIQUE;
  END IF;
END $$;

-- Add transaction_id to withdrawal_requests if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'withdrawal_requests' AND column_name = 'transaction_id'
  ) THEN
    ALTER TABLE withdrawal_requests ADD COLUMN transaction_id text UNIQUE;
  END IF;
END $$;

-- Create function to generate transaction IDs
CREATE OR REPLACE FUNCTION generate_transaction_id(prefix text)
RETURNS text AS $$
BEGIN
  RETURN prefix || '-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for deposit transaction IDs
CREATE OR REPLACE FUNCTION set_deposit_transaction_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_id IS NULL THEN
    NEW.transaction_id := generate_transaction_id('DEP');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for withdrawal transaction IDs
CREATE OR REPLACE FUNCTION set_withdrawal_transaction_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_id IS NULL THEN
    NEW.transaction_id := generate_transaction_id('WTH');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist and recreate
DROP TRIGGER IF EXISTS set_deposit_transaction_id_trigger ON deposit_requests;
CREATE TRIGGER set_deposit_transaction_id_trigger
  BEFORE INSERT ON deposit_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_deposit_transaction_id();

DROP TRIGGER IF EXISTS set_withdrawal_transaction_id_trigger ON withdrawal_requests;
CREATE TRIGGER set_withdrawal_transaction_id_trigger
  BEFORE INSERT ON withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_withdrawal_transaction_id();

-- Update existing records without transaction IDs
UPDATE deposit_requests 
SET transaction_id = generate_transaction_id('DEP')
WHERE transaction_id IS NULL;

UPDATE withdrawal_requests 
SET transaction_id = generate_transaction_id('WTH')
WHERE transaction_id IS NULL;

-- Enable RLS on kyc_verifications
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;

-- KYC policies for users
CREATE POLICY "Users can view own KYC"
  ON kyc_verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own KYC"
  ON kyc_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending KYC"
  ON kyc_verifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'under_review')
  WITH CHECK (auth.uid() = user_id);

-- KYC policies for admins (using subquery to avoid recursion)
CREATE POLICY "Admins can view all KYC"
  ON kyc_verifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update all KYC"
  ON kyc_verifications
  FOR UPDATE
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user_id ON kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_status ON kyc_verifications(status);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_transaction_id ON deposit_requests(transaction_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_transaction_id ON withdrawal_requests(transaction_id);
