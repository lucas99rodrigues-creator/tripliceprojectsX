/*
# Create contact_leads table (single-tenant, no auth)

1. New Tables
- `contact_leads`
- `id` (uuid, primary key)
- `name` (text, not null) — lead's full name
- `email` (text, not null) — lead's email address
- `phone` (text, not null) — lead's phone number
- `message` (text, not null) — project description / inquiry
- `source` (text, default 'website') — where the lead came from
- `created_at` (timestamptz, default now()) — submission timestamp

2. Security
- Enable RLS on `contact_leads`.
- INSERT policy for anon + authenticated (public landing page form, no sign-in).
- No SELECT/UPDATE/DELETE policies — leads are private to the operator and
  must never be readable from the anon-key frontend.

3. Important Notes
- This is a single-tenant landing page with no sign-in screen, so the anon role
  must be able to INSERT. Reads are intentionally blocked at the database level.
- Idempotent: uses IF NOT EXISTS and DROP POLICY IF EXISTS.
*/

CREATE TABLE IF NOT EXISTS contact_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    message text NOT NULL,
    source text NOT NULL DEFAULT 'website',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_leads" ON contact_leads;
CREATE POLICY "anon_insert_contact_leads"
ON contact_leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);
