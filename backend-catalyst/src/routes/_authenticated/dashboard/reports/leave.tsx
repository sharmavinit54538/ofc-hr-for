import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { CalendarDays, CheckCircle2, Clock, Percent } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/leave")({
  component: LeaveReportPage,
});

function LeaveReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Paid Leaves Take</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">420 Days</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Aug 2026 YTD</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Pending Approval Requests</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">5 Requests</div>
        <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Requires Manager Review</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Leave Balance</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">14.2 Days</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Healthy Work-Life Balance</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Upcoming Holidays (2026)</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">14 Days</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Published Calendar</p>
      </div>
    </>
  );

  const mockLeaves = [
    { employee: "Vikram Sharma", department: "Product Engineering", leaveType: "Earned Paid Leave", days: 3, startDate: "2026-08-10", endDate: "2026-08-12", status: "Approved" },
    { employee: "Ananya Deshmukh", department: "Product Engineering", leaveType: "Casual Leave", days: 1, startDate: "2026-08-05", endDate: "2026-08-05", status: "Pending Manager" },
    { employee: "Sanjay Gupta", department: "Information Technology", leaveType: "Sick Leave", days: 2, startDate: "2026-07-28", endDate: "2026-07-29", status: "Approved" },
  ];

  const columns = [
    { key: "employee", label: "Employee Name" },
    { key: "department", label: "Department" },
    { key: "leaveType", label: "Leave Type" },
    { key: "days", label: "Days Count" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Leave Utilization & Accrual Balance Report"
      description="Employee time-off applications, paid leave balances, manager approval velocity, and holiday calendar quota."
      categoryBadge="Leave Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockLeaves}
    />
  );
}
