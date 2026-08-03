import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/attendance/overtime")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/attendance/overtime"
      parentHref="/dashboard/attendance"
      parentLabel="Attendance"
      title="Overtime Claims & Approvals"
      description="Extra hours calculation, manager approvals, and payroll sync."
      items={[
        { id: "1", title: "Weekend Deployment Overtime", subtitle: "Applicant: Sanya Kapoor · 6.5 Hours", status: "Pending Manager Approval", date: "Claimed Aug 1", metric: "1.5x Rate" },
        { id: "2", title: "Quarterly Audit Overtime", subtitle: "Applicant: Rahul Verma · 4.0 Hours", status: "Approved", date: "Approved Yesterday", metric: "1.5x Rate" },
      ]}
    />
  ),
});
