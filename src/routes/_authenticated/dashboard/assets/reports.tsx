import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useGetAssetDashboardQuery,
  useExportAssetsReportMutation,
} from "@/services/assetsApi";
import { toast } from "sonner";
import {
  Download,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  DollarSign,
  Package,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/assets/reports")({
  component: AssetReportsPage,
});

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function AssetReportsPage() {
  const { data, isLoading, isError, refetch } = useGetAssetDashboardQuery();
  const [exportReport, { isLoading: isExporting }] = useExportAssetsReportMutation();

  const stats = data?.data;
  const statusData = stats?.status_distribution ?? [];

  const handleExport = async () => {
    try {
      const blob = await exportReport({ format: "csv" }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `asset_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Asset analytics report exported.");
    } catch {
      toast.error("Failed to export report.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Analytics & Reports"
        description="Comprehensive asset valuation metrics, category distribution, deployment status, and export utilities."
        breadcrumbs={[
          { label: "Assets", href: "/dashboard/assets" },
          { label: "Analytics & Reports" },
        ]}
        actions={
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
          >
            <Download className="size-4" /> {isExporting ? "Exporting..." : "Export Full CSV Report"}
          </button>
        }
      />

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-tile h-64 animate-pulse rounded-2xl p-5" />
          <div className="glass-tile h-64 animate-pulse rounded-2xl p-5" />
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load asset analytics
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching dashboard metrics from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Banner */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-tile rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Valuation</span>
                <DollarSign className="size-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-foreground">
                ${stats?.total_asset_value.toLocaleString() ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Combined purchase value</p>
            </div>

            <div className="glass-tile rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Units</span>
                <Package className="size-4 text-blue-500" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-foreground">
                {stats?.total_assets ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Hardware & equipment</p>
            </div>

            <div className="glass-tile rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Active Deployments</span>
                <BarChart3 className="size-4 text-violet-500" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-foreground">
                {stats?.assigned_assets ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Assigned to employees</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Status Breakdown */}
            <div className="glass-tile rounded-2xl p-6 border border-border">
              <h3 className="font-display text-base font-bold text-foreground mb-1 flex items-center gap-2">
                <PieChartIcon className="size-4 text-primary" /> Asset Status Breakdown
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Real-time distribution of available, assigned, and repair stock.
              </p>

              {statusData.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-12">No status data available.</p>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ status, count }) => `${status}: ${count}`}
                      >
                        {statusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Bar Distribution */}
            <div className="glass-tile rounded-2xl p-6 border border-border">
              <h3 className="font-display text-base font-bold text-foreground mb-1 flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" /> Inventory Status Comparison
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Quantity count per asset deployment status in PostgreSQL.
              </p>

              {statusData.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-12">No inventory data available.</p>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="status" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
