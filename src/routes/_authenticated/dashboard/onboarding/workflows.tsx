import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding/workflows")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/onboarding/workflows"
      parentHref="/dashboard/onboarding"
      parentLabel="Onboarding"
      title="Automated Workflows"
      description="Pre-configured orientation playbooks, IT provisioning automation, and department welcome sequences."
      items={[
        { id: "1", title: "Engineering Onboarding Sequence", subtitle: "GitHub, AWS, Jira & Slack setup", status: "Active", date: "Default for Product Engineering", metric: "6 Auto-steps" },
        { id: "2", title: "Executive & Leadership Welcome", subtitle: "1-on-1s, NDA, Hardware dispatch & Travel", status: "Active", date: "Default for Leadership", metric: "8 Auto-steps" },
      ]}
    />
  ),
});
