import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/interviews")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/recruitment/interviews"
      parentHref="/dashboard/recruitment"
      parentLabel="Recruitment"
      title="Interview Schedules & Scorecards"
      description="Scheduled interview rounds, panel evaluations, and AI interview summaries."
      items={[
        { id: "1", title: "Technical Architecture Round", subtitle: "Candidate: Rohan Malhotra · Panel: Sanya K.", status: "Today at 14:00", date: "Zoom Meeting", metric: "Round 2 of 3" },
        { id: "2", title: "Culture & Leadership Fit", subtitle: "Candidate: Kavita Rao · Panel: Aarav M.", status: "Completed", date: "Yesterday", metric: "Approved" },
      ]}
    />
  ),
});
