import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";

export const Route = createFileRoute("/_authenticated/dashboard/integrations/")({
  component: IntegrationsLandingPage,
});

function IntegrationsLandingPage() {
  const nav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "integrations");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Enterprise Integrations & API Gateway"
        description="Connect SSO Identity providers, ERP accounting ledgers, Slack / Microsoft Teams communication gateways, and custom REST webhooks."
        breadcrumbs={[{ label: "Integrations" }]}
      />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Integrations Modules
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {nav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
