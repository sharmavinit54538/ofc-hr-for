import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/candidates")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/recruitment/candidates"
      parentHref="/dashboard/recruitment"
      parentLabel="Recruitment"
      title="Candidate Pipeline"
      description="Talent pool database, resume scorecards, and candidate status tracking."
      items={[
        { id: "1", title: "Rohan Malhotra", subtitle: "Applied for Senior Staff AI Engineer", status: "Interview Stage", date: "Applied Yesterday", metric: "Score: 94/100" },
        { id: "2", title: "Kavita Rao", subtitle: "Applied for HR Business Partner", status: "Offer Sent", date: "Applied 4 days ago", metric: "Score: 98/100" },
        { id: "3", title: "David Chen", subtitle: "Applied for DevOps Tech Lead", status: "Screening", date: "Applied 2 days ago", metric: "Score: 88/100" },
      ]}
    />
  ),
});
