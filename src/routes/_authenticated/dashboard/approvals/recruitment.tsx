import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/recruitment")({
  component: RecruitmentApprovalsPage,
});

function RecruitmentApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Requisition & Offer Approvals"
        description="Budget sign-off for new headcounts and candidate offer release packages."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Recruitment" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">3 Requisitions Pending CHRO Budget Sign-Off.</div>
    </div>
  );
}
