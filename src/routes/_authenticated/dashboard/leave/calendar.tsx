import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/leave/calendar")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/leave/calendar"
      parentHref="/dashboard/leave"
      parentLabel="Leave"
      title="Company Holiday Calendar (2026)"
      description="Published statutory holidays, optional festival leaves, and regional office overrides."
      items={[
        { id: "1", title: "Independence Day", subtitle: "National Holiday · All India Campuses", status: "Mandatory Holiday", date: "Friday, Aug 15, 2026", metric: "Paid Holiday" },
        { id: "2", title: "Mahatma Gandhi Jayanti", subtitle: "National Holiday · All India Campuses", status: "Mandatory Holiday", date: "Friday, Oct 2, 2026", metric: "Paid Holiday" },
      ]}
    />
  ),
});
