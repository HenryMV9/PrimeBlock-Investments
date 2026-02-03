/*
  # Fix Admin Profile Access Permissions
  
  This migration adds RLS policies to allow administrators to read and update all user profiles.
  
  ## Changes
  
  1. **New Policies**
     - Add policy allowing admins to read all profiles
     - Add policy allowing admins to update all profiles
  
  2. **Purpose**
     - Enables admins to view all registered users in the admin panel
     - Enables admins to update user balances, deposits, and profits
     - Fixes the deposit approval bug where balance updates were blocked by RLS
  
  ## Security
  - Policies check that the current user is an admin (is_admin = true)
  - Only authenticated users with admin role can access these policies
  - Regular users maintain existing restrictions (can only access their own profile)
*/

-- ============================================================================
-- ADMIN READ ACCESS TO ALL PROFILES
-- ============================================================================

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- ============================================================================
-- ADMIN UPDATE ACCESS TO ALL PROFILES
-- ============================================================================

CREATE POLICY "Admins can update all profiles"
  ON profiles
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