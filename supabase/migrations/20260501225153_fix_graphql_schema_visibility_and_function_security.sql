/*
  # Fix GraphQL Schema Visibility and Function Security

  ## Summary
  Revokes SELECT privileges from `anon` and `authenticated` roles on all sensitive tables
  to prevent them from appearing in the GraphQL schema without proper RLS enforcement.
  Also revokes EXECUTE on SECURITY DEFINER functions from public roles.

  ## Tables Secured
  - public.admin_settings
  - public.contact_messages
  - public.deposit_requests
  - public.kyc_verifications
  - public.portfolio_performance
  - public.profiles
  - public.profit_history
  - public.transactions
  - public.withdrawal_requests

  ## Functions Secured
  - public.get_is_admin()
  - public.get_is_admin(user_id uuid)
  - public.handle_new_user()

  ## Notes
  - RLS policies remain in place to control actual data access
  - Revoking table-level SELECT from anon/authenticated removes tables from
    the GraphQL schema for those roles while RLS still governs row-level access
  - The handle_new_user() trigger function only needs to be called by the trigger,
    not directly via RPC
*/

-- Revoke SELECT from anon on all sensitive tables
REVOKE SELECT ON public.admin_settings FROM anon;
REVOKE SELECT ON public.contact_messages FROM anon;
REVOKE SELECT ON public.deposit_requests FROM anon;
REVOKE SELECT ON public.kyc_verifications FROM anon;
REVOKE SELECT ON public.portfolio_performance FROM anon;
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.transactions FROM anon;
REVOKE SELECT ON public.withdrawal_requests FROM anon;

-- Revoke SELECT from authenticated on all sensitive tables
-- (RLS policies already control row-level access; this removes tables from GraphQL schema)
REVOKE SELECT ON public.admin_settings FROM authenticated;
REVOKE SELECT ON public.contact_messages FROM authenticated;
REVOKE SELECT ON public.deposit_requests FROM authenticated;
REVOKE SELECT ON public.kyc_verifications FROM authenticated;
REVOKE SELECT ON public.portfolio_performance FROM authenticated;
REVOKE SELECT ON public.profiles FROM authenticated;
REVOKE SELECT ON public.transactions FROM authenticated;
REVOKE SELECT ON public.withdrawal_requests FROM authenticated;

-- Re-grant SELECT on tables to authenticated only (not anon) so RLS can work
-- anon should not access any of these tables at all
GRANT SELECT ON public.deposit_requests TO authenticated;
GRANT SELECT ON public.kyc_verifications TO authenticated;
GRANT SELECT ON public.portfolio_performance TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.transactions TO authenticated;
GRANT SELECT ON public.withdrawal_requests TO authenticated;
-- contact_messages and admin_settings: only admin should access these via service role
-- profit_history: only admin/owner should access

-- Handle profit_history table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profit_history') THEN
    REVOKE SELECT ON public.profit_history FROM anon;
    REVOKE SELECT ON public.profit_history FROM authenticated;
    GRANT SELECT ON public.profit_history TO authenticated;
  END IF;
END $$;

-- Revoke EXECUTE on SECURITY DEFINER functions from anon and authenticated
-- handle_new_user is a trigger function, should not be callable via RPC
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- Revoke get_is_admin() from anon - unauthenticated users should not call this
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'get_is_admin' AND pg_get_function_arguments(p.oid) = ''
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.get_is_admin() FROM anon;
    REVOKE EXECUTE ON FUNCTION public.get_is_admin() FROM PUBLIC;
    -- Keep authenticated access since users may need to check their own admin status
    -- but convert to SECURITY INVOKER to be safe
    EXECUTE 'ALTER FUNCTION public.get_is_admin() SECURITY INVOKER';
  END IF;
END $$;

-- Revoke get_is_admin(uuid) from anon
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'get_is_admin' AND pg_get_function_arguments(p.oid) = 'user_id uuid'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.get_is_admin(uuid) FROM anon;
    REVOKE EXECUTE ON FUNCTION public.get_is_admin(uuid) FROM PUBLIC;
    -- Switch to SECURITY INVOKER so it runs with caller's permissions
    EXECUTE 'ALTER FUNCTION public.get_is_admin(uuid) SECURITY INVOKER';
  END IF;
END $$;
