/*
  # Revoke All Unnecessary Privileges from anon Role

  ## Summary
  The anon role had full table privileges (DELETE, INSERT, UPDATE, TRIGGER, TRUNCATE, REFERENCES)
  on all sensitive tables. Since RLS policies control actual access, these table-level
  grants are unnecessary and represent a security risk. This migration revokes all
  privileges from anon on sensitive tables, and removes non-SELECT privileges from
  authenticated on admin-only tables.

  ## Changes
  - Revoke ALL privileges from anon on all sensitive tables
  - Revoke excessive privileges (DELETE, INSERT, UPDATE, etc.) from anon
  - Keep only necessary privileges for authenticated users governed by RLS
*/

-- Revoke ALL privileges from anon on all sensitive tables
REVOKE ALL PRIVILEGES ON public.admin_settings FROM anon;
REVOKE ALL PRIVILEGES ON public.contact_messages FROM anon;
REVOKE ALL PRIVILEGES ON public.deposit_requests FROM anon;
REVOKE ALL PRIVILEGES ON public.kyc_verifications FROM anon;
REVOKE ALL PRIVILEGES ON public.portfolio_performance FROM anon;
REVOKE ALL PRIVILEGES ON public.profiles FROM anon;
REVOKE ALL PRIVILEGES ON public.transactions FROM anon;
REVOKE ALL PRIVILEGES ON public.withdrawal_requests FROM anon;

-- Revoke ALL privileges from authenticated on admin-only tables
-- These should only be accessible via service role key
REVOKE ALL PRIVILEGES ON public.admin_settings FROM authenticated;
REVOKE ALL PRIVILEGES ON public.contact_messages FROM authenticated;

-- Remove excessive privileges from authenticated on user-facing tables
-- Keep only what's needed: SELECT, INSERT, UPDATE (no DELETE, TRUNCATE, TRIGGER, REFERENCES)
REVOKE DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.deposit_requests FROM authenticated;
REVOKE DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.kyc_verifications FROM authenticated;
REVOKE DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.portfolio_performance FROM authenticated;
REVOKE DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.profiles FROM authenticated;
REVOKE DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.transactions FROM authenticated;
REVOKE DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.withdrawal_requests FROM authenticated;

-- Handle profit_history if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profit_history') THEN
    REVOKE ALL PRIVILEGES ON public.profit_history FROM anon;
    REVOKE DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.profit_history FROM authenticated;
  END IF;
END $$;
