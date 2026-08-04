import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Loader2, Inbox } from "lucide-react";
import { useGetReportsSummaryQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/ai-workforce")({
  component: AiWorkforceReportPage,
});

function AiWorkforceReportPage() {
  const { data: summaryRes, isLoading } = useGetReportsSummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const summary = summaryRes?.data;
  const totalEmp = summary?.total_employees ?? 0;

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Autonomous AI Bot Executions</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">0 Executions</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Live Agent Telemetry</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Employees Monitored</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">{totalEmp} Staff</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Database Records</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "agent", label: "AI Agent Name" },
    { key: "category", label: "Capability Category" },
    { key: "executions", label: "Total Executions" },
    { key: "successRate", label: "Success Rate" },
  ];

  return (
    <ReportViewLayout
      title="AI Workforce Telemetry & Automation Report"
      description="Autonomous AI bot executions, workflow automation hours saved, and agent response times."
      categoryBadge="AI Workforce"
      kpiCards={kpis}
      chartsSection={
        isLoading ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading AI telemetry...
          </div>
        ) : tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No AI Executions Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
