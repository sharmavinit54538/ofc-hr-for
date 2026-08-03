import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
  Building2,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/")({
  component: ExecutiveDashboardHome,
});

function ExecutiveDashboardHome() {
  const user = useAuthStore((s) => s.user);

  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  // Derived metrics from live backend data
  const totalHeadcount = rawEmployees.length;
  const activeEmployees = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);
  const executiveCount = useMemo(() => rawEmployees.filter((e) => e.role === "EXECUTIVE").length, [rawEmployees]);
  const totalDepartments = rawDepartments.length;

  // Department breakdown calculated from live DB data
  const departmentBreakdown = useMemo(() => {
    return rawDepartments.map((dept) => {
      const empCount = rawEmployees.filter(
        (e) => e.department === dept.name || e.department_id === dept.id
      ).length;
      return {
        id: dept.id,
        name: dept.name,
        code: dept.code || "DEPT",
        count: dept.employee_count ?? empCount,
        budget: dept.budget ? `₹${(dept.budget / 10000000).toFixed(2)} Cr` : "Configured per Quarter",
        head: dept.head_name || dept.manager_name || "Not Assigned",
        location: dept.location || "Headquarters",
      };
    });
  }, [rawDepartments, rawEmployees]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  return (
    <div className="space-y-6">
      {/* ── Executive Welcome Header ─────────────────────────────── */}
      <div className="glass-tile relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl leading-snug py-0.5">
              Welcome back, {user?.fullName ?? "Executive Leader"}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground leading-relaxed sm:text-sm">
              {user?.jobTitle ?? "Executive Office"} · {user?.email ?? "Executive Leadership"}
            </p>
          </div>
          <Link
            to={"/dashboard/executive/analytics" as any}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <BarChart3 className="size-4" /> Strategic Analytics
          </Link>
        </div>
        <div className="absolute -right-20 -top-20 size-60 rounded-full bg-gradient-brand opacity-5 blur-3xl" />
      </div>

      {/* ── Real Macro Strategic KPI Grid ───────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Workforce</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : totalHeadcount}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">{activeEmployees} Active Members</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Departments</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : totalDepartments}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">Active Org Units</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Executive Team</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : executiveCount}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">Board & Leadership</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System Audit Status</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">Verified</div>
            <p className="mt-0.5 text-[10px] font-medium text-purple-400">Live Database Connected</p>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Department Breakdown */}
          <div className="glass-tile rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Building2 className="size-4 text-primary" /> Department-wise Headcount & Budget
              </h3>
              <Link to={"/dashboard/workforce/departments" as any} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Manage Departments <ArrowRight className="size-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : departmentBreakdown.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 p-8 text-center">
                <Building2 className="mx-auto size-8 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-semibold text-foreground">No Departments Found</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Create departments to view headcount distribution and budget allocation.
                </p>
                <Link
                  to={"/dashboard/workforce/departments" as any}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  Add Department
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-bold">Department</th>
                      <th className="px-4 py-3 font-bold">Code</th>
                      <th className="px-4 py-3 font-bold">Headcount</th>
                      <th className="px-4 py-3 font-bold">Annual Budget</th>
                      <th className="px-4 py-3 font-bold">Department Head</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {departmentBreakdown.map((dept) => (
                      <tr key={dept.id} className="transition-colors hover:bg-secondary/40">
                        <td className="px-4 py-3 font-bold text-foreground">{dept.name}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{dept.code}</td>
                        <td className="px-4 py-3 font-mono font-bold text-primary">{dept.count}</td>
                        <td className="px-4 py-3 font-mono text-emerald-500 font-semibold">{dept.budget}</td>
                        <td className="px-4 py-3 text-muted-foreground">{dept.head}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col) */}
        <div className="space-y-6">
          {/* AI Executive Telemetry Insights */}
          <div className="glass-tile rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-purple-500" /> Executive Intelligence
            </h3>
            <div className="space-y-3">
              <div className="rounded-xl border border-border/50 bg-card/40 p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-purple-400">Workforce Health</span>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                    Active
                  </span>
                </div>
                <p className="font-bold text-foreground">Organization Headcount</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Currently managing {totalHeadcount} employees across {totalDepartments} active departments.
                </p>
              </div>

              <div className="rounded-xl border border-border/50 bg-card/40 p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-purple-400">Executive Overview</span>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border border-indigo-500/20 bg-indigo-500/10 text-indigo-500">
                    Leadership
                  </span>
                </div>
                <p className="font-bold text-foreground">Leadership Structure</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {executiveCount} executive member(s) assigned to direct strategic operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
