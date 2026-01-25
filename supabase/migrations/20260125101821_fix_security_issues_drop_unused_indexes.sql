/*
  # Fix Security Issues - Drop Unused Indexes

  ## Changes
  1. Drop unused indexes that are not being utilized by queries
     - These indexes consume storage and slow down write operations
     - Removing them improves performance without affecting query speed
  
  ## Indexes Removed
  From deposit_requests:
    - idx_deposit_requests_status
    - idx_deposit_requests_created_at
    - idx_deposit_requests_processed_by
    - idx_deposit_requests_transaction_id
  
  From withdrawal_requests:
    - idx_withdrawal_requests_status
    - idx_withdrawal_requests_created_at
    - idx_withdrawal_requests_processed_by
    - idx_withdrawal_requests_transaction_id
  
  From transactions:
    - idx_transactions_status
    - idx_transactions_created_at
    - idx_transactions_processed_by
  
  From portfolio_performance:
    - idx_portfolio_performance_user_id
    - idx_portfolio_performance_date
  
  From kyc_verifications:
    - idx_kyc_verifications_reviewed_by
    - idx_kyc_verifications_status
*/

-- Drop unused indexes from deposit_requests
DROP INDEX IF EXISTS idx_deposit_requests_status;
DROP INDEX IF EXISTS idx_deposit_requests_created_at;
DROP INDEX IF EXISTS idx_deposit_requests_processed_by;
DROP INDEX IF EXISTS idx_deposit_requests_transaction_id;

-- Drop unused indexes from withdrawal_requests
DROP INDEX IF EXISTS idx_withdrawal_requests_status;
DROP INDEX IF EXISTS idx_withdrawal_requests_created_at;
DROP INDEX IF EXISTS idx_withdrawal_requests_processed_by;
DROP INDEX IF EXISTS idx_withdrawal_requests_transaction_id;

-- Drop unused indexes from transactions
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_created_at;
DROP INDEX IF EXISTS idx_transactions_processed_by;

-- Drop unused indexes from portfolio_performance
DROP INDEX IF EXISTS idx_portfolio_performance_user_id;
DROP INDEX IF EXISTS idx_portfolio_performance_date;

-- Drop unused indexes from kyc_verifications
DROP INDEX IF EXISTS idx_kyc_verifications_reviewed_by;
DROP INDEX IF EXISTS idx_kyc_verifications_status;
