import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/expenses")({
  component: ExpensesApprovalsPage,
});

function ExpensesApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Claims & Reimbursement Approvals"
        description="Business travel reimbursements, client meal receipts, and mobile allowance approval queue."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Expenses" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">$12,400 Total Claims Submitted across 4 employees.</div>
    </div>
  );
}
