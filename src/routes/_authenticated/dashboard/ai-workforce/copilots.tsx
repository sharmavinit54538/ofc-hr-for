import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce/copilots")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/ai-workforce/copilots"
      parentHref="/dashboard/ai-workforce"
      parentLabel="AI Workforce"
      title="Manager & Recruiter Smart Co-Pilots"
      description="In-context AI assistants embedded for job drafting, review feedback assistance, and 1-on-1 prep."
      items={[
        { id: "1", title: "Manager 1-on-1 Co-Pilot", subtitle: "Prepares meeting agendas, goal check-ins, and notes", status: "Active", date: "Integrated with Calendar", metric: "Smart Assistant" },
      ]}
    />
  ),
});
