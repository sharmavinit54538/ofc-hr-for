import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Building2, Users, DollarSign, Award, Loader2, Inbox } from "lucide-react";
import { useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/departments")({
  component: DepartmentsReportPage,
});

function DepartmentsReportPage() {
  const { data: deptRes, isLoading } = useListDepartmentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const departments = deptRes?.data ?? [];

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Business Units</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{departments.length} Units</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Corporate Structure</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Registered Divisions</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{departments.length} Depts</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Active Divisions</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Dept Leadership</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {departments.filter((d) => d.head_id || d.manager_id).length} Leads
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Leadership Staffing</p>
      </div>
    </>
  );

  const tableData = departments.map((d) => ({
    code: d.code || "CC-001",
    department: d.name,
    description: d.description || "—",
    headCount: d.employee_count ?? 0,
    status: "Active",
  }));

  const columns = [
    { key: "code", label: "Department Code" },
    { key: "department", label: "Department Name" },
    { key: "description", label: "Description" },
    { key: "headCount", label: "Staff Count" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Departmental Structure & Cost Center Report"
      description="Breakdown of organizational business units, departmental headcount allocation, leadership hierarchy, and cost centers."
      categoryBadge="Department Report"
      kpiCards={kpis}
      chartsSection={
        isLoading ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading departments directory...
          </div>
        ) : departments.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Department Records Found</p>
            <p className="text-[11px] max-w-xs">
              There are currently no department units created in the PostgreSQL database.
            </p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
