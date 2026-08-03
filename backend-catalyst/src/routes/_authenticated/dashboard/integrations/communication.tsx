import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/integrations/communication")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/integrations/communication"
      parentHref="/dashboard/integrations"
      parentLabel="Integrations"
      title="Communication & Slack Gateways"
      description="Slack HR bot, Microsoft Teams notifications, and SendGrid email gateways."
      items={[
        { id: "1", title: "Slack OFC HR Bot App", subtitle: "Instant approval requests, leave notifications, and AI bot", status: "Installed in #general", date: "v2.4 Active", metric: "Real-time" },
      ]}
    />
  ),
});
