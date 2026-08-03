import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/leave/requests")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/leave/requests"
      parentHref="/dashboard/leave"
      parentLabel="Leave"
      title="Leave Applications & Requests"
      description="Employee time-off requests, medical certificates, and manager action pipeline."
      items={[
        { id: "1", title: "Privilege Leave (4 Days)", subtitle: "Applicant: Priya Nair · Aug 18 – Aug 21", status: "Pending Manager Signoff", date: "Applied Today", metric: "Paid PTO" },
        { id: "2", title: "Casual Leave (1 Day)", subtitle: "Applicant: Rahul Verma · Aug 10", status: "Approved", date: "Approved Yesterady", metric: "Paid PTO" },
      ]}
    />
  ),
});
