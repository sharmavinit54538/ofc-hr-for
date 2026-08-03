-- Phase 4 Migration: Payroll Engine & Payslips

CREATE TABLE IF NOT EXISTS public.salary_structures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  basic_pay numeric(12, 2) NOT NULL DEFAULT 45000.00,
  hra numeric(12, 2) NOT NULL DEFAULT 18000.00,
  conveyance numeric(12, 2) NOT NULL DEFAULT 3000.00,
  special_allowance numeric(12, 2) NOT NULL DEFAULT 12000.00,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, employee_id)
);

CREATE TABLE IF NOT EXISTS public.payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  month text NOT NULL,
  year text NOT NULL,
  total_disbursement numeric(14, 2) DEFAULT 0.00,
  employees_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft', -- Draft, Processing, Completed
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  payroll_run_id uuid REFERENCES public.payroll_runs(id) ON DELETE SET NULL,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  month text NOT NULL,
  year text NOT NULL,
  basic_pay numeric(12, 2) NOT NULL,
  hra numeric(12, 2) NOT NULL,
  conveyance numeric(12, 2) NOT NULL,
  special_allowance numeric(12, 2) NOT NULL,
  gross_earnings numeric(12, 2) NOT NULL,
  pf_deduction numeric(12, 2) NOT NULL DEFAULT 0.00,
  professional_tax numeric(12, 2) NOT NULL DEFAULT 200.00,
  income_tax numeric(12, 2) NOT NULL DEFAULT 0.00,
  total_deductions numeric(12, 2) NOT NULL,
  net_pay numeric(12, 2) NOT NULL,
  paid_on date,
  status text NOT NULL DEFAULT 'Paid', -- Paid, Pending, Processing
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.salary_structures TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payroll_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payslips TO authenticated;

ALTER TABLE public.salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant salary structures" ON public.salary_structures FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Tenant payroll runs" ON public.payroll_runs FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Tenant payslips" ON public.payslips FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));
