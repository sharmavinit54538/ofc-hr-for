import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { useGetPoliciesByCategoryQuery } from "@/services/policyApi";

export const Route = createFileRoute("/_authenticated/dashboard/policies/security")({
  component: SecurityPoliciesPage,
});

function SecurityPoliciesPage() {
  const { data: policyRes, isLoading } = useGetPoliciesByCategoryQuery("Security", {
    refetchOnMountOrArgChange: true,
  });

  const policies = policyRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Information Security & SOC2 Data Policies"
        description="Mandatory 2FA enforcement, clean desk rules, and AI data privacy standards."
        breadcrumbs={[{ label: "Policy Center", href: "/dashboard/policies" }, { label: "Security Policies" }]}
        backHref="/dashboard/policies"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading Security policies...
        </div>
      ) : policies.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Security Policies Published</p>
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
