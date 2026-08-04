import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useGetCalendarEventsQuery } from "@/services/calendarApi";

export const Route = createFileRoute("/_authenticated/dashboard/manager/calendar")({
  component: ManagerCalendarPage,
});

function ManagerCalendarPage() {
  const { data: eventsRes, isLoading } = useGetCalendarEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const events = eventsRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Calendar & Schedule"
        description="View team leave schedules, project sprint milestones, and team meetings."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "Calendar" }]}
        backHref="/dashboard/manager"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading team calendar events...
        </div>
      ) : events.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Calendar className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No Upcoming Team Events</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Scheduled meetings, sprint reviews, and approved employee leaves will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id || e.title} className="glass-tile rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className={`grid size-9 place-items-center rounded-xl ${e.color} font-bold`}>
                  <Calendar className="size-4" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{e.title}</p>
                  <p className="text-muted-foreground">{e.date}</p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${e.color}`}>
                {e.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
