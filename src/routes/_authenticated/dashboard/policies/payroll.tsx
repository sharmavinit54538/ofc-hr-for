import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/policies/payroll")({
  component: PayrollPoliciesPage,
});

function PayrollPoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & Tax Statutory Policies"
        description="Salary disbursement cycles, Form 12BB proof submission rules, and reimbursement guidelines."
        breadcrumbs={[{ label: "Policy Center", href: "/dashboard/policies" }, { label: "Payroll Policies" }]}
        backHref="/dashboard/policies"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">6 Active Payroll & Statutory Tax Policies Published.</div>
    </div>
  );
}
