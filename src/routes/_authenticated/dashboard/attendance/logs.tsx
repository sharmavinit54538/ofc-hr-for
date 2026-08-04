import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListAttendanceLogsQuery,
  useGetAttendanceStatsQuery,
  useCreateManualPunchLogMutation,
} from "@/services/attendanceApi";
import { useListEmployeesQuery } from "@/services/employeesApi";
import { toast } from "sonner";
import {
  Clock,
  Search,
  Plus,
  RefreshCw,
  AlertTriangle,
  Inbox,
  UserCheck,
  Building,
  Laptop,
  AlertCircle,
  Calendar,
  Filter,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/attendance/logs")({
  component: AttendanceLogsPage,
});

function AttendanceLogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Form State
  const [selectedUserId, setSelectedUserId] = useState("");
  const [punchDate, setPunchDate] = useState(new Date().toISOString().slice(0, 10));
  const [clockIn, setClockIn] = useState("09:00 AM");
  const [clockOut, setClockOut] = useState("06:00 PM");
  const [punchStatus, setPunchStatus] = useState("Present");
  const [workMode, setWorkMode] = useState("On-Site (HQ)");

  // API Hooks
  const { data: logsRes, isLoading, isError, refetch } = useListAttendanceLogsQuery({
    page,
    page_size: 15,
    search: search || undefined,
    status: statusFilter || undefined,
    date: dateFilter || undefined,
  });

  const { data: statsRes } = useGetAttendanceStatsQuery();
  const { data: employeesRes } = useListEmployeesQuery();

  const [createManualPunch, { isLoading: isSubmitting }] = useCreateManualPunchLogMutation();

  const logs = logsRes?.data?.items ?? [];
  const totalPages = logsRes?.data?.total_pages ?? 1;
  const stats = statsRes?.data;
  const employees = employeesRes?.data?.items ?? [];

  const handleManualPunchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select an employee.");
      return;
    }

    try {
      await createManualPunch({
        user_id: selectedUserId,
        date: punchDate,
        clock_in: clockIn,
        clock_out: clockOut,
        status: punchStatus,
        work_mode: workMode,
      }).unwrap();

      toast.success("Manual punch log recorded successfully.");
      setIsManualModalOpen(false);
      setSelectedUserId("");
    } catch {
      toast.error("Failed to create manual punch log.");
    }
  };

  const getStatusBadge = (statusStr: string) => {
    const s = statusStr.toLowerCase();
    if (s.includes("late")) {
      return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">Late</span>;
    }
    if (s.includes("wfh") || s.includes("remote")) {
      return <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-500">WFH / Remote</span>;
    }
    if (s.includes("absent")) {
      return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-500">Absent</span>;
    }
    return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Present</span>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Punch Logs & Biometrics"
        description="Real-time employee clock-in records, biometric telemetry, break logs, and attendance audit feeds from PostgreSQL."
        breadcrumbs={[
          { label: "Attendance", href: "/dashboard/attendance" },
          { label: "Punch Logs" },
        ]}
        actions={
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Add Manual Punch
          </button>
        }
      />

      {/* ── Summary Stats Telemetry Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile rounded-2xl p-4 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Punches Today</span>
            <UserCheck className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {stats?.total_present_today ?? 0}
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Active present employees</p>
        </div>

        <div className="glass-tile rounded-2xl p-4 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">On-Site (HQ)</span>
            <Building className="size-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {stats?.on_site_count ?? 0}
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Biometric & office gateway</p>
        </div>

        <div className="glass-tile rounded-2xl p-4 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Remote (WFH)</span>
            <Laptop className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {stats?.remote_wfh_count ?? 0}
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Web & mobile app punches</p>
        </div>

        <div className="glass-tile rounded-2xl p-4 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Late Arrivals</span>
            <AlertCircle className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {stats?.late_arrivals ?? 0}
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Punched past grace period</p>
        </div>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search logs by employee name or email..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="WFH">WFH / Remote</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Content Area / Table ── */}
      {isLoading ? (
        <div className="glass-tile h-64 animate-pulse rounded-2xl p-6" />
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load attendance logs
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching punch records from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No punch logs found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No employee punch records exist in PostgreSQL for the selected criteria.
          </p>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Add Manual Punch
          </button>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card/80 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5 pl-5">Employee</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Punch In</th>
                  <th className="p-3.5">Punch Out</th>
                  <th className="p-3.5">Total Hours</th>
                  <th className="p-3.5">Work Mode</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-card/40 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-foreground">{log.employee_name}</div>
                      <div className="text-[11px] text-muted-foreground">{log.employee_email || log.department}</div>
                    </td>
                    <td className="p-3.5 font-mono text-muted-foreground">{log.date}</td>
                    <td className="p-3.5 font-semibold text-emerald-500">{log.clock_in}</td>
                    <td className="p-3.5 font-semibold text-amber-500">{log.clock_out}</td>
                    <td className="p-3.5 font-bold text-foreground">{log.total_hours} hrs</td>
                    <td className="p-3.5 text-muted-foreground">{log.work_mode}</td>
                    <td className="p-3.5 pr-5">{getStatusBadge(log.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
              <span>Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-input px-3 py-1 text-xs font-semibold disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-input px-3 py-1 text-xs font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Manual Punch Modal ── */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Record Manual Attendance Punch
            </h3>
            <form onSubmit={handleManualPunchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Select Employee</label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Select Employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.user_id || emp.id}>
                      {emp.first_name} {emp.last_name} ({emp.department_name || "Employee"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={punchDate}
                    onChange={(e) => setPunchDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Status</label>
                  <select
                    value={punchStatus}
                    onChange={(e) => setPunchStatus(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="WFH">WFH / Remote</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Clock In Time</label>
                  <input
                    type="text"
                    required
                    value={clockIn}
                    onChange={(e) => setClockIn(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Clock Out Time</label>
                  <input
                    type="text"
                    required
                    value={clockOut}
                    onChange={(e) => setClockOut(e.target.value)}
                    placeholder="06:00 PM"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="On-Site (HQ)">On-Site (HQ)</option>
                  <option value="Remote (VPN)">Remote (VPN)</option>
                  <option value="Field Work">Field Work</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isSubmitting ? "Saving..." : "Record Punch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
