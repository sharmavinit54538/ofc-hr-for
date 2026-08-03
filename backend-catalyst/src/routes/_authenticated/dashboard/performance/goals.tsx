import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/performance/goals")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/performance/goals"
      parentHref="/dashboard/performance"
      parentLabel="Performance"
      title="Goal Tracking & OKRs"
      description="Company strategy alignment, key result indicators, and team targets."
      items={[
        { id: "1", title: "Q3 Product Launch: AI Agent Suite", subtitle: "Owner: Sanya Kapoor · Product Engineering", status: "84% Completed", date: "Target: Sep 30", metric: "On Track" },
        { id: "2", title: "Reduce Onboarding Time to <3 Days", subtitle: "Owner: Aarav Mehta · Human Resources", status: "92% Completed", date: "Target: Aug 31", metric: "Exceeding Target" },
      ]}
    />
  ),
});
