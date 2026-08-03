import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const applyLeaveSchema = z.object({
  leaveType: z.string().min(1, "Leave type is required"),
  fromDate: z.string().min(1, "From date required"),
  toDate: z.string().min(1, "To date required"),
  reason: z.string().min(3, "Reason required"),
});

export const processLeaveApprovalSchema = z.object({
  requestId: z.string().uuid(),
  status: z.enum(["Approved", "Rejected"]),
});

export const getLeaveBalancesServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: emp } = await supabase
      .from("employees")
      .select("id, organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!emp) return [];

    const { data: balances, error } = await supabase
      .from("leave_balances")
      .select("*")
      .eq("employee_id", emp.id);

    if (error) throw new Error(error.message);
    return balances || [];
  });

export const getLeaveRequestsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: emp } = await supabase
      .from("employees")
      .select("id, organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!emp) return [];

    const { data: requests, error } = await supabase
      .from("leave_requests")
      .select("*, employees(full_name)")
      .eq("organization_id", emp.organization_id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return requests || [];
  });

export const applyLeaveServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => applyLeaveSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: emp } = await supabase
      .from("employees")
      .select("id, organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!emp) throw new Error("Employee record not found for user.");

    // Calculate days count
    const start = new Date(data.fromDate).getTime();
    const end = new Date(data.toDate).getTime();
    const daysCount = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)) + 1);

    // Check balance
    const { data: balanceRecord } = await supabase
      .from("leave_balances")
      .select("remaining")
      .eq("employee_id", emp.id)
      .eq("leave_type", data.leaveType)
      .maybeSingle();

    if (balanceRecord && balanceRecord.remaining < daysCount) {
      throw new Error(`Insufficient leave balance: You have ${balanceRecord.remaining} days remaining, but requested ${daysCount} days.`);
    }

    const { data: leaveReq, error } = await supabase
      .from("leave_requests")
      .insert({
        organization_id: emp.organization_id,
        employee_id: emp.id,
        leave_type: data.leaveType,
        from_date: data.fromDate,
        to_date: data.toDate,
        days_count: daysCount,
        reason: data.reason,
        status: "Pending",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return leaveReq;
  });

export const processLeaveApprovalServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => processLeaveApprovalSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase } = context;

    const { data: req } = await supabase
      .from("leave_requests")
      .select("*, employees(id)")
      .eq("id", data.requestId)
      .maybeSingle();

    if (!req) throw new Error("Leave request not found");

    // Update leave request status
    const { data: updatedReq, error } = await supabase
      .from("leave_requests")
      .update({ status: data.status })
      .eq("id", data.requestId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // If Approved, deduct remaining days from employee's leave balance
    if (data.status === "Approved") {
      const { data: balance } = await supabase
        .from("leave_balances")
        .select("id, used, remaining")
        .eq("employee_id", req.employee_id)
        .eq("leave_type", req.leave_type)
        .maybeSingle();

      if (balance) {
        const newUsed = Number(balance.used) + Number(req.days_count);
        const newRemaining = Math.max(0, Number(balance.remaining) - Number(req.days_count));

        await supabase
          .from("leave_balances")
          .update({ used: newUsed, remaining: newRemaining })
          .eq("id", balance.id);
      }
    }

    return updatedReq;
  });
