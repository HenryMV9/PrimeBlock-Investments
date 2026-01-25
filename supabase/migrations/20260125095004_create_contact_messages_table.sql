/*
  # Create Contact Messages Table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `full_name` (text) - sender's full name
      - `email` (text) - sender's email address
      - `subject` (text) - message subject category
      - `message` (text) - message content
      - `email_sent` (boolean) - whether email was successfully sent
      - `created_at` (timestamptz) - when message was submitted

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for authenticated users to insert messages
    - Add policy for anon users to insert messages (for contact form)
    - No read policies for regular users (admin only via service role)
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
