import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_POLICIES } from "@/lib/policies/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/policies/hr")({
  component: HrPoliciesPage,
});

function HrPoliciesPage() {
  const policies = MOCK_POLICIES.filter((p) => p.category === "HR");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Human Resources Policies & Employee Handbook"
        description="Official codes of conduct, hybrid work guidelines, and employee handbook."
        breadcrumbs={[{ label: "Policy Center", href: "/dashboard/policies" }, { label: "HR Policies" }]}
        backHref="/dashboard/policies"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {policies.map((p) => (
          <div key={p.id} className="glass-tile space-y-2 rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-foreground">{p.title}</h3>
            <p className="text-xs text-muted-foreground">{p.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
