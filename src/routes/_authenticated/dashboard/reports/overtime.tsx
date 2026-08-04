import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/overtime")({
  component: OvertimeReportPage,
});

function OvertimeReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Overtime Hours Logged</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">0 Hours</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Workload Balanced</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "employee", label: "Employee Name" },
    { key: "department", label: "Department" },
    { key: "overtimeHours", label: "Overtime Hours" },
    { key: "payout", label: "Estimated Payout" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Overtime & Extra Hours Telemetry Report"
      description="Overtime payouts, manager approvals, hourly workload metrics, and weekend duty logs."
      categoryBadge="Overtime Report"
      kpiCards={kpis}
      chartsSection={
        tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Overtime Records Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
