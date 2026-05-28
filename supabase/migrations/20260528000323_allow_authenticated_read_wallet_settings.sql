/*
  # Allow Authenticated Users to Read Wallet Address Settings

  ## Summary
  Adds a targeted RLS SELECT policy on admin_settings that allows authenticated
  users to read only the wallet address entries (keys starting with 'wallet_').
  All other admin settings remain hidden from regular users.
*/

CREATE POLICY "Authenticated users can read wallet address settings"
  ON public.admin_settings
  FOR SELECT
  TO authenticated
  USING (setting_key LIKE 'wallet_%');
