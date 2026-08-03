-- Phase 7 Migration: Audit Logs & Automated Audit Triggers

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_name text NOT NULL, -- profiles, user_roles, salary_structures, employees, documents
  entity_id uuid,
  action text NOT NULL, -- CREATE, UPDATE, DELETE, ROLE_CHANGE, SALARY_EDIT
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_name, entity_id);

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant audit logs" ON public.audit_logs FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid()
      UNION
      SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()
    ) AND (
      public.has_role(auth.uid(), 'HR_ADMIN') OR 
      public.has_role(auth.uid(), 'IT_ADMIN') OR 
      public.has_role(auth.uid(), 'admin')
    )
  );

-- Automated Trigger Function for Employee / Salary Audit Logging
CREATE OR REPLACE FUNCTION public.log_sensitive_employee_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.status IS DISTINCT FROM NEW.status) OR (OLD.job_title IS DISTINCT FROM NEW.job_title) THEN
      INSERT INTO public.audit_logs (organization_id, actor_id, entity_name, entity_id, action, old_data, new_data)
      VALUES (
        NEW.organization_id,
        auth.uid(),
        'employees',
        NEW.id,
        'UPDATE_EMPLOYEE_STATUS',
        to_jsonb(OLD),
        to_jsonb(NEW)
      );
    END IF;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (organization_id, actor_id, entity_name, entity_id, action, new_data)
    VALUES (
      NEW.organization_id,
      auth.uid(),
      'employees',
      NEW.id,
      'CREATE_EMPLOYEE',
      to_jsonb(NEW)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_audit_employees ON public.employees;
CREATE TRIGGER trigger_audit_employees
  AFTER INSERT OR UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sensitive_employee_changes();
