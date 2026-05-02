/*
  # Revoke SELECT from authenticated on Sensitive Tables

  ## Summary
  Removes SELECT privileges from the `authenticated` role on user-facing tables
  to prevent them from appearing in the GraphQL schema while keeping RLS policies
  in place for actual data access control.

  ## Tables Modified
  - public.deposit_requests
  - public.kyc_verifications
  - public.portfolio_performance
  - public.profiles
  - public.profit_history
  - public.transactions
  - public.withdrawal_requests

  ## Important Notes
  These tables will no longer be discoverable in the GraphQL schema for authenticated
  users, but RLS policies remain in effect to control actual row-level access through
  the Supabase client library and REST API.
*/

-- Revoke SELECT from authenticated on all user-facing tables
REVOKE SELECT ON public.deposit_requests FROM authenticated;
REVOKE SELECT ON public.kyc_verifications FROM authenticated;
REVOKE SELECT ON public.portfolio_performance FROM authenticated;
REVOKE SELECT ON public.profiles FROM authenticated;
REVOKE SELECT ON public.transactions FROM authenticated;
REVOKE SELECT ON public.withdrawal_requests FROM authenticated;

-- Handle profit_history if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profit_history') THEN
    REVOKE SELECT ON public.profit_history FROM authenticated;
  END IF;
END $$;
