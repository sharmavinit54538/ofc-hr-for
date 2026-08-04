import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Loader2, Inbox } from "lucide-react";
import { useGetCompanyHolidaysQuery } from "@/services/employeeDashboardApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/leave")({
  component: LeaveReportPage,
});

function LeaveReportPage() {
  const { data: holidayRes, isLoading } = useGetCompanyHolidaysQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const holidays = holidayRes?.data ?? [];

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Published Holidays</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{holidays.length} Days</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Company Calendar</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Public Holidays</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {holidays.filter((h) => h.type === "Public").length} Days
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Statutory Leave</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Leave Quota State</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {holidays.length > 0 ? "Active" : "Pending"}
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Policy Active</p>
      </div>
    </>
  );

  const tableData = holidays.map((h) => ({
    name: h.name,
    date: h.date,
    day: h.day,
    type: h.type,
    status: "Active",
  }));

  const columns = [
    { key: "name", label: "Holiday Name" },
    { key: "date", label: "Date" },
    { key: "day", label: "Day of Week" },
    { key: "type", label: "Holiday Type" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Leave Utilization & Accrual Balance Report"
      description="Employee time-off applications, paid leave balances, manager approval velocity, and holiday calendar quota."
      categoryBadge="Leave Report"
      kpiCards={kpis}
      chartsSection={
        isLoading ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading company holiday calendar...
          </div>
        ) : holidays.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Published Holidays Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
