import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createApprovalSchema = z.object({
  type: z.enum([
    "Leave",
    "Attendance",
    "Payroll",
    "Recruitment",
    "Onboarding",
    "Assets",
    "Expenses",
    "Promotions",
    "Transfers",
    "Resignations",
    "Overtime",
    "Training",
  ]),
  requestTitle: z.string().min(2),
  priority: z.enum(["Urgent", "High", "Medium", "Low"]).optional(),
  amountOrDays: z.string().optional(),
});

export const updateApprovalDecisionSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["Approved", "Rejected", "Changes Requested"]),
  comments: z.string().optional(),
});

export const getApprovalsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) return [];

    const { data: items, error } = await supabase
      .from("approval_requests")
      .select("*, requester:employees!approval_requests_requester_id_fkey(full_name, department_id)")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return items || [];
  });

export const createApprovalRequestServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => createApprovalSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: emp } = await supabase
      .from("employees")
      .select("id, organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!emp) throw new Error("Employee record not found");

    const code = `APR-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: item, error } = await supabase
      .from("approval_requests")
      .insert({
        organization_id: emp.organization_id,
        approval_code: code,
        type: data.type,
        request_title: data.requestTitle,
        requester_id: emp.id,
        priority: data.priority || "Medium",
        amount_or_days: data.amountOrDays ?? null,
        status: "Pending",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return item;
  });

export const processApprovalDecisionServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => updateApprovalDecisionSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase } = context;

    const { data: updated, error } = await supabase
      .from("approval_requests")
      .update({
        status: data.status,
        comments: data.comments ?? null,
      })
      .eq("id", data.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });
