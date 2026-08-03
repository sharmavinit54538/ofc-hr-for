import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/onboarding")({
  component: OnboardingApprovalsPage,
});

function OnboardingApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Joiner Verification Sign-Offs"
        description="Approval queue for verified new hire IDs, educational background checks, and hardware dispatch."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Onboarding" }]}
        backHref="/dashboard/approvals"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">6 New Joiners Document Verification Completed.</div>
    </div>
  );
}
