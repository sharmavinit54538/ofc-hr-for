import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Calendar as CalendarIcon, Building2, ShieldCheck, Users, Megaphone, PartyPopper, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";
import { useGetCompanyHolidaysQuery, useGetCompanyAnnouncementsQuery } from "@/services/employeeDashboardApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/calendar")({
  component: ExecutiveCalendarPage,
});

interface CombinedCalendarEvent {
  id: string;
  title: string;
  date: string;
  category: "Official Holiday" | "Company Announcement" | "Workforce Onboarding" | "Department Milestone";
  description: string;
  icon: typeof CalendarIcon;
  badgeStyle: string;
}

function ExecutiveCalendarPage() {
  const user = useAuthStore((s) => s.user);

  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();
  const { data: holidaysRes, isLoading: isLoadingHolidays } = useGetCompanyHolidaysQuery();
  const { data: announcementsRes, isLoading: isLoadingAnnouncements } = useGetCompanyAnnouncementsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);
  const rawHolidays = useMemo(() => holidaysRes?.data ?? [], [holidaysRes]);
  const rawAnnouncements = useMemo(() => announcementsRes?.data ?? [], [announcementsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts || isLoadingHolidays || isLoadingAnnouncements;
  const activeEmployees = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);
  const totalDepts = rawDepartments.length;

  // Combine real backend data streams into unified live operational calendar schedule
  const calendarEvents = useMemo(() => {
    const events: CombinedCalendarEvent[] = [];

    // 1. Live official company holidays
    rawHolidays.forEach((h) => {
      events.push({
        id: `HOL-${h.id}`,
        title: h.name,
        date: h.date,
        category: "Official Holiday",
        description: `Official Organization Holiday (${h.day || h.type || "Mandatory"})`,
        icon: PartyPopper,
        badgeStyle: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
      });
    });

    // 2. Live company announcements
    rawAnnouncements.forEach((a) => {
      events.push({
        id: `ANN-${a.id}`,
        title: a.title,
        date: a.date || "Active",
        category: "Company Announcement",
        description: a.body,
        icon: Megaphone,
        badgeStyle: "border-purple-500/20 bg-purple-500/10 text-purple-400",
      });
    });

    // 3. Employee joining / onboarding milestones
    rawEmployees
      .filter((e) => e.joining_date)
      .slice(0, 5)
      .forEach((e) => {
        events.push({
          id: `EMP-${e.id}`,
          title: `Onboarding: ${e.full_name}`,
          date: e.joining_date || "Recent",
          category: "Workforce Onboarding",
          description: `${e.job_title || "Team Member"} joining ${e.department || "Organization"}`,
          icon: Users,
          badgeStyle: "border-blue-500/20 bg-blue-500/10 text-blue-400",
        });
      });

    return events;
  }, [rawHolidays, rawAnnouncements, rawEmployees]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Calendar & Operational Schedule"
        description="Real-time schedule of company holidays, organizational announcements, workforce milestones, and department synchronization."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Calendar" }]}
        backHref="/dashboard/executive"
      />

      {/* ── Executive Header Banner ─────────────────────────────────── */}
      <div className="glass-tile rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <CalendarIcon className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Executive Office Operational Telemetry</h3>
              <p className="text-xs text-muted-foreground">Logged-in Executive: {user?.fullName || "Executive Leader"} ({user?.email})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="size-3.5" /> Live Backend Connected
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div className="rounded-xl border border-border/60 bg-card/40 p-4 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" /> Active Workspace Telemetry
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Synchronized
              </span>
            </div>
            <p className="text-muted-foreground">
              Tracking {activeEmployees} active workforce member(s) across {totalDepts} business department(s).
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/40 p-4 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-purple-400" /> Executive RBAC Security
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                JWT Active
              </span>
            </div>
            <p className="text-muted-foreground">
              Role-based authorization token active for organization data access.
            </p>
          </div>
        </div>
      </div>

      {/* ── Live Calendar Events List ─────────────────────────────────── */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-purple-400" /> Operational Events & Holidays Schedule
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : calendarEvents.length > 0 ? (
          <div className="space-y-3">
            {calendarEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div key={evt.id} className="glass-tile rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover-lift">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5 sm:mt-0">
                      <Icon className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-sm font-bold text-foreground">{evt.title}</span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${evt.badgeStyle}`}>
                          {evt.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{evt.description}</p>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-semibold text-purple-400 shrink-0 self-end sm:self-center">
                    {evt.date}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-tile rounded-2xl p-8 text-center space-y-3 flex flex-col items-center justify-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <CalendarIcon className="size-6" />
            </div>
            <h3 className="font-display text-base font-bold text-foreground">No Upcoming Operational Events</h3>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              No official holidays, company announcements, or onboarding milestones found in the live database schedule.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
