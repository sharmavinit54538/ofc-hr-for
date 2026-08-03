-- Phase 3 Migration: Attendance, Leave Engine, Calendar Events & Company Policies

-- 1. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  clock_in timestamptz,
  clock_out timestamptz,
  total_minutes integer DEFAULT 0,
  status text NOT NULL DEFAULT 'Present', -- Present, Absent, Half Day, WFH, Weekend, Holiday
  lat numeric(10, 8),
  lng numeric(11, 8),
  overtime_minutes integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, employee_id, date)
);

-- 2. Leave Policies Table
CREATE TABLE IF NOT EXISTS public.leave_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type text NOT NULL, -- Casual Leave, Sick Leave, Earned Leave, Comp Off
  max_days_per_year integer NOT NULL DEFAULT 12,
  notice_days_required integer NOT NULL DEFAULT 1,
  carry_forward_allowed boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Leave Balances Table
CREATE TABLE IF NOT EXISTS public.leave_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type text NOT NULL,
  total_accrued numeric(5, 2) NOT NULL DEFAULT 12.0,
  used numeric(5, 2) NOT NULL DEFAULT 0.0,
  remaining numeric(5, 2) NOT NULL DEFAULT 12.0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, employee_id, leave_type)
);

-- 4. Leave Requests Table
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type text NOT NULL,
  from_date date NOT NULL,
  to_date date NOT NULL,
  days_count numeric(4, 1) NOT NULL DEFAULT 1.0,
  reason text,
  status text NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected, Cancelled
  approver_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  applied_on timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Calendar Events Table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Event', -- Event, Meeting, Holiday, Birthday, Anniversary, Shift, Leave
  start_date date NOT NULL,
  end_date date NOT NULL,
  time text,
  location text,
  organizer text,
  department text DEFAULT 'All Departments',
  description text,
  status text NOT NULL DEFAULT 'Confirmed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Company Policies Table
CREATE TABLE IF NOT EXISTS public.company_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  policy_code text NOT NULL,
  title text NOT NULL,
  category text NOT NULL, -- HR, Payroll, Attendance, Leave, Security
  version text NOT NULL DEFAULT 'v1.0',
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed date DEFAULT CURRENT_DATE,
  author text,
  acknowledgement_pct numeric(5, 2) DEFAULT 100.00,
  status text NOT NULL DEFAULT 'Published',
  summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS & Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_policies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_balances TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_policies TO authenticated;

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Tenant attendance policy" ON public.attendance_records FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Tenant leave policies" ON public.leave_policies FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Tenant leave balances" ON public.leave_balances FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Tenant leave requests" ON public.leave_requests FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Tenant calendar events" ON public.calendar_events FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Tenant company policies" ON public.company_policies FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));
