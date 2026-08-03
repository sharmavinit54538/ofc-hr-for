import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/training")({
  component: TrainingApprovalsPage,
});

function TrainingApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Nomination & Executive Upskilling Approvals"
        description="Approval queue for external certifications and sponsored executive leadership courses."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Training" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">5 Executive Training Course Nominations Pending Approval.</div>
    </div>
  );
}
