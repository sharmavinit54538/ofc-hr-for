import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Package, UserCheck, Wrench, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/assets")({
  component: AssetReportPage,
});

function AssetReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Total Managed Assets</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">1,420 Items</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Valuation: $1.42M</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Assigned to Staff</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">940 Items</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">66.2% Utilization</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Under Repair / RMA</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">48 Items</div>
        <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Servicing Active</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Reported Lost / Stolen</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">6 Items</div>
        <p className="text-[10px] text-rose-400 font-semibold mt-0.5">Under Security Audit</p>
      </div>
    </>
  );

  const mockAssetSummary = [
    { category: "Laptop", total: 640, assigned: 520, available: 112, maintenance: 8, lost: 0 },
    { category: "Desktop & Workstations", total: 120, assigned: 98, available: 20, maintenance: 2, lost: 0 },
    { category: "Display Monitors", total: 480, assigned: 410, available: 65, maintenance: 5, lost: 0 },
    { category: "Mobile Phones & Tablets", total: 127, assigned: 113, available: 10, maintenance: 3, lost: 1 },
  ];

  const columns = [
    { key: "category", label: "Asset Category" },
    { key: "total", label: "Total Inventory" },
    { key: "assigned", label: "Assigned" },
    { key: "available", label: "Available" },
    { key: "maintenance", label: "In Maintenance" },
    { key: "lost", label: "Lost / Missing" },
  ];

  return (
    <ReportViewLayout
      title="Hardware Asset Allocation & Valuation Report"
      description="Enterprise hardware inventory breakdown, device utilization rates, active maintenance tickets, and lost equipment audits."
      categoryBadge="Asset Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockAssetSummary}
    />
  );
}
