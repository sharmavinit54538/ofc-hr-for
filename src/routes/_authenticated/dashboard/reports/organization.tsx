import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/organization")({
  component: OrganizationReportPage,
});

function OrganizationReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Management Span</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">Flat Hierarchy</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Org Tree Configured</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "level", label: "Hierarchy Level" },
    { key: "roleTitle", label: "Management Band" },
    { key: "count", label: "Employee Count" },
    { key: "spanRatio", label: "Span of Control" },
  ];

  return (
    <ReportViewLayout
      title="Organization Hierarchy & Span of Control Report"
      description="Span of control metrics, management levels, reporting lines, and executive hierarchy distribution."
      categoryBadge="Organization Report"
      kpiCards={kpis}
      chartsSection={
        tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Organization Hierarchy Telemetry Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
