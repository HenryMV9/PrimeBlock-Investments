/*
  # Consolidate Multiple Permissive Policies

  ## Problem
  Multiple tables have duplicate permissive policies for the same role and action,
  which can lead to confusion and maintenance issues.

  ## Solution
  Consolidate multiple policies into single policies using OR logic.
  This improves security clarity and reduces policy evaluation overhead.

  ## Changes
  1. Consolidate deposit_requests SELECT policies
  2. Consolidate withdrawal_requests SELECT policies
  3. Consolidate transactions SELECT policies
  4. Consolidate portfolio_performance SELECT policies
  5. Consolidate kyc_verifications SELECT policies
  6. Consolidate kyc_verifications UPDATE policies
*/

-- Consolidate deposit_requests SELECT policies
DROP POLICY IF EXISTS "Admins can read all deposit requests" ON deposit_requests;
DROP POLICY IF EXISTS "Users can read own deposit requests" ON deposit_requests;

CREATE POLICY "Users and admins can read deposit requests"
  ON deposit_requests
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Consolidate withdrawal_requests SELECT policies
DROP POLICY IF EXISTS "Admins can read all withdrawal requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Users can read own withdrawal requests" ON withdrawal_requests;

CREATE POLICY "Users and admins can read withdrawal requests"
  ON withdrawal_requests
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Consolidate transactions SELECT policies
DROP POLICY IF EXISTS "Admins can read all transactions" ON transactions;
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;

CREATE POLICY "Users and admins can read transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Consolidate portfolio_performance SELECT policies
DROP POLICY IF EXISTS "Admins can read all performance" ON portfolio_performance;
DROP POLICY IF EXISTS "Users can read own performance" ON portfolio_performance;

CREATE POLICY "Users and admins can read portfolio performance"
  ON portfolio_performance
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Consolidate kyc_verifications SELECT policies
DROP POLICY IF EXISTS "Admins can view all KYC" ON kyc_verifications;
DROP POLICY IF EXISTS "Users can view own KYC" ON kyc_verifications;

CREATE POLICY "Users and admins can view KYC"
  ON kyc_verifications
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Consolidate kyc_verifications UPDATE policies
DROP POLICY IF EXISTS "Admins can update all KYC" ON kyc_verifications;
DROP POLICY IF EXISTS "Users can update own pending KYC" ON kyc_verifications;

CREATE POLICY "Users and admins can update KYC"
  ON kyc_verifications
  FOR UPDATE
  TO authenticated
  USING (
    (user_id = auth.uid() AND status = 'pending') OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    (user_id = auth.uid() AND status = 'pending') OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
