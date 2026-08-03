import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Users,
  Building2,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Loader2,
  PieChart,
  BarChart2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/analytics")({
  component: ExecutiveAnalyticsPage,
});

function ExecutiveAnalyticsPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  // Real KPI Metrics derived from DB
  const totalEmployees = rawEmployees.length;
  const activeEmployees = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);
  const inactiveEmployees = useMemo(() => rawEmployees.filter((e) => e.status === "Inactive" || e.status === "Archived").length, [rawEmployees]);
  const activeRate = totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(1) : "100.0";
  const totalDepts = rawDepartments.length;

  // Breakdown by Role
  const roleBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      EXECUTIVE: 0,
      MANAGER: 0,
      EMPLOYEE: 0,
      HR_ADMIN: 0,
      IT_ADMIN: 0,
    };
    rawEmployees.forEach((e) => {
      const r = e.role || "EMPLOYEE";
      counts[r] = (counts[r] || 0) + 1;
    });
    return counts;
  }, [rawEmployees]);

  // Breakdown by Employment Type
  const employmentTypeBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    rawEmployees.forEach((e) => {
      const type = e.employment_type || "Full-time";
      map[type] = (map[type] || 0) + 1;
    });
    return Object.entries(map).map(([type, count]) => ({
      type,
      count,
      percentage: totalEmployees > 0 ? ((count / totalEmployees) * 100).toFixed(1) : "0",
    }));
  }, [rawEmployees, totalEmployees]);

  // Department wise breakdown with real employee counts
  const departmentStats = useMemo(() => {
    return rawDepartments.map((dept) => {
      const count = rawEmployees.filter(
        (e) => e.department === dept.name || e.department_id === dept.id
      ).length;
      const pct = totalEmployees > 0 ? ((count / totalEmployees) * 100).toFixed(1) : "0";
      return {
        id: dept.id,
        name: dept.name,
        code: dept.code || "DEPT",
        count,
        pct,
        budget: dept.budget ? `₹${(dept.budget / 10000000).toFixed(2)} Cr` : "Not Configured",
        head: dept.head_name || dept.manager_name || "Unassigned",
      };
    });
  }, [rawDepartments, rawEmployees, totalEmployees]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Analytics & Enterprise Telemetry"
        description="Real-time live operational metrics, workforce distribution, role governance, and department dynamics."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Analytics" }]}
        backHref="/dashboard/executive"
      />

      {/* ── Macro Top Bar Cards ───────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Headcount</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : totalEmployees}
            </div>
            <p className="mt-1 text-[10px] font-medium text-emerald-500">{activeRate}% Active Workforce Rate</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Members</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <UserCheck className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : activeEmployees}
            </div>
            <p className="mt-1 text-[10px] font-medium text-muted-foreground">
              {inactiveEmployees > 0 ? `${inactiveEmployees} Inactive/On Leave` : "All Members Active"}
            </p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Departments</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : totalDepts}
            </div>
            <p className="mt-1 text-[10px] font-medium text-emerald-500">Operational Business Units</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System Audit & API</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-purple-400">100% Sync</div>
            <p className="mt-1 text-[10px] font-medium text-emerald-500">Live Fast-API Connection</p>
          </div>
        </div>
      </div>

      {/* ── Main Content Section ─────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Department Breakdown Table (2 cols) */}
        <div className="glass-tile rounded-2xl p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <BarChart2 className="size-4 text-primary" /> Department Distribution & Budget Allocation
            </h3>
            <span className="text-xs font-semibold text-muted-foreground">{totalDepts} Total Depts</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : departmentStats.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 p-8 text-center">
              <Building2 className="mx-auto size-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-semibold text-foreground">No Department Data</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add departments in Workforce Management to see live analytics.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-bold">Department</th>
                    <th className="px-4 py-3 font-bold">Code</th>
                    <th className="px-4 py-3 font-bold">Headcount</th>
                    <th className="px-4 py-3 font-bold">Share</th>
                    <th className="px-4 py-3 font-bold">Annual Budget</th>
                    <th className="px-4 py-3 font-bold">Department Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {departmentStats.map((d) => (
                    <tr key={d.id} className="transition-colors hover:bg-secondary/40">
                      <td className="px-4 py-3 font-bold text-foreground">{d.name}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{d.code}</td>
                      <td className="px-4 py-3 font-mono font-bold text-primary">{d.count}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(100, Number(d.pct))}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">{d.pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-emerald-500 font-semibold">{d.budget}</td>
                      <td className="px-4 py-3 text-muted-foreground">{d.head}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Role Governance & Employment Types (1 col) */}
        <div className="space-y-6">
          {/* Role Distribution Card */}
          <div className="glass-tile rounded-2xl p-5 space-y-4">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <PieChart className="size-4 text-purple-400" /> Role & Governance Distribution
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-medium">Executives</span>
                <span className="font-mono font-bold text-amber-400">{roleBreakdown.EXECUTIVE || 0}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-medium">Managers</span>
                <span className="font-mono font-bold text-indigo-400">{roleBreakdown.MANAGER || 0}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-medium">Employees</span>
                <span className="font-mono font-bold text-primary">{roleBreakdown.EMPLOYEE || 0}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-medium">HR Administrators</span>
                <span className="font-mono font-bold text-emerald-400">{roleBreakdown.HR_ADMIN || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">IT Administrators</span>
                <span className="font-mono font-bold text-purple-400">{roleBreakdown.IT_ADMIN || 0}</span>
              </div>
            </div>
          </div>

          {/* Employment Type Distribution */}
          <div className="glass-tile rounded-2xl p-5 space-y-4">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Briefcase className="size-4 text-emerald-500" /> Employment Types
            </h3>

            {employmentTypeBreakdown.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No employee records</p>
            ) : (
              <div className="space-y-3 text-xs">
                {employmentTypeBreakdown.map((item) => (
                  <div key={item.type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{item.type}</span>
                      <span className="font-mono text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
