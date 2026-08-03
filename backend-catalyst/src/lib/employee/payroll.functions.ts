import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const generatePayrollRunSchema = z.object({
  month: z.string().min(1),
  year: z.string().min(1),
});

export function calculatePayslipBreakdown(structure: {
  basicPay: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
}) {
  const grossEarnings = structure.basicPay + structure.hra + structure.conveyance + structure.specialAllowance;
  const pfDeduction = Math.round(structure.basicPay * 0.12); // 12% PF contribution
  const professionalTax = 200; // Fixed monthly PT

  // Income Tax calculation standard estimation (New Tax Regime Tiered)
  const annualGross = grossEarnings * 12;
  let annualTax = 0;

  if (annualGross > 1500000) {
    annualTax = (annualGross - 1500000) * 0.3 + 150000;
  } else if (annualGross > 1200000) {
    annualTax = (annualGross - 1200000) * 0.2 + 90000;
  } else if (annualGross > 900000) {
    annualTax = (annualGross - 900000) * 0.15 + 45000;
  } else if (annualGross > 700000) {
    annualTax = (annualGross - 700000) * 0.1 + 25000;
  } else {
    annualTax = 0; // Rebate applicable under 7 LPA
  }

  const monthlyIncomeTax = Math.round(annualTax / 12);
  const totalDeductions = pfDeduction + professionalTax + monthlyIncomeTax;
  const netPay = grossEarnings - totalDeductions;

  return {
    grossEarnings,
    pfDeduction,
    professionalTax,
    incomeTax: monthlyIncomeTax,
    totalDeductions,
    netPay,
  };
}

export const getPayslipsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: emp } = await supabase
      .from("employees")
      .select("id, organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!emp) return [];

    const { data: payslips, error } = await supabase
      .from("payslips")
      .select("*")
      .eq("employee_id", emp.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return payslips || [];
  });

export const runPayrollDisbursementServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => generatePayrollRunSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) throw new Error("Organization missing");

    // Fetch all active employees in org
    const { data: employees } = await supabase
      .from("employees")
      .select("id")
      .eq("organization_id", profile.organization_id)
      .eq("status", "Active");

    if (!employees || employees.length === 0) {
      throw new Error("No active employees found for payroll run.");
    }

    // Create Payroll Run Record
    const { data: run, error: runErr } = await supabase
      .from("payroll_runs")
      .insert({
        organization_id: profile.organization_id,
        month: data.month,
        year: data.year,
        employees_count: employees.length,
        status: "Processing",
      })
      .select()
      .single();

    if (runErr) throw new Error(runErr.message);

    let totalDisbursement = 0;
    const paidOnDate: string = new Date().toISOString().split("T")[0]!;

    // Generate payslips for each employee
    for (const emp of employees) {
      const defaultStructure = {
        basicPay: 45000,
        hra: 18000,
        conveyance: 3000,
        specialAllowance: 12000,
      };

      const computed = calculatePayslipBreakdown(defaultStructure);
      totalDisbursement += computed.netPay;

      await supabase.from("payslips").insert({
        organization_id: profile.organization_id,
        payroll_run_id: run.id,
        employee_id: emp.id,
        month: data.month,
        year: data.year,
        basic_pay: defaultStructure.basicPay,
        hra: defaultStructure.hra,
        conveyance: defaultStructure.conveyance,
        special_allowance: defaultStructure.specialAllowance,
        gross_earnings: computed.grossEarnings,
        pf_deduction: computed.pfDeduction,
        professional_tax: computed.professionalTax,
        income_tax: computed.incomeTax,
        total_deductions: computed.totalDeductions,
        net_pay: computed.netPay,
        status: "Paid",
        paid_on: paidOnDate,
      });
    }

    // Mark run as Completed
    await supabase
      .from("payroll_runs")
      .update({
        status: "Completed",
        total_disbursement: totalDisbursement,
        processed_at: new Date().toISOString(),
      })
      .eq("id", run.id);

    return { success: true, runId: run.id, totalDisbursement };
  });
