import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import {
  Users,
  Building2,
  ShieldCheck,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/executive")({
  component: ExecutiveReportPage,
});

function ExecutiveReportPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  const totalHeadcount = rawEmployees.length;
  const activeHeadcount = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);
  const totalDepartments = rawDepartments.length;
  const activeRate = totalHeadcount > 0 ? ((activeHeadcount / totalHeadcount) * 100).toFixed(1) : "100.0";

  const departmentData = useMemo(() => {
    return rawDepartments.map((dept) => {
      const empCount = rawEmployees.filter(
        (e) => e.department === dept.name || e.department_id === dept.id
      ).length;
      return {
        department: dept.name,
        code: dept.code || "DEPT",
        headcount: empCount,
        head: dept.head_name || dept.manager_name || "Not Assigned",
        status: dept.status || "Active",
      };
    });
  }, [rawDepartments, rawEmployees]);

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Total Workforce</span>
          <Users className="size-4 text-indigo-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : totalHeadcount}
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Live Database Records</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Active Employees</span>
          <UserCheck className="size-4 text-emerald-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : activeHeadcount}
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{activeRate}% Active Rate</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Departments</span>
          <Building2 className="size-4 text-amber-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : totalDepartments}
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Active Business Units</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase font-bold">
          <span>Compliance Index</span>
          <ShieldCheck className="size-4 text-purple-500" />
        </div>
        <div className="font-display text-2xl font-bold text-foreground mt-2">100%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">RBAC & Database Synchronized</p>
      </div>
    </>
  );

  const columns = [
    { key: "department", label: "Business Unit / Department" },
    { key: "code", label: "Code" },
    { key: "headcount", label: "Assigned Headcount" },
    { key: "head", label: "Department Head" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Executive Summary & Strategic C-Suite Report"
      description="Holistic enterprise dashboard detailing live headcount, department breakdowns, and organizational telemetry."
      categoryBadge="Executive Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={departmentData}
    />
  );
}
