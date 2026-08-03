import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/integrations/api")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/integrations/api"
      parentHref="/dashboard/integrations"
      parentLabel="Integrations"
      title="Developer API Keys & Webhooks"
      description="RESTful API tokens, rate limits, webhook endpoints, and GraphQL playground."
      items={[
        { id: "1", title: "Production API Secret Key", subtitle: "Key: ofc_live_9f82...x91a", status: "Active Key", date: "Created Mar 2026", metric: "Rate: 10k/min" },
      ]}
    />
  ),
});
