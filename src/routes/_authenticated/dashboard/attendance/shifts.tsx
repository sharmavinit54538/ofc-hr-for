import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/attendance/shifts")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/attendance/shifts"
      parentHref="/dashboard/attendance"
      parentLabel="Attendance"
      title="Shift Patterns & Schedules"
      description="Rotational shift planning, weekend coverage, and 24/7 IT operations rosters."
      items={[
        { id: "1", title: "General Day Shift (G1)", subtitle: "09:00 IST – 18:00 IST · Mon to Fri", status: "Active Pattern", date: "840 Employees Assigned", metric: "Standard Shift" },
        { id: "2", title: "EMEA Support Shift (S2)", subtitle: "13:30 IST – 22:30 IST · Mon to Fri", status: "Active Pattern", date: "120 Employees Assigned", metric: "Overtime Allowance" },
      ]}
    />
  ),
});
