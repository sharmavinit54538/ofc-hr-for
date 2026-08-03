import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/attendance/logs")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/attendance/logs"
      parentHref="/dashboard/attendance"
      parentLabel="Attendance"
      title="Daily Punch Logs & Biometrics"
      description="Live biometric feed, punch-in timestamp records, and break time tracking."
      items={[
        { id: "1", title: "Aarav Mehta", subtitle: "Punch In: 08:12 IST · Punch Out: --", status: "On-Site (HQ)", date: "Today", metric: "9h 12m Elapsed" },
        { id: "2", title: "Priya Nair", subtitle: "Punch In: 08:45 IST · Punch Out: --", status: "Remote (VPN)", date: "Today", metric: "8h 39m Elapsed" },
        { id: "3", title: "Rahul Verma", subtitle: "Punch In: 09:01 IST · Punch Out: --", status: "On-Site (Gurugram)", date: "Today", metric: "8h 23m Elapsed" },
      ]}
    />
  ),
});
