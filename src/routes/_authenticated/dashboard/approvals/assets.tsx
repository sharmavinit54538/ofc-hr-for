import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/assets")({
  component: AssetsApprovalsPage,
});

function AssetsApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Allocation & Handover Approvals"
        description="IT Hardware requisition approvals and employee exit asset clearance sign-offs."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Assets" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">5 Laptop Requisition Requests Pending IT Approval.</div>
    </div>
  );
}
