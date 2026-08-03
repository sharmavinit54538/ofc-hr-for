import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Wallet, Building2, Users, Loader2, DollarSign, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/payroll")({
  component: ExecutivePayrollPage,
});

function ExecutivePayrollPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  const totalHeadcount = rawEmployees.length;
  const activeHeadcount = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);

  // Total allocated budget across departments
  const totalAllocatedBudget = useMemo(() => {
    return rawDepartments.reduce((acc, d) => acc + (d.budget || 0), 0);
  }, [rawDepartments]);

  const formattedTotalBudget = totalAllocatedBudget > 0
    ? `₹${(totalAllocatedBudget / 10000000).toFixed(2)} Cr`
    : "Configured per Dept";

  // Department payroll breakdown
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
        budget: dept.budget ? `₹${(dept.budget / 10000000).toFixed(2)} Cr` : "Not Set",
        head: dept.head_name || dept.manager_name || "Unassigned",
      };
    });
  }, [rawDepartments, rawEmployees]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Payroll & Compensation Spend"
        description="Macro department budget allocations, workforce labor expenses, and corporate compensation structure."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Payroll Overview" }]}
        backHref="/dashboard/executive"
      />

      {/* ── Macro Strategic KPI Cards ───────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Department Budget</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wallet className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-emerald-500">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : formattedTotalBudget}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Sum of Active Department Budgets</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Payroll Members</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : activeHeadcount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of {totalHeadcount} Registered Employees</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Org Units</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-amber-400">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : rawDepartments.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Configured Departments</p>
          </div>
        </div>
      </div>

      {/* ── Department Compensation & Budget Table ─────────────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <DollarSign className="size-4 text-emerald-500" /> Department Compensation & Budget Breakdown
          </h3>
          <Link
            to={"/dashboard/workforce/departments" as any}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Manage Department Budgets <ArrowRight className="size-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : departmentBreakdown.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="mx-auto size-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-semibold text-foreground">No Department Budget Data</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Add departments and assign budgets in Workforce Management.
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
                  <th className="px-5 py-3.5 font-bold">Department</th>
                  <th className="px-5 py-3.5 font-bold">Code</th>
                  <th className="px-5 py-3.5 font-bold">Headcount</th>
                  <th className="px-5 py-3.5 font-bold">Annual Budget</th>
                  <th className="px-5 py-3.5 font-bold">Department Head</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {departmentBreakdown.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">{d.name}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{d.code}</td>
                    <td className="px-5 py-4 font-mono font-bold text-primary">{d.count}</td>
                    <td className="px-5 py-4 font-mono text-emerald-500 font-semibold">{d.budget}</td>
                    <td className="px-5 py-4 text-muted-foreground">{d.head}</td>
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
