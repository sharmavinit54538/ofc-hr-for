import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/transfers")({
  component: TransfersApprovalsPage,
});

function TransfersApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inter-Office Branch Transfer Approvals"
        description="Employee relocation requests and cost-center transfer sign-offs."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Transfers" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">2 Branch Relocation Requests Pending HR Business Partner Sign-Off.</div>
    </div>
  );
}
