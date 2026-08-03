import { useState, useMemo } from "react";
import { Users, UserCheck, Clock, Calendar, ShieldCheck, AlertCircle, FileText, CheckCircle2, TrendingUp, ChevronRight } from "lucide-react";
import type { Employee } from "@/types/employee";
import { computeEmployeeHierarchyInfo } from "@/utils/hierarchy";

export function ManagerAnalyticsView({
  employees,
  onSelectEmployee,
}: {
  employees: Employee[];
  onSelectEmployee?: (emp: Employee) => void;
}) {
  // Find all employees who have reportees or role MANAGER/EXECUTIVE
  const managers = useMemo(() => {
    return employees.filter((emp) => {
      if (emp.role === "MANAGER" || emp.role === "EXECUTIVE" || emp.role === "HR_ADMIN") return true;
      const hasReports = employees.some(
        (e) =>
          e.reporting_manager_id === emp.id ||
          (e.reporting_manager && emp.full_name && e.reporting_manager.trim().toLowerCase() === emp.full_name.trim().toLowerCase()),
      );
      return hasReports;
    });
  }, [employees]);

  const [selectedManagerId, setSelectedManagerId] = useState<string>(
    managers[0]?.id ?? employees[0]?.id ?? "",
  );

  const currentManager = useMemo(
    () => employees.find((e) => e.id === selectedManagerId) ?? managers[0] ?? employees[0],
    [employees, selectedManagerId, managers],
  );

  const managerInfo = useMemo(() => {
    if (!currentManager) return null;
    return computeEmployeeHierarchyInfo(currentManager, employees);
  }, [currentManager, employees]);

  if (!currentManager || !managerInfo) {
    return (
      <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl">
        <Users className="size-10 text-muted-foreground/60" />
        <h3 className="font-display text-base font-bold text-foreground">No Manager Telemetry Available</h3>
        <p className="text-xs text-muted-foreground mt-1">Assign reporting managers to employees to unlock team hierarchy analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Manager Selector Header Bar ────────────────────────── */}
      <div className="glass-tile flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand font-display text-base font-bold text-primary-foreground shadow-glow">
            {currentManager.full_name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-foreground">
                {currentManager.full_name}
              </h3>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                Level {managerInfo.level} Manager
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {currentManager.job_title} · {currentManager.department || "Leadership"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground">Select Manager:</label>
          <select
            value={selectedManagerId}
            onChange={(e) => setSelectedManagerId(e.target.value)}
            className="rounded-xl border border-input bg-card/80 px-3 py-2 text-xs font-semibold outline-none cursor-pointer focus:border-ring focus:shadow-glow"
          >
            {managers.map((m) => (
              <option key={m.id} value={m.id} className="bg-card text-foreground">
                {m.full_name} ({m.department || "General"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Metrics Cards Grid ──────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile flex flex-col justify-between rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Total Team Span</span>
            <Users className="size-4 text-primary" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {managerInfo.teamSize} <span className="text-xs text-muted-foreground font-normal">Members</span>
          </p>
          <p className="text-[11px] text-muted-foreground">Direct + Indirect Reporting Chain</p>
        </div>

        <div className="glass-tile flex flex-col justify-between rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Direct Reports</span>
            <UserCheck className="size-4 text-emerald-500" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {managerInfo.directReports.length} <span className="text-xs text-muted-foreground font-normal">Directs</span>
          </p>
          <p className="text-[11px] text-emerald-500 font-semibold">100% Active Status</p>
        </div>

        <div className="glass-tile flex flex-col justify-between rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Pending Approvals</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            2 <span className="text-xs text-muted-foreground font-normal">Requests</span>
          </p>
          <p className="text-[11px] text-amber-500 font-semibold">1 Leave, 1 Expense</p>
        </div>

        <div className="glass-tile flex flex-col justify-between rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Attendance Rate</span>
            <TrendingUp className="size-4 text-indigo-500" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            98.4%
          </p>
          <p className="text-[11px] text-indigo-400 font-semibold">Team On-Track</p>
        </div>
      </div>

      {/* ── Direct Reports Table ────────────────────────────────── */}
      <div className="glass-tile rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display text-base font-bold text-foreground">
              Direct Reportees Management
            </h4>
            <p className="text-xs text-muted-foreground">
              Manage reporting structure, approvals, and performance for {currentManager.full_name}'s direct team.
            </p>
          </div>
        </div>

        {managerInfo.directReports.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic">
            This manager currently has no direct reportees assigned.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase text-muted-foreground font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Work Mode</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {managerInfo.directReports.map((emp) => (
                  <tr key={emp.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-brand font-display font-bold text-primary-foreground text-xs shadow-glow">
                          {emp.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{emp.full_name}</p>
                          <p className="text-[10px] text-muted-foreground">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">{emp.job_title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{emp.department || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                        <span className="size-1.5 rounded-full bg-emerald-500" /> Active
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {emp.work_mode || "Hybrid"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectEmployee?.(emp)}
                        className="inline-flex items-center gap-1 rounded-lg border border-input bg-card/60 px-2.5 py-1 text-[11px] font-semibold hover:bg-secondary transition-colors"
                      >
                        View Hierarchy <ChevronRight className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
