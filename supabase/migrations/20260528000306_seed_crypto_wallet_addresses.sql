/*
  # Seed Crypto Wallet Addresses into admin_settings

  ## Summary
  Inserts the four crypto wallet addresses (BTC, ETH, USDT TRC20, SOL) into the
  admin_settings table as key-value pairs so they can be managed dynamically
  without code deployments.

  ## Settings Added
  - wallet_btc: Bitcoin wallet address
  - wallet_eth: Ethereum wallet address
  - wallet_usdt: USDT TRC20 wallet address
  - wallet_sol: Solana wallet address
*/

INSERT INTO public.admin_settings (id, setting_key, setting_value, updated_at)
VALUES
  (gen_random_uuid(), 'wallet_btc',  'bc1qznu7cmr8kjz4emanwsa0cta7uhma27ej68zmuw', now()),
  (gen_random_uuid(), 'wallet_eth',  '0xB63627E9aC9FFC3fe36bEDc13025C5572953bA8D', now()),
  (gen_random_uuid(), 'wallet_usdt', 'TP3kdbtf6oez6Wgqe6ftdw1PUmEiypyV5Z', now()),
  (gen_random_uuid(), 'wallet_sol',  'DXEn4ymMHC9CFKUPiB7XzHkFu3d6KELFwuQTJ2fvK5wo', now())
ON CONFLICT (setting_key) DO UPDATE
  SET setting_value = EXCLUDED.setting_value,
      updated_at    = now();
