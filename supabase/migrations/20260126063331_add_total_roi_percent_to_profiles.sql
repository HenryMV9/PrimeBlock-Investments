/*
  # Add Total ROI Percent to Profiles

  1. Changes
    - Add `total_roi_percent` column to `profiles` table
      - This allows admins to manually set the ROI percentage for each user
      - Default value is 0
      - Uses numeric type for precise decimal values
  
  2. Purpose
    - Enable admins to control and update user ROI figures from the admin panel
    - Display custom ROI values on user dashboards instead of calculated values
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_roi_percent'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_roi_percent numeric DEFAULT 0 NOT NULL;
  END IF;
END $$;