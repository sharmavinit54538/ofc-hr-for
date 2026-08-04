import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useGetHolidaysQuery } from "@/services/calendarApi";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/leave/calendar")({
  component: LeaveCalendarPage,
});

function LeaveCalendarPage() {
  const { data: holidayRes, isLoading } = useGetHolidaysQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const items = holidayRes?.data ?? [];

  if (isLoading) {
    return (
      <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-primary" />
        Loading company statutory holiday schedule...
      </div>
    );
  }

  return (
    <GenericSubModuleView
      href="/dashboard/leave/calendar"
      parentHref="/dashboard/leave"
      parentLabel="Leave"
      title="Company Holiday Calendar (2026)"
      description="Published statutory holidays, optional festival leaves, and regional office overrides."
      items={items}
    />
  );
}
