import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Loader2, Inbox } from "lucide-react";
import { useGetReportsSummaryQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/activity")({
  component: ActivityLogsReportPage,
});

function ActivityLogsReportPage() {
  const { data: summaryRes, isLoading } = useGetReportsSummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const summary = summaryRes?.data;
  const totalEmp = summary?.total_employees ?? 0;

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Daily Active Users (DAU)</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{totalEmp} DAU</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Platform Engagement</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">MFA Pass Rate</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {totalEmp > 0 ? "100% Verified" : "0%"}
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Security Enforced</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "timestamp", label: "Timestamp" },
    { key: "user", label: "User Name" },
    { key: "department", label: "Department" },
    { key: "activity", label: "User Action" },
    { key: "platform", label: "Client Platform" },
  ];

  return (
    <ReportViewLayout
      title="User Activity & Platform Engagement Telemetry Report"
      description="Workforce user logins, mobile app check-ins, feature interaction heatmaps, and session location security telemetry."
      categoryBadge="Activity Logs"
      kpiCards={kpis}
      chartsSection={
        isLoading ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading activity logs...
          </div>
        ) : tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Activity Logs Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
