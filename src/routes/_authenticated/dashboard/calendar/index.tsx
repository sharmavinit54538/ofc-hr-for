import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Loader2, Inbox, MapPin, Tag } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useGetCalendarEventsQuery, useCreateCalendarEventMutation } from "@/services/calendarApi";

export const Route = createFileRoute("/_authenticated/dashboard/calendar/")({
  component: MainCompanyCalendarPage,
});

function MainCompanyCalendarPage() {
  const [selectedType, setSelectedType] = useState<string>("");
  const { data: eventsRes, isLoading } = useGetCalendarEventsQuery(selectedType, {
    refetchOnMountOrArgChange: true,
  });

  const [createEvent] = useCreateCalendarEventMutation();
  const events = eventsRes?.data ?? [];

  const handleAddEvent = async () => {
    try {
      await createEvent({
        title: "Company All-Hands Town Hall",
        type: "Meeting",
        date: "2026-08-20",
        color: "bg-primary/10 text-primary",
        description: "Quarterly all-hands update and executive Q&A session.",
        location: "Main Auditorium & Virtual Stream",
      }).unwrap();
      toast.success("New Calendar Event Scheduled!");
    } catch {
      toast.error("Failed to schedule event.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Calendar & Master Schedule"
        description="Official company holidays, team meetings, project milestones, and statutory leave schedules."
        breadcrumbs={[{ label: "Company Calendar" }]}
        actions={
          <button
            onClick={handleAddEvent}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Schedule Event
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="glass-tile flex flex-wrap items-center gap-2 rounded-2xl p-4">
        {["", "Holiday", "Meeting", "Sprint Review", "Governance", "Leave"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedType(cat)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedType === cat
                ? "bg-gradient-brand text-primary-foreground shadow-glow"
                : "bg-card/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {cat === "" ? "All Events" : cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading company calendar schedule...
        </div>
      ) : events.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Scheduled Events Found</p>
          <p className="text-[11px] max-w-xs text-muted-foreground">
            Click "Schedule Event" above to add new company meetings or holidays.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((evt) => (
            <div key={evt.id} className="glass-tile space-y-3 rounded-2xl p-5 hover-lift transition-all">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${evt.color}`}>
                  <Tag className="size-3" /> {evt.type}
                </span>
                <span className="font-mono text-xs font-semibold text-muted-foreground">{evt.date}</span>
              </div>
              <h3 className="font-display text-base font-bold text-foreground">{evt.title}</h3>
              {evt.description && <p className="text-xs text-muted-foreground">{evt.description}</p>}
              {evt.location && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                  <MapPin className="size-3 text-primary" /> {evt.location}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
