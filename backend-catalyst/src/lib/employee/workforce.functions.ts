import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createEmployeeSchema = z.object({
  employeeCode: z.string().min(1, "Employee code is required"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  designationId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  joiningDate: z.string().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  id: z.string().uuid(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export const getEmployeesServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    const orgId = profile?.organization_id;
    if (!orgId) return [];

    const { data: employees, error } = await supabase
      .from("employees")
      .select("*, departments(name), designations(name)")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getEmployeesServerFn]", error);
      throw new Error(error.message);
    }

    return employees || [];
  });

export const createEmployeeServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => createEmployeeSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) {
      throw new Error("Organization ID missing for user");
    }

    const { data: newEmp, error } = await supabase
      .from("employees")
      .insert({
        organization_id: profile.organization_id,
        employee_code: data.employeeCode,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone ?? null,
        job_title: data.jobTitle ?? null,
        department_id: data.departmentId ?? null,
        designation_id: data.designationId ?? null,
        manager_id: data.managerId ?? null,
        location: data.location || "Bengaluru, IN",
        employment_type: data.employmentType || "Full-time",
        joining_date: data.joiningDate ?? new Date().toISOString().split("T")[0]!,
        status: "Active",
      })
      .select()
      .single();

    if (error) {
      console.error("[createEmployeeServerFn]", error);
      throw new Error(error.message);
    }

    return newEmp;
  });

export const updateEmployeeServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => updateEmployeeSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { id, ...updates } = data;

    const { data: updated, error } = await supabase
      .from("employees")
      .update({
        ...(updates.fullName ? { full_name: updates.fullName } : {}),
        ...(updates.email ? { email: updates.email } : {}),
        ...(updates.phone !== undefined ? { phone: updates.phone ?? null } : {}),
        ...(updates.jobTitle !== undefined ? { job_title: updates.jobTitle ?? null } : {}),
        ...(updates.departmentId !== undefined ? { department_id: updates.departmentId ?? null } : {}),
        ...(updates.status ? { status: updates.status } : {}),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updated;
  });
