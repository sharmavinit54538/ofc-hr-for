import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Loader2, Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/assets")({
  component: AssetsReportPage,
});

function AssetsReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Company Assets</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">0 Items</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Asset Inventory</p>
      </div>
    </>
  );

  const tableData: any[] = [];

  const columns = [
    { key: "assetTag", label: "Asset Tag" },
    { key: "category", label: "Asset Category" },
    { key: "assignedTo", label: "Assigned User" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Hardware Inventory & Asset Valuation Report"
      description="IT asset inventory distribution, hardware allocations, depreciation schedules, and lost item audit logs."
      categoryBadge="Asset Report"
      kpiCards={kpis}
      chartsSection={
        tableData.length === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Asset Inventory Records Found</p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
