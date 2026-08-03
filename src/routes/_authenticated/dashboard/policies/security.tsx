import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/policies/security")({
  component: SecurityPoliciesPage,
});

function SecurityPoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Information Security & SOC2 Data Policies"
        description="Mandatory 2FA enforcement, clean desk rules, and AI data privacy standards."
        breadcrumbs={[{ label: "Policy Center", href: "/dashboard/policies" }, { label: "Security Policies" }]}
        backHref="/dashboard/policies"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">5 Enforced SOC2 Security Policies Active.</div>
    </div>
  );
}
