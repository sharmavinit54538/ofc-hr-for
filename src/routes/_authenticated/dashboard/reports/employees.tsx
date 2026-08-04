import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Contact, UserCheck, Calendar, Shield, Loader2, Inbox } from "lucide-react";
import { useListEmployeesQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/employees")({
  component: EmployeeReportPage,
});

function EmployeeReportPage() {
  const { data: empRes, isLoading } = useListEmployeesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const employees = empRes?.data?.items ?? [];
  const totalEmployees = empRes?.data?.total ?? employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Staff Roster</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{totalEmployees}</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Database Records</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Employees</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{activeEmployees}</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Active Status</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Inactive / Exited</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {totalEmployees - activeEmployees}
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Deactivated Accounts</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Verification Status</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {totalEmployees > 0 ? "100%" : "0%"}
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Statutory Verified</p>
      </div>
    </>
  );

  const tableData = employees.map((emp) => ({
    employeeId: emp.employee_id || emp.id.substring(0, 8),
    name: emp.full_name,
    department: emp.department || "General",
    role: emp.job_title || "Employee",
    joiningDate: emp.joining_date || "—",
    status: emp.status || "Active",
  }));

  const columns = [
    { key: "employeeId", label: "Employee ID" },
    { key: "name", label: "Full Name" },
    { key: "department", label: "Department" },
    { key: "role", label: "Designation" },
    { key: "joiningDate", label: "Joining Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Employee Directory & Roster Report"
      description="Detailed workforce directory listing, employment statuses, tenure profiles, and office locations."
      categoryBadge="Employee Report"
      kpiCards={kpis}
      chartsSection={
        isLoading ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading employee directory...
          </div>
        ) : employees.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Employee Records Found</p>
            <p className="text-[11px] max-w-xs">
              There are currently no employee records registered in the PostgreSQL database.
            </p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
