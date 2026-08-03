import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/overtime")({
  component: OvertimeApprovalsPage,
});

function OvertimeApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Overtime Hours & Payout Approvals"
        description="Manager queue for approving extra shift hours and night differential payouts."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Overtime" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">18 Overtime Claims ($1,240 total) Pending Manager Sign-Off.</div>
    </div>
  );
}
