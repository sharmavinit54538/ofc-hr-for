import { createFileRoute } from "@tanstack/react-router";
import { Clock, LogIn, LogOut, CalendarCheck, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetTodayAttendanceQuery,
  useClockInMutation,
  useClockOutMutation,
  useGetAttendanceHistoryQuery,
  useGetAttendanceSummaryQuery,
} from "@/services/employeeDashboardApi";

export const Route = createFileRoute("/_authenticated/dashboard/employee/attendance")({
  component: EmployeeAttendancePage,
});

function EmployeeAttendancePage() {
  const { data: todayRes, isLoading: isTodayLoading } = useGetTodayAttendanceQuery();
  const { data: summaryRes, isLoading: isSummaryLoading } = useGetAttendanceSummaryQuery();
  const { data: historyRes, isLoading: isHistoryLoading } = useGetAttendanceHistoryQuery();

  const [clockIn, { isLoading: isClockingIn }] = useClockInMutation();
  const [clockOut, { isLoading: isClockingOut }] = useClockOutMutation();

  const todayAtt = todayRes?.data;
  const summary = summaryRes?.data;
  const history = historyRes?.data ?? [];

  const isClockedIn = todayAtt?.clocked_in ?? false;
  const clockInTime = todayAtt?.clock_in_time ?? "—";
  const clockOutTime = todayAtt?.clock_out_time ?? "—";
  const isActionLoading = isClockingIn || isClockingOut;

  const handleClockToggle = async () => {
    try {
      if (isClockedIn) {
        const res = await clockOut().unwrap();
        toast.success("Clocked Out", {
          description: res.message || "Clock out recorded successfully.",
        });
      } else {
        const res = await clockIn().unwrap();
        toast.success("Clocked In", {
          description: res.message || "Your attendance has been recorded.",
        });
      }
    } catch (err: any) {
      toast.error("Attendance Action Failed", {
        description: err?.data?.message || "Something went wrong while recording attendance.",
      });
    }
  };

  const statusColors: Record<string, string> = {
    Present: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    Absent: "border-rose-500/20 bg-rose-500/10 text-rose-500",
    "Half Day": "border-amber-500/20 bg-amber-500/10 text-amber-500",
    Weekend: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
    Holiday: "border-purple-500/20 bg-purple-500/10 text-purple-500",
    WFH: "border-sky-500/20 bg-sky-500/10 text-sky-500",
  };

  return (
    <div className="space-y-6">
      {/* Clock In/Out Card */}
      <div className="glass-tile rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Attendance
            </h1>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="rounded-xl border border-border/50 bg-card/40 px-4 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Clock In</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {isTodayLoading ? "..." : clockInTime}
                </p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/40 px-4 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Clock Out</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {isTodayLoading ? "..." : clockOutTime}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClockToggle}
            disabled={isActionLoading || isTodayLoading}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-glow transition-all hover:shadow-glow-lg disabled:opacity-50 ${
              isClockedIn
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-gradient-brand text-primary-foreground"
            }`}
          >
            {isActionLoading ? (
              <><Loader2 className="size-5 animate-spin" /> Processing...</>
            ) : isClockedIn ? (
              <><LogOut className="size-5" /> Clock Out</>
            ) : (
              <><LogIn className="size-5" /> Clock In</>
            )}
          </button>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Present", value: isSummaryLoading ? "..." : (summary?.present ?? 0), color: "text-emerald-500 bg-emerald-500/10", icon: CalendarCheck },
          { label: "Absent", value: isSummaryLoading ? "..." : (summary?.absent ?? 0), color: "text-rose-500 bg-rose-500/10", icon: Clock },
          { label: "On-Time Rate", value: isSummaryLoading ? "..." : (summary?.on_time_rate ?? "100%"), color: "text-primary bg-primary/10", icon: TrendingUp },
          { label: "Total Hours", value: isSummaryLoading ? "..." : (summary?.total_hours ?? "0h"), color: "text-amber-500 bg-amber-500/10", icon: Clock },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-tile rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                <div className={`flex size-8 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-2 font-display text-2xl font-bold text-foreground">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Attendance Log */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60">
          <h3 className="font-display text-base font-bold text-foreground">Attendance Log</h3>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-bold">Date</th>
                <th className="px-5 py-3 font-bold">Day</th>
                <th className="px-5 py-3 font-bold">Clock In</th>
                <th className="px-5 py-3 font-bold">Clock Out</th>
                <th className="px-5 py-3 font-bold">Total Hours</th>
                <th className="px-5 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isHistoryLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-5 animate-spin mb-2 text-primary" />
                    Loading attendance records...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    No attendance records found. Click "Clock In" to record your first entry today!
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id || record.date} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-3 font-mono font-semibold text-foreground">{record.date}</td>
                    <td className="px-5 py-3 text-muted-foreground">{record.day}</td>
                    <td className="px-5 py-3 font-mono text-foreground">{record.clock_in}</td>
                    <td className="px-5 py-3 font-mono text-foreground">{record.clock_out}</td>
                    <td className="px-5 py-3 font-semibold text-foreground">{record.total_hours}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusColors[record.status] ?? "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
