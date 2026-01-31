/*
  # Update Payment Methods for Crypto-Only Deposits
  
  This migration updates the deposit system to support the new crypto-only deposit flow.
  
  1. **Schema Changes**
     - Makes reference_number and notes columns nullable in deposit_requests table
     - These fields are no longer required in the new streamlined crypto deposit flow
  
  2. **Data Compatibility**
     - Existing records remain unchanged
     - New deposits can have empty reference_number and notes
  
  3. **Supported Payment Methods**
     - BTC (Bitcoin)
     - ETH (Ethereum)
     - USDT (TRC20)
     - SOLANA (Solana)
  
  Note: The payment_method column remains as TEXT to support the new crypto symbols
  (BTC, ETH, USDT, SOLANA) as well as legacy values for historical records.
*/

-- ============================================================================
-- MAKE OPTIONAL FIELDS NULLABLE
-- ============================================================================

-- Make reference_number nullable since it's no longer required in crypto flow
ALTER TABLE deposit_requests 
  ALTER COLUMN reference_number DROP NOT NULL;

-- Make notes nullable since it's optional
ALTER TABLE deposit_requests 
  ALTER COLUMN notes DROP NOT NULL;

-- Set default empty strings for backwards compatibility
ALTER TABLE deposit_requests 
  ALTER COLUMN reference_number SET DEFAULT '';

ALTER TABLE deposit_requests 
  ALTER COLUMN notes SET DEFAULT '';

-- ============================================================================
-- UPDATE EXISTING RECORDS
-- ============================================================================

-- Ensure all existing NULL values have empty strings
UPDATE deposit_requests 
SET reference_number = '' 
WHERE reference_number IS NULL;

UPDATE deposit_requests 
SET notes = '' 
WHERE notes IS NULL;