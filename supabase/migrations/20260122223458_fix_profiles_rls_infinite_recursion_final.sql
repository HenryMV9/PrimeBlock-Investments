/*
  # Fix Profiles RLS Infinite Recursion - Final Fix

  ## Problem
  The admin policies on the profiles table were querying the profiles table itself,
  causing infinite recursion when trying to read or update profiles.

  ## Solution
  1. Drop the problematic admin policies that query profiles from within profiles
  2. Create/update a SECURITY DEFINER function to safely check admin status
  3. Recreate admin policies using the safe function instead of subqueries

  ## Changes
  - Drop recursive admin policies on profiles table
  - Create get_is_admin() function with SECURITY DEFINER (bypasses RLS)
  - Recreate admin policies using get_is_admin() function
*/

-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Create or replace the safe admin check function
-- SECURITY DEFINER means this function runs with the privileges of the owner (bypasses RLS)
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
  WHERE id = auth.uid();
  RETURN COALESCE(admin_status, false);
END;
$$;

-- Recreate admin policies using the safe function
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (public.get_is_admin() = true);

CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (public.get_is_admin() = true)
  WITH CHECK (public.get_is_admin() = true);
