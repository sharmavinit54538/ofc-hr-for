import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/promotions")({
  component: PromotionsApprovalsPage,
});

function PromotionsApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotions & Salary Hike Approvals"
        description="Manager recommendations for designation upgrades and merit compensation hikes."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Promotions" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">14 Staff Nominated for H2 Appraisal Band Hikes.</div>
    </div>
  );
}
