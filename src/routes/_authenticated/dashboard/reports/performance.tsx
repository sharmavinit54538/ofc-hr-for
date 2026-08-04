import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { useGetPerformanceReportQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/performance")({
  component: PerformanceReportPage,
});

function PerformanceReportPage() {
  const { data: perfRes } = useGetPerformanceReportQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const perf = perfRes?.data;

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Reviews Completed</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {perf?.total_reviews_completed ?? 0} Reviews
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Evaluation Telemetry</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Performance Score</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {perf?.avg_performance_score ?? 0} / 5.0
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Calibration Rating</p>
      </div>
    </>
  );

  const tableData = [
    {
      metric: "Total Performance Reviews Completed",
      score: `${perf?.total_reviews_completed ?? 0} Reviews`,
    },
    {
      metric: "Average Organization Rating Score",
      score: `${perf?.avg_performance_score ?? 0} / 5.0`,
    },
  ];

  const columns = [
    { key: "metric", label: "Performance Audit Metric" },
    { key: "score", label: "Value" },
  ];

  return (
    <ReportViewLayout
      title="Performance, OKRs & Appraisal Ratings Report"
      description="Goal completion metrics, company alignment, 360 peer feedback density, and appraisal calibration ratings."
      categoryBadge="Performance Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
