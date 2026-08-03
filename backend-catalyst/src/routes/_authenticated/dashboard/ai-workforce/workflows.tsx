import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce/workflows")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/ai-workforce/workflows"
      parentHref="/dashboard/ai-workforce"
      parentLabel="AI Workforce"
      title="Automation Workflows & Event Triggers"
      description="No-code event-driven triggers for IT provisioning, badge access, and welcome emails."
      items={[
        { id: "1", title: "New Employee Provisioning Trigger", subtitle: "On Sign-up -> Create Google Workspace, Slack & Jira", status: "Enabled", date: "Runs instantly", metric: "2.4k executions" },
      ]}
    />
  ),
});
