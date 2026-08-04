import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { useGetAttritionReportQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/attrition")({
  component: AttritionReportPage,
});

function AttritionReportPage() {
  const { data: attRes } = useGetAttritionReportQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const att = attRes?.data;

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Annualized Attrition Rate</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {att?.attrition_rate ?? 0}%
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Turnover Rate</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Recorded Exits</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {att?.total_exits ?? 0} Staff
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Exits YTD</p>
      </div>
    </>
  );

  const tableData = [
    {
      metric: "Total Exits YTD",
      value: `${att?.total_exits ?? 0} Staff`,
    },
    {
      metric: "Annualized Attrition Rate",
      value: `${att?.attrition_rate ?? 0}%`,
    },
  ];

  const columns = [
    { key: "metric", label: "Attrition Metric" },
    { key: "value", label: "Value" },
  ];

  return (
    <ReportViewLayout
      title="Attrition Analytics & Flight Risk Report"
      description="Workforce turnover trends, exit interview reasons, department attrition comparisons, and AI predictive flight risk indicators."
      categoryBadge="Attrition Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
