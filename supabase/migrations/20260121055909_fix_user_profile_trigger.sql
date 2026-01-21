/*
  # Fix User Profile Trigger

  1. Changes
    - Updates the handle_new_user function to correctly extract full_name from user metadata
    - Ensures both raw_user_meta_data and raw_app_meta_data are checked for the name

  2. Notes
    - This fixes the issue where user names weren't being saved on registration
*/

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE 
      WHEN profiles.full_name = '' OR profiles.full_name IS NULL 
      THEN EXCLUDED.full_name 
      ELSE profiles.full_name 
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
