-- Workforce & Employees Database Migration

CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_code text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  job_title text,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  designation_id uuid REFERENCES public.designations(id) ON DELETE SET NULL,
  manager_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  location text DEFAULT 'Bengaluru, IN',
  employment_type text DEFAULT 'Full-time',
  joining_date date DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, employee_code)
);

CREATE INDEX IF NOT EXISTS idx_employees_org ON public.employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_dept ON public.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_user ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view employees in their organization" ON public.employees;
CREATE POLICY "Users can view employees in their organization"
  ON public.employees FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid()
      UNION
      SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "HR Admins can insert employees" ON public.employees;
CREATE POLICY "HR Admins can insert employees"
  ON public.employees FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'HR_ADMIN') OR 
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "HR Admins can update employees" ON public.employees;
CREATE POLICY "HR Admins can update employees"
  ON public.employees FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'HR_ADMIN') OR 
    public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'HR_ADMIN') OR 
    public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "HR Admins can delete employees" ON public.employees;
CREATE POLICY "HR Admins can delete employees"
  ON public.employees FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'HR_ADMIN') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Trigger for updated_at
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
