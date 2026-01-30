/*
  # Fix Security and Performance Issues
  
  This migration addresses multiple security and performance concerns:
  
  1. **Add Missing Indexes on Foreign Keys**
     - Adds indexes on all foreign key columns that lack covering indexes
     - Tables: admin_settings, deposit_requests, kyc_verifications, transactions, withdrawal_requests
     - Improves query performance for JOIN operations
  
  2. **Optimize RLS Policies for Auth Function Calls**
     - Wraps all auth.uid() and auth.jwt() calls in SELECT subqueries
     - Prevents re-evaluation of auth functions for each row
     - Significantly improves query performance at scale
     - Affected tables: deposit_requests, withdrawal_requests, transactions, portfolio_performance, 
       kyc_verifications, admin_settings, profit_history
  
  3. **Remove Unused Indexes**
     - Drops indexes that are not being used by queries
     - Reduces storage overhead and improves write performance
     - Indexes: idx_profit_history_user_id, idx_profit_history_created_at
  
  4. **Consolidate Multiple Permissive Policies**
     - Combines multiple SELECT policies on profit_history into a single optimized policy
     - Reduces policy evaluation overhead
  
  5. **Fix Overly Permissive RLS Policy**
     - Removes the "System can insert profit history" policy with always-true condition
     - Replaces with properly scoped service role access pattern
*/

-- ============================================================================
-- 1. ADD MISSING INDEXES ON FOREIGN KEYS
-- ============================================================================

-- Index for admin_settings.updated_by
CREATE INDEX IF NOT EXISTS idx_admin_settings_updated_by 
  ON admin_settings(updated_by);

-- Index for deposit_requests.processed_by
CREATE INDEX IF NOT EXISTS idx_deposit_requests_processed_by 
  ON deposit_requests(processed_by);

-- Index for kyc_verifications.reviewed_by
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_reviewed_by 
  ON kyc_verifications(reviewed_by);

-- Index for transactions.processed_by
CREATE INDEX IF NOT EXISTS idx_transactions_processed_by 
  ON transactions(processed_by);

-- Index for withdrawal_requests.processed_by
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_processed_by 
  ON withdrawal_requests(processed_by);

-- ============================================================================
-- 2. OPTIMIZE RLS POLICIES - WRAP AUTH FUNCTIONS IN SELECT SUBQUERIES
-- ============================================================================

-- Fix deposit_requests policies
DROP POLICY IF EXISTS "Users and admins can read deposit requests" ON deposit_requests;
CREATE POLICY "Users and admins can read deposit requests"
  ON deposit_requests
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

-- Fix withdrawal_requests policies
DROP POLICY IF EXISTS "Users and admins can read withdrawal requests" ON withdrawal_requests;
CREATE POLICY "Users and admins can read withdrawal requests"
  ON withdrawal_requests
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

-- Fix transactions policies
DROP POLICY IF EXISTS "Users and admins can read transactions" ON transactions;
CREATE POLICY "Users and admins can read transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

-- Fix portfolio_performance policies
DROP POLICY IF EXISTS "Users and admins can read portfolio performance" ON portfolio_performance;
CREATE POLICY "Users and admins can read portfolio performance"
  ON portfolio_performance
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

-- Fix kyc_verifications policies
DROP POLICY IF EXISTS "Users and admins can view KYC" ON kyc_verifications;
CREATE POLICY "Users and admins can view KYC"
  ON kyc_verifications
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Users and admins can update KYC" ON kyc_verifications;
CREATE POLICY "Users and admins can update KYC"
  ON kyc_verifications
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  )
  WITH CHECK (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

-- Fix admin_settings policies
DROP POLICY IF EXISTS "Admins can read all settings" ON admin_settings;
CREATE POLICY "Admins can read all settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can insert settings" ON admin_settings;
CREATE POLICY "Admins can insert settings"
  ON admin_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update settings" ON admin_settings;
CREATE POLICY "Admins can update settings"
  ON admin_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

-- ============================================================================
-- 3. REMOVE UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_profit_history_user_id;
DROP INDEX IF EXISTS idx_profit_history_created_at;

-- ============================================================================
-- 4. CONSOLIDATE MULTIPLE PERMISSIVE POLICIES ON PROFIT_HISTORY
-- ============================================================================

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Users can view own profit history" ON profit_history;
DROP POLICY IF EXISTS "Admins can view all profit history" ON profit_history;

-- Create single consolidated SELECT policy
CREATE POLICY "Users and admins can view profit history"
  ON profit_history
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) AND is_admin = true
    )
  );

-- ============================================================================
-- 5. FIX OVERLY PERMISSIVE RLS POLICY
-- ============================================================================

-- Remove the policy with always-true condition
DROP POLICY IF EXISTS "System can insert profit history" ON profit_history;

-- Note: For system/background operations that need to insert profit history,
-- use the service role key which bypasses RLS entirely. This is the proper
-- pattern for automated system operations like the auto-increment-profits
-- edge function.