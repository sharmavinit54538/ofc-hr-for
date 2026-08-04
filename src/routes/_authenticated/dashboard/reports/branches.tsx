import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/branches")({
  component: BranchesReportPage,
});

function BranchesReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Global Offices</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">0 Locations</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Campuses</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "branch", label: "Office Location" },
    { key: "region", label: "Region" },
    { key: "headcount", label: "Active Staff" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Branch & Campus Headcount Distribution Report"
      description="Global site counts, office occupancy rates, regional headcount comparison, and campus facilities."
      categoryBadge="Branch Report"
      kpiCards={kpis}
      chartsSection={
        tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Office Branches Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
