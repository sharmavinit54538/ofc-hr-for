-- Phase 6 Migration: Assets, Onboarding, Recruitment, Documents, Helpdesk, Engagement & Vendors

-- 1. Assets Table
CREATE TABLE IF NOT EXISTS public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  asset_tag text NOT NULL,
  name text NOT NULL,
  category text NOT NULL, -- Laptops, Monitors, Mobile Devices, Peripherals, Infrastructure
  serial_number text,
  purchase_date date,
  value numeric(10, 2),
  status text NOT NULL DEFAULT 'Available', -- Assigned, Available, Maintenance, Retired
  assigned_to uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Candidates & Recruitment Table
CREATE TABLE IF NOT EXISTS public.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  candidate_code text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  position text NOT NULL,
  department text,
  stage text NOT NULL DEFAULT 'Applied', -- Applied, Screening, Technical Interview, Executive Round, Offer Extended, Hired, Rejected
  experience text,
  expected_ctc text,
  notice_period text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Onboarding Tasks Table
CREATE TABLE IF NOT EXISTS public.onboarding_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'HR & Compliance',
  due_date date,
  completed boolean DEFAULT false,
  assigned_role text DEFAULT 'EMPLOYEE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Documents Repository Table
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  document_code text NOT NULL,
  title text NOT NULL,
  category text NOT NULL, -- Contract, Offer Letter, Policy, Employee Record, Tax Proof
  file_url text,
  file_size text,
  uploaded_by text,
  security_classification text DEFAULT 'Confidential',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Helpdesk Tickets Table
CREATE TABLE IF NOT EXISTS public.helpdesk_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  ticket_code text NOT NULL,
  subject text NOT NULL,
  category text NOT NULL, -- IT Support, HR Operations, Payroll & Benefits, Facilities
  priority text NOT NULL DEFAULT 'Medium', -- Low, Medium, High, Urgent
  status text NOT NULL DEFAULT 'Open', -- Open, In Progress, Resolved, Closed
  requester_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  assigned_to text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Vendors Table
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  vendor_code text NOT NULL,
  company_name text NOT NULL,
  category text NOT NULL, -- Software & SaaS, Hardware, Staffing, Facilities, Legal & Audit
  contact_person text,
  email text,
  phone text,
  contract_status text NOT NULL DEFAULT 'Active',
  annual_spend numeric(12, 2) DEFAULT 0.00,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Grants & RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.helpdesk_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendors TO authenticated;

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant assets" ON public.assets FOR ALL TO authenticated USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "Tenant candidates" ON public.candidates FOR ALL TO authenticated USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "Tenant onboarding_tasks" ON public.onboarding_tasks FOR ALL TO authenticated USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "Tenant documents" ON public.documents FOR ALL TO authenticated USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "Tenant helpdesk_tickets" ON public.helpdesk_tickets FOR ALL TO authenticated USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "Tenant vendors" ON public.vendors FOR ALL TO authenticated USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));
