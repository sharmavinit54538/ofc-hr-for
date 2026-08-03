import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/manager/calendar")({
  component: ManagerCalendarPage,
});

interface CalendarEventItem {
  title: string;
  type: string;
  date: string;
  color: string;
}

function ManagerCalendarPage() {
  const events: CalendarEventItem[] = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Calendar & Schedule"
        description="View team leave schedules, project sprint milestones, and team meetings."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "Calendar" }]}
        backHref="/dashboard/manager"
      />

      {events.length === 0 ? (
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
            <div key={e.title} className="glass-tile rounded-2xl p-4 flex items-center justify-between text-xs">
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
