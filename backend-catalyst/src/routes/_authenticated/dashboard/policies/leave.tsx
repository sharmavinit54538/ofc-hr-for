import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/policies/leave")({
  component: LeavePoliciesPage,
});

function LeavePoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Benefits & PTO Guidelines"
        description="Paid annual leave accruals, casual leave carryover rules, and parental leave benefits."
        breadcrumbs={[{ label: "Policy Center", href: "/dashboard/policies" }, { label: "Leave Policies" }]}
        backHref="/dashboard/policies"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">8 Active Leave Benefit Guidelines Published.</div>
    </div>
  );
}
