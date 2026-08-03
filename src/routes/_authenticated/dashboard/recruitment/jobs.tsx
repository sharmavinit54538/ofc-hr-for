import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/jobs")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/recruitment/jobs"
      parentHref="/dashboard/recruitment"
      parentLabel="Recruitment"
      title="Job Requisitions"
      description="Active job openings, applicant pipelines, and hiring manager assignments."
      items={[
        { id: "1", title: "Senior Staff AI Engineer", subtitle: "Product Engineering · Full-time", status: "18 Applicants", date: "Posted 3 days ago", metric: "$140k - $180k" },
        { id: "2", title: "HR Business Partner", subtitle: "Human Resources · Full-time", status: "42 Applicants", date: "Posted 1 week ago", metric: "$95k - $120k" },
        { id: "3", title: "DevOps Tech Lead", subtitle: "IT & Security · Remote", status: "24 Applicants", date: "Posted 2 weeks ago", metric: "$130k - $160k" },
        { id: "4", title: "Product Marketing Manager", subtitle: "Growth · Full-time", status: "56 Applicants", date: "Posted 5 days ago", metric: "$110k - $135k" },
      ]}
    />
  ),
});
