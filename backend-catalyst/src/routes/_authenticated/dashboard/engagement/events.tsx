import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/events")({
  component: EngagementEventsPage,
});

function EngagementEventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Culture & Team Building Events"
        description="Team offsites, birthday parties, work anniversary celebrations, and annual galas."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Events" }]}
        backHref="/dashboard/engagement"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">12 Culture & Social Events Scheduled for H2 2026.</div>
    </div>
  );
}
