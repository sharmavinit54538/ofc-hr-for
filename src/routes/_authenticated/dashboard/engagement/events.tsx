import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { useGetEventsQuery } from "@/services/engagementApi";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/events")({
  component: EngagementEventsPage,
});

function EngagementEventsPage() {
  const { data: eventsRes, isLoading } = useGetEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const events = eventsRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Culture & Team Building Events"
        description="Team offsites, birthday parties, work anniversary celebrations, and annual galas."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Events" }]}
        backHref="/dashboard/engagement"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading culture events...
        </div>
      ) : events.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Team Events Scheduled</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((evt) => (
            <div key={evt.id} className="glass-tile space-y-2 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{evt.title}</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{evt.category}</span>
              </div>
              <p className="text-xs text-muted-foreground">{evt.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
