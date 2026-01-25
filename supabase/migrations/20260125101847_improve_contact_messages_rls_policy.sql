/*
  # Improve Contact Messages RLS Policy

  ## Problem
  The contact_messages INSERT policy allows unrestricted access with no validation,
  which could enable spam or abuse.

  ## Solution
  Add basic validation checks to the INSERT policy:
  - Ensure all required fields are not empty
  - Ensure email format is valid
  - Ensure message is not too long (prevent DOS)

  ## Changes
  - Replace the "always true" policy with a validating policy
  - Add constraints to ensure data quality
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;

-- Create improved policy with validation
CREATE POLICY "Anyone can submit valid contact messages"
  ON contact_messages
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    -- Ensure all required fields are not empty
    length(trim(full_name)) > 0 AND
    length(trim(email)) > 0 AND
    length(trim(subject)) > 0 AND
    length(trim(message)) > 0 AND
    -- Ensure reasonable length limits (prevent abuse)
    length(full_name) <= 200 AND
    length(email) <= 320 AND
    length(subject) <= 100 AND
    length(message) <= 5000 AND
    -- Basic email format validation
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
