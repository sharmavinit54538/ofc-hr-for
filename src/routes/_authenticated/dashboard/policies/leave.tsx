import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { useGetPoliciesByCategoryQuery } from "@/services/policyApi";

export const Route = createFileRoute("/_authenticated/dashboard/policies/leave")({
  component: LeavePoliciesPage,
});

function LeavePoliciesPage() {
  const { data: policyRes, isLoading } = useGetPoliciesByCategoryQuery("Leave", {
    refetchOnMountOrArgChange: true,
  });

  const policies = policyRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Benefits & PTO Guidelines"
        description="Paid annual leave accruals, casual leave carryover rules, and parental leave benefits."
        breadcrumbs={[{ label: "Policy Center", href: "/dashboard/policies" }, { label: "Leave Policies" }]}
        backHref="/dashboard/policies"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading Leave policies...
        </div>
      ) : policies.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Leave Policies Published</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {policies.map((p) => (
            <div key={p.id} className="glass-tile space-y-2 rounded-2xl p-5">
              <h3 className="font-display text-base font-bold text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground">{p.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
