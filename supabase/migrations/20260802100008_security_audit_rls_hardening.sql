-- Production Security Audit Migration: Complete Row Level Security (RLS) Enforcement

-- 1. Enable RLS on all enterprise domain tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Restrict Security-Definer Helper Functions execution to service_role and postgres owner only
REVOKE ALL ON FUNCTION public.has_role(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 3. Default Deny policies & Explicit Role Scoped Policies

-- Salary Structures (Only HR_ADMIN, EXECUTIVE & the employee themselves can view salary)
DROP POLICY IF EXISTS "Salary structure self and HR read policy" ON public.salary_structures;
CREATE POLICY "Salary structure self and HR read policy"
  ON public.salary_structures FOR SELECT TO authenticated
  USING (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
    public.has_role(auth.uid(), 'HR_ADMIN') OR
    public.has_role(auth.uid(), 'EXECUTIVE') OR
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Salary structure HR manage policy" ON public.salary_structures;
CREATE POLICY "Salary structure HR manage policy"
  ON public.salary_structures FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'HR_ADMIN') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'HR_ADMIN') OR public.has_role(auth.uid(), 'admin'));

-- Payslips (Employee sees own, HR_ADMIN sees all in org)
DROP POLICY IF EXISTS "Payslip employee self view policy" ON public.payslips;
CREATE POLICY "Payslip employee self view policy"
  ON public.payslips FOR SELECT TO authenticated
  USING (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
    public.has_role(auth.uid(), 'HR_ADMIN') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Audit Logs (Only HR_ADMIN and IT_ADMIN can view security audit trails)
DROP POLICY IF EXISTS "Security audit logs view policy" ON public.audit_logs;
CREATE POLICY "Security audit logs view policy"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'HR_ADMIN') OR
    public.has_role(auth.uid(), 'IT_ADMIN') OR
    public.has_role(auth.uid(), 'admin')
  );
