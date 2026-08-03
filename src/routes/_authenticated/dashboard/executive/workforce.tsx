import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Users,
  Building2,
  Crown,
  Search,
  UserCheck,
  Loader2,
  Mail,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/workforce")({
  component: ExecutiveWorkforcePage,
});

function ExecutiveWorkforcePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");

  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  // KPI Metrics
  const totalHeadcount = rawEmployees.length;
  const activeHeadcount = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);
  const executiveCount = useMemo(() => rawEmployees.filter((e) => e.role === "EXECUTIVE").length, [rawEmployees]);
  const managerCount = useMemo(() => rawEmployees.filter((e) => e.role === "MANAGER").length, [rawEmployees]);

  // Department Breakdown
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
        budget: dept.budget ? `₹${(dept.budget / 10000000).toFixed(2)} Cr` : "Not Configured",
        head: dept.head_name || dept.manager_name || "Unassigned",
      };
    });
  }, [rawDepartments, rawEmployees]);

  // Filtered Employee List
  const filteredEmployees = useMemo(() => {
    return rawEmployees.filter((emp) => {
      const matchesSearch =
        !searchQuery.trim() ||
        emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.department && emp.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (emp.job_title && emp.job_title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        selectedRoleFilter === "ALL" || emp.role === selectedRoleFilter;

      return matchesSearch && matchesRole;
    });
  }, [rawEmployees, searchQuery, selectedRoleFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workforce Overview & Distribution"
        description="Comprehensive enterprise headcount breakdown across business units, executive leadership, and active members."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Workforce Overview" }]}
        backHref="/dashboard/executive"
      />

      {/* ── Macro Strategic KPI Grid ─────────────────────────────── */}
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
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">{activeHeadcount} Active Status</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Executive Board</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Crown className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : executiveCount}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">Leadership Role</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Management Cadre</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <UserCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : managerCount}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">Team Leads & Managers</p>
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
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : rawDepartments.length}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-purple-400">Org Units Active</p>
          </div>
        </div>
      </div>

      {/* ── Department Breakdown ─────────────────────────────────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Building2 className="size-4 text-primary" /> Department Headcount & Budget Overview
          </h3>
          <Link
            to={"/dashboard/workforce/departments" as any}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Manage Departments →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : departmentBreakdown.length === 0 ? (
          <div className="rounded-xl p-8 text-center">
            <Building2 className="mx-auto size-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-semibold text-foreground">No Departments Found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create departments under Workforce Management to populate organization distribution.
            </p>
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
                  <th className="px-5 py-3.5 font-bold">Department Lead</th>
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

      {/* ── Enterprise Personnel Directory Table ─────────────────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Users className="size-4 text-primary" /> Enterprise Personnel Directory ({filteredEmployees.length})
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="flex items-center gap-2 rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, email, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none placeholder:text-muted-foreground/60 w-36 sm:w-48"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs font-medium outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="EXECUTIVE">Executive</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="HR_ADMIN">HR Admin</option>
              <option value="IT_ADMIN">IT Admin</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="mx-auto size-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-semibold text-foreground">No Personnel Found</p>
            <p className="text-xs text-muted-foreground mt-1">
              No employees match the selected search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Employee Name</th>
                  <th className="px-5 py-3.5 font-bold">Work Email</th>
                  <th className="px-5 py-3.5 font-bold">Role</th>
                  <th className="px-5 py-3.5 font-bold">Job Title</th>
                  <th className="px-5 py-3.5 font-bold">Department</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-3.5 font-bold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-brand text-[11px] font-bold text-primary-foreground">
                          {emp.full_name?.charAt(0) || "E"}
                        </div>
                        <span>{emp.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Mail className="size-3 text-muted-foreground/70" /> {emp.email}
                    </td>
                    <td className="px-5 py-3.5 font-bold">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          emp.role === "EXECUTIVE"
                            ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                            : emp.role === "MANAGER"
                            ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                            : emp.role === "HR_ADMIN" || emp.role === "IT_ADMIN"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-border bg-secondary/50 text-foreground"
                        }`}
                      >
                        {emp.role || "EMPLOYEE"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{emp.job_title || "Team Member"}</td>
                    <td className="px-5 py-3.5 font-medium text-foreground">{emp.department || "General"}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                          emp.status === "Active" ? "text-emerald-500" : "text-amber-500"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${emp.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {emp.status || "Active"}
                      </span>
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
