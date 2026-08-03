import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/payroll/pay-runs")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/payroll/pay-runs"
      parentHref="/dashboard/payroll"
      parentLabel="Payroll"
      title="Monthly Pay Runs & Execution"
      description="Direct deposit batching, bank ledger generation, and payroll signoff."
      items={[
        { id: "1", title: "August 2026 Monthly Pay Run", subtitle: "1,248 Employees · Total Gross: $482,500", status: "Draft - Preview Ready", date: "Scheduled: Aug 30", metric: "Bank Direct Transfer" },
        { id: "2", title: "July 2026 Monthly Pay Run", subtitle: "1,236 Employees · Total Gross: $478,000", status: "Executed & Paid", date: "Paid July 30", metric: "Completed" },
      ]}
    />
  ),
});
