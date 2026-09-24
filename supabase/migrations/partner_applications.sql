CREATE TABLE IF NOT EXISTS partner_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  partner_type TEXT NOT NULL,
  partner_type_other TEXT,
  company_name TEXT NOT NULL,
  website TEXT,
  social_media TEXT,
  company_address TEXT,
  years_in_business TEXT,
  markets TEXT,
  monthly_patients TEXT NOT NULL,
  treatments_interest JSONB DEFAULT '[]'::jsonb,
  business_description TEXT NOT NULL,
  how_heard TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','needs_info')),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  auth_user_id UUID
);

CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  auth_user_id UUID NOT NULL UNIQUE,
  application_id UUID REFERENCES partner_applications(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','suspended')),
  company_name TEXT,
  partner_type TEXT,
  full_name TEXT,
  email TEXT
);

-- Both tables are written/read exclusively by trusted server code using the
-- service role key (which bypasses RLS). Enabling RLS with no policies denies
-- all access via the public anon/authenticated Supabase REST API, preventing
-- direct reads/writes of applicant PII through the public anon key.
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Explicit service_role grants (no anon/authenticated grants — see above).
-- Written out explicitly rather than relying on default privileges, so a
-- fresh environment set up from these migration files alone doesn't end up
-- with tables the app's own service-role client can't reach.
GRANT ALL ON partner_applications TO service_role;
GRANT ALL ON partners TO service_role;
