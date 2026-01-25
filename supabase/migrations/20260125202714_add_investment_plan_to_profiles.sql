/*
  # Add Investment Plan to Profiles

  1. Changes
    - Add `investment_plan` column to profiles table
    - Add `plan_min_amount` column to profiles table
    - Add `plan_max_amount` column to profiles table
    - Update existing profiles to have 'starter' plan by default
  
  2. Notes
    - Investment plan IDs: 'starter', 'smart', 'wealth', 'elite'
    - Min/max amounts will be stored for validation
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'investment_plan'
  ) THEN
    ALTER TABLE profiles ADD COLUMN investment_plan text DEFAULT 'starter';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'plan_min_amount'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan_min_amount numeric DEFAULT 100;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'plan_max_amount'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan_max_amount numeric DEFAULT 1000;
  END IF;
END $$;

UPDATE profiles 
SET 
  investment_plan = 'starter',
  plan_min_amount = 100,
  plan_max_amount = 1000
WHERE investment_plan IS NULL;
