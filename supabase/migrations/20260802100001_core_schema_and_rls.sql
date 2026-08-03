-- Core Multi-Tenant Database Migration: Auth, Roles, Departments & Designations

-- 1. Ensure authenticated role has execution access to has_role function for RLS checks
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated;

-- 2. Create Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  head_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 3. Create Designations table
CREATE TABLE IF NOT EXISTS public.designations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  name text NOT NULL,
  code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.designations TO authenticated;
GRANT ALL ON public.designations TO service_role;
ALTER TABLE public.designations ENABLE ROW LEVEL SECURITY;

-- 4. Add columns to profiles for enterprise structure
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='organization_id') THEN
    ALTER TABLE public.profiles ADD COLUMN organization_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='employee_code') THEN
    ALTER TABLE public.profiles ADD COLUMN employee_code text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='department_id') THEN
    ALTER TABLE public.profiles ADD COLUMN department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='designation_id') THEN
    ALTER TABLE public.profiles ADD COLUMN designation_id uuid REFERENCES public.designations(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='manager_id') THEN
    ALTER TABLE public.profiles ADD COLUMN manager_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5. Security Policies for Departments
DROP POLICY IF EXISTS "Users can read departments in their company" ON public.departments;
CREATE POLICY "Users can read departments in their company"
  ON public.departments FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid()
      UNION
      SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "HR Admins can manage departments" ON public.departments;
CREATE POLICY "HR Admins can manage departments"
  ON public.departments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'HR_ADMIN') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'HR_ADMIN') OR public.has_role(auth.uid(), 'admin'));

-- 6. Security Policies for Designations
DROP POLICY IF EXISTS "Users can read designations in their company" ON public.designations;
CREATE POLICY "Users can read designations in their company"
  ON public.designations FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid()
      UNION
      SELECT p.organization_id FROM public.profiles p WHERE p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "HR Admins can manage designations" ON public.designations;
CREATE POLICY "HR Admins can manage designations"
  ON public.designations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'HR_ADMIN') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'HR_ADMIN') OR public.has_role(auth.uid(), 'admin'));

-- 7. Updated RLS Policy on Profiles for HR Admin visibility
DROP POLICY IF EXISTS "HR Admins can read all organization profiles" ON public.profiles;
CREATE POLICY "HR Admins can read all organization profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR 
    public.has_role(auth.uid(), 'HR_ADMIN') OR 
    public.has_role(auth.uid(), 'admin')
  );
