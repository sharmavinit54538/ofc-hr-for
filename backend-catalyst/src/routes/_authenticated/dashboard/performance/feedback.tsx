import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/performance/feedback")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/performance/feedback"
      parentHref="/dashboard/performance"
      parentLabel="Performance"
      title="360 Continuous Feedback"
      description="Peer praise, constructive check-ins, upward feedback, and manager notes."
      items={[
        { id: "1", title: "Continuous Praise for Team Leadership", subtitle: "To: Sanya Kapoor · From: Priya Nair", status: "Public Badge", date: "Yesterday", metric: "Kudos Granted" },
      ]}
    />
  ),
});
