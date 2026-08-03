import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/payroll")({
  component: PayrollApprovalsPage,
});

function PayrollApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & Bonus Adjustment Approvals"
        description="Executive sign-off queue for monthly payroll disbursement, bonus payouts, and salary revisions."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Payroll" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">
        All July 2026 Payroll Payout Batches and Statutory Tax Returns have been approved and processed.
      </div>
    </div>
  );
}
