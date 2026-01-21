/*
  # Fix Profiles RLS Infinite Recursion

  1. Problem
    - Admin policies on profiles table were querying the profiles table itself
    - This caused infinite recursion when trying to update or read profiles

  2. Solution
    - Drop the problematic admin policies that cause recursion
    - Create a security definer function to check admin status safely
    - Recreate admin policies using the safe function

  3. Changes
    - Drop existing admin policies on profiles
    - Create get_is_admin() function with SECURITY DEFINER
    - Recreate admin policies using the safe function
*/

DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

CREATE OR REPLACE FUNCTION get_is_admin()
RETURNS boolean AS $$
DECLARE
  admin_status boolean;
BEGIN
  SELECT is_admin INTO admin_status FROM profiles WHERE id = auth.uid();
  RETURN COALESCE(admin_status, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (get_is_admin() = true);

CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (get_is_admin() = true)
  WITH CHECK (get_is_admin() = true);
