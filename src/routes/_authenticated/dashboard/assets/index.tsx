import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import {
  useGetAssetDashboardQuery,
  useListRequestsQuery,
  useExportAssetsReportMutation,
} from "@/services/assetsApi";
import { toast } from "sonner";
import {
  Package,
  UserCheck,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  RefreshCw,
  Plus,
  RotateCcw,
  Download,
  FileCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/assets/")({
  component: AssetDashboardLandingPage,
});

function AssetDashboardLandingPage() {
  const assetNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "assets");
  
  // API Queries
  const { data: dashboardRes, isLoading, isError, refetch } = useGetAssetDashboardQuery();
  const { data: requestsRes } = useListRequestsQuery({ page: 1, page_size: 5, status: "PENDING" });
  const [exportReport, { isLoading: isExporting }] = useExportAssetsReportMutation();

  const stats = dashboardRes?.data;
  const pendingRequests = requestsRes?.data?.items ?? [];

  const handleExport = async () => {
    try {
      const blob = await exportReport({ format: "csv" }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `asset_telemetry_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Asset report exported successfully.");
    } catch {
      toast.error("Failed to export report.");
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "URGENT":
      case "HIGH":
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-500">High Priority</span>;
      case "MEDIUM":
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-500">Medium Priority</span>;
      default:
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-500">Low Priority</span>;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Asset Management Command Center"
        description="Comprehensive enterprise hardware lifecycle registry. Track physical & digital assets, assignments, servicing, and procurement."
        breadcrumbs={[{ label: "Assets" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-50"
            >
              <Download className="size-3.5" /> {isExporting ? "Exporting..." : "Export"}
            </button>

            <Link
              to="/dashboard/assets/inventory"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Plus className="size-4" /> Add Asset
            </Link>

            <Link
              to="/dashboard/assets/assign"
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <UserCheck className="size-3.5 text-emerald-500" /> Assign
            </Link>

            <Link
              to="/dashboard/assets/return"
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <RotateCcw className="size-3.5 text-amber-500" /> Return
            </Link>
          </div>
        }
      />

      {/* ── Summary Telemetry KPI Cards ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-tile h-24 animate-pulse rounded-2xl p-4" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-6 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <p className="mt-2 text-sm font-semibold text-foreground">
            Failed to load asset telemetry from backend.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-3.5" /> Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="glass-tile rounded-2xl p-4 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Assets</span>
              <Package className="size-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display text-foreground">
              {(stats?.total_assets ?? 0).toLocaleString()}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">In active database</p>
          </div>

          <div className="glass-tile rounded-2xl p-4 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Assigned Assets</span>
              <UserCheck className="size-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display text-foreground">
              {(stats?.assigned_assets ?? 0).toLocaleString()}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">In active deployment</p>
          </div>

          <div className="glass-tile rounded-2xl p-4 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Available Assets</span>
              <CheckCircle2 className="size-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display text-foreground">
              {(stats?.available_assets ?? 0).toLocaleString()}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Ready for deployment</p>
          </div>

          <div className="glass-tile rounded-2xl p-4 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Under Maintenance</span>
              <Wrench className="size-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display text-foreground">
              {stats?.maintenance_assets ?? 0}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Repairs & AMC</p>
          </div>

          <div className="glass-tile rounded-2xl p-4 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Lost Assets</span>
              <ShieldAlert className="size-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display text-foreground">
              {stats?.lost_assets ?? 0}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Under investigation</p>
          </div>

          <div className="glass-tile rounded-2xl p-4 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Asset Requests</span>
              <Clock className="size-4 text-violet-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display text-foreground">
              {stats?.pending_requests ?? 0}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Pending approval</p>
          </div>
        </div>
      )}

      {/* ── Main Section: Portfolio Distribution & Pending Requisitions ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hardware Status Breakdown */}
        <div className="glass-tile rounded-2xl p-6 border border-border lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Hardware Portfolio Status
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time asset state summary from PostgreSQL
              </p>
            </div>
            <Link
              to="/dashboard/assets/reports"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View Analytics <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-4 pt-2">
            {stats?.status_distribution && stats.status_distribution.length > 0 ? (
              stats.status_distribution.map((item) => {
                const total = stats.total_assets || 1;
                const percentage = Math.round((item.count / total) * 100);
                return (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{item.status}</span>
                      <span className="text-muted-foreground">
                        {item.count} items ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No asset distribution records found. Click <strong>"Add Asset"</strong> above to register inventory items into PostgreSQL.
              </div>
            )}
          </div>
        </div>

        {/* Pending Requisitions Panel */}
        <div className="glass-tile rounded-2xl p-6 border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-foreground">
                Pending Requisitions
              </h3>
              <Link
                to="/dashboard/assets/requests"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <FileCheck className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                No pending hardware requests.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-xl border border-border/60 bg-card/40 p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{req.asset_category}</span>
                      {getPriorityBadge(req.priority)}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Requested by: <span className="text-foreground font-semibold">{req.employee_name || "Employee"}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {req.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border/60">
            <Link
              to="/dashboard/assets/requests"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-input py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              Manage All Requests
            </Link>
          </div>
        </div>
      </div>

      {/* ── Submodules Navigation Grid ── */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Asset Management Modules
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {assetNav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
