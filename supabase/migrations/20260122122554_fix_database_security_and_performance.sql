/*
  # Fix Database Security and Performance Issues

  This migration addresses several critical security and performance optimizations:

  ## 1. Missing Indexes on Foreign Keys
  - Add indexes on `processed_by` columns in deposit_requests, transactions, and withdrawal_requests
  - These indexes improve JOIN performance and foreign key constraint checks

  ## 2. RLS Policy Optimization
  - Replace `auth.uid()` with `(select auth.uid())` in all RLS policies
  - This prevents re-evaluation of auth functions for each row, significantly improving query performance at scale
  - Applies to all tables: profiles, transactions, deposit_requests, withdrawal_requests, portfolio_performance

  ## 3. Function Security
  - Add explicit search_path to all functions to prevent search_path injection attacks
  - Ensures functions always reference the correct schema

  ## Important Notes
  - Unused index warnings are expected for new systems with minimal data
  - Multiple permissive policies are intentional for admin/user separation
  - Auth connection strategy and password protection require Supabase dashboard configuration
*/

-- =====================================================
-- 1. ADD MISSING INDEXES ON FOREIGN KEYS
-- =====================================================

-- Index for deposit_requests.processed_by
CREATE INDEX IF NOT EXISTS idx_deposit_requests_processed_by 
ON deposit_requests(processed_by);

-- Index for transactions.processed_by
CREATE INDEX IF NOT EXISTS idx_transactions_processed_by 
ON transactions(processed_by);

-- Index for withdrawal_requests.processed_by
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_processed_by 
ON withdrawal_requests(processed_by);

-- =====================================================
-- 2. OPTIMIZE RLS POLICIES - PROFILES TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile name" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Recreate with optimized auth function calls
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Users can update own profile name"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- =====================================================
-- 3. OPTIMIZE RLS POLICIES - TRANSACTIONS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can read all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON transactions;

CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Admins can read all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- =====================================================
-- 4. OPTIMIZE RLS POLICIES - DEPOSIT_REQUESTS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can read own deposit requests" ON deposit_requests;
DROP POLICY IF EXISTS "Admins can read all deposit requests" ON deposit_requests;
DROP POLICY IF EXISTS "Users can create deposit requests" ON deposit_requests;
DROP POLICY IF EXISTS "Admins can update deposit requests" ON deposit_requests;

CREATE POLICY "Users can read own deposit requests"
  ON deposit_requests FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Admins can read all deposit requests"
  ON deposit_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Users can create deposit requests"
  ON deposit_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can update deposit requests"
  ON deposit_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- =====================================================
-- 5. OPTIMIZE RLS POLICIES - WITHDRAWAL_REQUESTS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can read own withdrawal requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Admins can read all withdrawal requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Users can create withdrawal requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Admins can update withdrawal requests" ON withdrawal_requests;

CREATE POLICY "Users can read own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Admins can read all withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Users can create withdrawal requests"
  ON withdrawal_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can update withdrawal requests"
  ON withdrawal_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- =====================================================
-- 6. OPTIMIZE RLS POLICIES - PORTFOLIO_PERFORMANCE TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can read own performance" ON portfolio_performance;
DROP POLICY IF EXISTS "Admins can read all performance" ON portfolio_performance;
DROP POLICY IF EXISTS "Admins can insert performance" ON portfolio_performance;
DROP POLICY IF EXISTS "Admins can update performance" ON portfolio_performance;
DROP POLICY IF EXISTS "Admins can delete performance" ON portfolio_performance;

CREATE POLICY "Users can read own performance"
  ON portfolio_performance FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Admins can read all performance"
  ON portfolio_performance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert performance"
  ON portfolio_performance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can update performance"
  ON portfolio_performance FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete performance"
  ON portfolio_performance FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- =====================================================
-- 7. FIX FUNCTION SECURITY - SET EXPLICIT SEARCH_PATH
-- =====================================================

-- Recreate handle_new_user function with explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

-- Recreate update_updated_at function with explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- Recreate get_is_admin function with explicit search_path
CREATE OR REPLACE FUNCTION public.get_is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin_user boolean;
BEGIN
  SELECT is_admin INTO is_admin_user
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN COALESCE(is_admin_user, false);
END;
$$;