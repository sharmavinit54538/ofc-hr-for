import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Award, Building2, UserCheck, ShieldCheck, Loader2, Search, Users, Star, Mail } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/performance")({
  component: ExecutivePerformancePage,
});

function ExecutivePerformancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("ALL");

  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  // Real Performance Governance Metrics derived from DB
  const totalEmployees = rawEmployees.length;
  const activeEmployees = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);
  const activePercentage = totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(1) : "100.0";

  // Managed employees count (having a reporting manager)
  const managedEmployees = useMemo(
    () => rawEmployees.filter((e) => e.reporting_manager || e.reporting_manager_id).length,
    [rawEmployees]
  );
  const managerCoveragePct = totalEmployees > 0 ? ((managedEmployees / totalEmployees) * 100).toFixed(1) : "0.0";

  // Departments with lead assigned
  const leadAssignedDepts = useMemo(
    () => rawDepartments.filter((d) => d.head_name || d.manager_name || d.head_id || d.manager_id).length,
    [rawDepartments]
  );
  const deptLeadCoveragePct = rawDepartments.length > 0 ? ((leadAssignedDepts / rawDepartments.length) * 100).toFixed(1) : "100.0";

  // Filtered employees table
  const filteredEmployees = useMemo(() => {
    return rawEmployees.filter((emp) => {
      const matchesSearch =
        !searchQuery.trim() ||
        emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.job_title && emp.job_title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept =
        selectedDeptFilter === "ALL" ||
        emp.department === selectedDeptFilter ||
        emp.department_id === selectedDeptFilter;

      return matchesSearch && matchesDept;
    });
  }, [rawEmployees, searchQuery, selectedDeptFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Performance & Governance Alignment"
        description="Real-time operational performance, managerial coverage, department leadership status, and employee audit tracking."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Performance Overview" }]}
        backHref="/dashboard/executive"
      />

      {/* ── Macro Performance KPI Cards ───────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Workforce Active Rate</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Award className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-emerald-500">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : `${activePercentage}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{activeEmployees} of {totalEmployees} Active Members</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Manager Hierarchy Coverage</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <UserCheck className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-purple-400">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : `${managerCoveragePct}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{managedEmployees} Employees Assigned to Managers</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Department Lead Coverage</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-indigo-400">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : `${deptLeadCoveragePct}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{leadAssignedDepts} of {rawDepartments.length} Depts Led</p>
          </div>
        </div>
      </div>

      {/* ── Real Performance & Governance Audit Directory ───────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" /> Employee Performance & Governance Audit ({filteredEmployees.length})
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none placeholder:text-muted-foreground/60 w-36 sm:w-48"
              />
            </div>

            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs font-medium outline-none"
            >
              <option value="ALL">All Departments</option>
              {rawDepartments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
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
            <p className="text-sm font-semibold text-foreground">No Records Found</p>
            <p className="text-xs text-muted-foreground mt-1">
              No employee records match the search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Employee</th>
                  <th className="px-5 py-3.5 font-bold">Work Email</th>
                  <th className="px-5 py-3.5 font-bold">Role</th>
                  <th className="px-5 py-3.5 font-bold">Department</th>
                  <th className="px-5 py-3.5 font-bold">Reporting Manager</th>
                  <th className="px-5 py-3.5 font-bold">Audit Status</th>
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
                        <div>
                          <span>{emp.full_name}</span>
                          <p className="text-[10px] text-muted-foreground font-normal">{emp.job_title || "Team Member"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail className="size-3 text-muted-foreground/70" /> {emp.email}</span>
                    </td>
                    <td className="px-5 py-3.5 font-bold">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                          emp.role === "EXECUTIVE"
                            ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                            : emp.role === "MANAGER"
                            ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                            : "border-border bg-secondary/50 text-foreground"
                        }`}
                      >
                        {emp.role || "EMPLOYEE"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-foreground">{emp.department || "Unassigned"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{emp.reporting_manager || "Not Assigned"}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        <Star className="size-3" /> Verified ({emp.status || "Active"})
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
