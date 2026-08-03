-- Phase 5 Migration: Multi-level Approvals Workflow Engine

CREATE TABLE IF NOT EXISTS public.approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  approval_code text NOT NULL,
  type text NOT NULL, -- Leave, Attendance, Payroll, Recruitment, Onboarding, Assets, Expenses, Promotions, Transfers, Resignations, Overtime, Training
  request_title text NOT NULL,
  requester_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  priority text NOT NULL DEFAULT 'Medium', -- Urgent, High, Medium, Low
  assigned_approver_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  amount_or_days text,
  status text NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected, Changes Requested
  comments text,
  submitted_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.approval_requests TO authenticated;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant approval requests" ON public.approval_requests FOR ALL TO authenticated
  USING (organization_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid() UNION SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()));
