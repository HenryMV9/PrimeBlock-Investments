/*
  # Fix KYC Table Security and Performance Issues

  1. Changes
    - Add index on reviewed_by foreign key for better query performance
    - Update RLS policies to use (select auth.uid()) for better performance
    - Set immutable search_path on functions

  2. Security
    - Optimize RLS policies to prevent re-evaluation per row
*/

-- Add index for reviewed_by foreign key
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_reviewed_by ON kyc_verifications(reviewed_by);

-- Drop existing KYC policies and recreate with optimized auth calls
DROP POLICY IF EXISTS "Users can view own KYC" ON kyc_verifications;
DROP POLICY IF EXISTS "Users can insert own KYC" ON kyc_verifications;
DROP POLICY IF EXISTS "Users can update own pending KYC" ON kyc_verifications;
DROP POLICY IF EXISTS "Admins can view all KYC" ON kyc_verifications;
DROP POLICY IF EXISTS "Admins can update all KYC" ON kyc_verifications;

-- Recreate policies with (select auth.uid()) for better performance
CREATE POLICY "Users can view own KYC"
  ON kyc_verifications
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own KYC"
  ON kyc_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own pending KYC"
  ON kyc_verifications
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id AND status = 'under_review')
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view all KYC"
  ON kyc_verifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
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
      WHERE profiles.id = (select auth.uid())
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.is_admin = true
    )
  );

-- Fix function search paths by recreating with security definer and set search_path
CREATE OR REPLACE FUNCTION generate_transaction_id(prefix text)
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN prefix || '-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$;

CREATE OR REPLACE FUNCTION set_deposit_transaction_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.transaction_id IS NULL THEN
    NEW.transaction_id := generate_transaction_id('DEP');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION set_withdrawal_transaction_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.transaction_id IS NULL THEN
    NEW.transaction_id := generate_transaction_id('WTH');
  END IF;
  RETURN NEW;
END;
$$;
