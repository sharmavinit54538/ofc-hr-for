import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  Palmtree,
  Wallet,
  FileText,
  Ticket,
  ArrowRight,
  CalendarCheck,
  TrendingUp,
  Megaphone,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  useGetTodayAttendanceQuery,
  useGetLeaveBalanceQuery,
  useGetLatestPayrollQuery,
  useGetEmployeeTicketsQuery,
  useGetEmployeeDocumentsQuery,
  useGetAttendanceSummaryQuery,
  useGetCompanyAnnouncementsQuery,
  useGetCompanyHolidaysQuery,
} from "@/services/employeeDashboardApi";

export const Route = createFileRoute("/_authenticated/dashboard/employee/")({
  component: EmployeeDashboardHome,
});

function EmployeeDashboardHome() {
  const user = useAuthStore((s) => s.user);

  const { data: todayAttRes, isLoading: isTodayAttLoading } = useGetTodayAttendanceQuery();
  const { data: leaveBalRes, isLoading: isLeaveBalLoading } = useGetLeaveBalanceQuery();
  const { data: payrollRes, isLoading: isPayrollLoading } = useGetLatestPayrollQuery();
  const { data: ticketsRes, isLoading: isTicketsLoading } = useGetEmployeeTicketsQuery();
  const { data: docsRes, isLoading: isDocsLoading } = useGetEmployeeDocumentsQuery();
  const { data: attSummaryRes, isLoading: isAttSummaryLoading } = useGetAttendanceSummaryQuery();
  const { data: annRes, isLoading: isAnnLoading } = useGetCompanyAnnouncementsQuery();
  const { data: holRes, isLoading: isHolLoading } = useGetCompanyHolidaysQuery();

  const todayAtt = todayAttRes?.data;
  const leaveBal = leaveBalRes?.data;
  const latestPayroll = payrollRes?.data;
  const tickets = ticketsRes?.data ?? [];
  const openTickets = tickets.filter((t) => t.status !== "Resolved" && t.status !== "Closed");
  const recentDocs = (docsRes?.data ?? []).slice(0, 3);
  const attSummary = attSummaryRes?.data;
  const announcements = annRes?.data ?? [];
  const holidays = (holRes?.data ?? []).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* ── Welcome Card ─────────────────────────────────────────── */}
      <div className="glass-tile relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              Welcome back, {user?.fullName?.split(" ")[0] ?? "Employee"}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground leading-relaxed sm:text-sm">
              {user?.jobTitle ?? "Software Engineer"} · {user?.department ?? "Engineering"} ·{" "}
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Link
            to={"/dashboard/employee/attendance" as any}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Clock className="size-4" /> Clock In / Out
          </Link>
        </div>
        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 size-60 rounded-full bg-gradient-brand opacity-5 blur-3xl" />
      </div>

      {/* ── Quick Stats Grid ──────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Attendance */}
        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Today's Attendance
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <CalendarCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            {isTodayAttLoading ? (
              <div className="h-7 w-24 animate-pulse rounded bg-secondary/60 my-1" />
            ) : (
              <div className="font-display text-2xl font-bold text-foreground">
                {todayAtt?.avg_clock_in ?? "09:02 AM"}
              </div>
            )}
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
              Clocked in · {todayAtt?.this_month_hours ?? "164h 20m"} this month
            </p>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Leave Balance
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <Palmtree className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            {isLeaveBalLoading ? (
              <div className="h-7 w-24 animate-pulse rounded bg-secondary/60 my-1" />
            ) : (
              <div className="font-display text-2xl font-bold text-foreground">
                {leaveBal?.total_remaining ?? 28} days
              </div>
            )}
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
              CL: {leaveBal?.casual_leave ?? 10} · SL: {leaveBal?.sick_leave ?? 8} · EL:{" "}
              {leaveBal?.earned_leave ?? 10}
            </p>
          </div>
        </div>

        {/* Net Pay */}
        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Latest Net Pay
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Wallet className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            {isPayrollLoading ? (
              <div className="h-7 w-24 animate-pulse rounded bg-secondary/60 my-1" />
            ) : (
              <div className="font-display text-2xl font-bold text-foreground">
                ₹{(latestPayroll?.net_pay ?? 63900).toLocaleString("en-IN")}
              </div>
            )}
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
              {latestPayroll?.month ?? "July"} {latestPayroll?.year ?? 2026} ·{" "}
              {latestPayroll?.status ?? "Paid"}
            </p>
          </div>
        </div>

        {/* Helpdesk */}
        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Open Tickets
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
              <Ticket className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            {isTicketsLoading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-secondary/60 my-1" />
            ) : (
              <div className="font-display text-2xl font-bold text-foreground">
                {openTickets.length}
              </div>
            )}
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground truncate">
              {openTickets[0]
                ? `Latest: ${openTickets[0].subject.substring(0, 30)}...`
                : "No open tickets"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column — 2 cols wide */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Documents */}
          <div className="glass-tile rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <FileText className="size-4 text-primary" /> Recent Documents
              </h3>
              <Link
                to={"/dashboard/employee/documents" as any}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {isDocsLoading ? (
                <div className="space-y-2 py-2">
                  <div className="h-10 w-full animate-pulse rounded-xl bg-secondary/60" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-secondary/60" />
                </div>
              ) : recentDocs.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  No verified documents found.
                </p>
              ) : (
                recentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{doc.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {doc.category} · {doc.file_size}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        doc.status === "Verified"
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                          : "border border-amber-500/20 bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {doc.status === "Verified" ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <AlertCircle className="size-3" />
                      )}
                      {doc.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="glass-tile rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-500" /> Attendance Summary (This Month)
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {isAttSummaryLoading ? (
                <div className="sm:col-span-4 h-14 animate-pulse rounded-xl bg-secondary/60" />
              ) : (
                [
                  {
                    label: "Present",
                    value: attSummary?.present ?? 18,
                    color: "text-emerald-500 bg-emerald-500/10",
                  },
                  {
                    label: "Absent",
                    value: attSummary?.absent ?? 1,
                    color: "text-rose-500 bg-rose-500/10",
                  },
                  {
                    label: "WFH",
                    value: attSummary?.wfh ?? 2,
                    color: "text-sky-500 bg-sky-500/10",
                  },
                  {
                    label: "Half Day",
                    value: attSummary?.half_day ?? 1,
                    color: "text-amber-500 bg-amber-500/10",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border/50 bg-card/40 p-3 text-center"
                  >
                    <div
                      className={`mx-auto mb-1.5 flex size-8 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <span className="font-display text-sm font-bold">{item.value}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Company Announcements */}
          <div className="glass-tile rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-4">
              <Megaphone className="size-4 text-amber-500" /> Announcements
            </h3>
            <div className="space-y-3">
              {isAnnLoading ? (
                <div className="space-y-2 py-2">
                  <div className="h-14 w-full animate-pulse rounded-xl bg-secondary/60" />
                  <div className="h-14 w-full animate-pulse rounded-xl bg-secondary/60" />
                </div>
              ) : announcements.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  No company announcements.
                </p>
              ) : (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="rounded-xl border border-border/50 bg-card/40 p-3 text-xs space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      {ann.priority === "important" && (
                        <span className="inline-flex rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold text-rose-500 border border-rose-500/20">
                          Important
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{ann.date}</span>
                    </div>
                    <p className="font-bold text-foreground">{ann.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {ann.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="glass-tile rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-4">
              <CalendarDays className="size-4 text-purple-500" /> Upcoming Holidays
            </h3>
            <div className="space-y-2">
              {isHolLoading ? (
                <div className="space-y-2 py-2">
                  <div className="h-10 w-full animate-pulse rounded-xl bg-secondary/60" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-secondary/60" />
                </div>
              ) : holidays.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  No upcoming holidays.
                </p>
              ) : (
                holidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-foreground">{holiday.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {holiday.day}, {holiday.date}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                      {holiday.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
