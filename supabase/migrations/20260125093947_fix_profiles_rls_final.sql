/*
  # Fix Profiles RLS Infinite Recursion - Complete Fix

  ## Problem
  The profiles table RLS policies use auth.uid() directly, causing infinite recursion
  when PostgreSQL re-evaluates auth.uid() for each row.

  ## Solution
  1. Update all policies to use (select auth.uid()) to evaluate auth function once
  2. Update get_is_admin() function to use (select auth.uid()) and proper search_path
  3. Update handle_new_user() function to use proper search_path

  ## Changes
  - Drop and recreate all profiles policies with optimized auth calls
  - Recreate get_is_admin() with proper settings
  - Recreate handle_new_user() with proper settings
*/

-- Drop all existing profiles policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile name" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Recreate get_is_admin() with proper settings
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
  WHERE id = (select auth.uid());
  RETURN COALESCE(admin_status, false);
END;
$$;

-- Recreate handle_new_user with proper settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Recreate update_updated_at with proper settings
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate user policies with (select auth.uid())
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile name"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

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
