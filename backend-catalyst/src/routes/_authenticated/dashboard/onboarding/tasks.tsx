import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding/tasks")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/onboarding/tasks"
      parentHref="/dashboard/onboarding"
      parentLabel="Onboarding"
      title="Task Checklists & IT Dispatch"
      description="Workstation hardware dispatch, badge security access, and software license assignment."
      items={[
        { id: "1", title: "Dispatch MacBook Pro 16” M3", subtitle: "Assigned to IT Admin (Priya N.)", status: "In Transit", date: "FedEx Tracking #9401", metric: "ETA: Aug 12" },
        { id: "2", title: "Issue Smart Building Keycard", subtitle: "Assigned to Facilities Team", status: "Completed", date: "Done Yesterday", metric: "Badge #8820" },
      ]}
    />
  ),
});
