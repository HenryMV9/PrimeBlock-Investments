/*
  # Fix Admin RLS Circular Dependency Issue
  
  This migration fixes the circular dependency in admin RLS policies that was
  preventing users from reading their own profiles.
  
  ## Problem
  The previous admin policies query the profiles table within their USING clause,
  creating a circular dependency that prevents all profile reads.
  
  ## Solution
  1. Drop the problematic admin policies
  2. Recreate them using the safe get_is_admin() function
  3. Ensure the function uses SECURITY DEFINER to bypass RLS
  
  ## Changes
  - Drop and recreate "Admins can read all profiles" policy
  - Drop and recreate "Admins can update all profiles" policy
  - Both now use the get_is_admin() function to avoid recursion
*/

-- ============================================================================
-- DROP PROBLEMATIC POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- ============================================================================
-- ENSURE get_is_admin() FUNCTION EXISTS AND IS CORRECT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  admin_status boolean;
BEGIN
  SELECT is_admin INTO admin_status 
  FROM public.profiles 
  WHERE id = (SELECT auth.uid());
  RETURN COALESCE(admin_status, false);
END;
$$;

-- ============================================================================
-- RECREATE ADMIN POLICIES USING SAFE FUNCTION
-- ============================================================================

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (public.get_is_admin() = true);

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (public.get_is_admin() = true)
  WITH CHECK (public.get_is_admin() = true);