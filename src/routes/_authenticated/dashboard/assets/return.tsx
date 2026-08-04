import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListAssignmentsQuery,
  useReturnAssetMutation,
} from "@/services/assetsApi";
import { toast } from "sonner";
import {
  RotateCcw,
  Inbox,
  AlertTriangle,
  RefreshCw,
  Package,
  User,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/assets/return")({
  component: AssetReturnPage,
});

function AssetReturnPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [returnCondition, setReturnCondition] = useState("Good");
  const [notes, setNotes] = useState("");

  const { data, isLoading, isError, refetch } = useListAssignmentsQuery({ page: 1, page_size: 20 });
  const [returnAsset, { isLoading: isReturning }] = useReturnAssetMutation();

  const assignments = data?.data?.items ?? [];
  const activeAssignments = assignments.filter((a) => a.status === "ACTIVE");

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) {
      toast.error("Please select an assigned asset to check in.");
      return;
    }

    try {
      await returnAsset({
        asset_id: selectedAssetId,
        return_date: new Date().toISOString().slice(0, 10),
        return_condition: returnCondition,
        notes,
      }).unwrap();

      toast.success("Asset check-in processed and returned to stock.");
      setSelectedAssetId(null);
      setNotes("");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to return asset.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Check-in & Return"
        description="Process returned equipment from departing or transitioning employees, log condition scorecards, and restock available inventory."
        breadcrumbs={[
          { label: "Assets", href: "/dashboard/assets" },
          { label: "Check-in & Return" },
        ]}
      />

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-tile h-36 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load active assignments
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching check-in items from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : activeAssignments.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No active deployments requiring check-in
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            All company assets are currently unassigned or available in inventory stock.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeAssignments.map((assign) => (
            <div
              key={assign.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    <Package className="size-3" /> Tag: {assign.asset_tag || "N/A"}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                    Active Deployment
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {assign.asset_name || "Asset"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <User className="size-3.5 text-muted-foreground/70" /> Holder:{" "}
                  <span className="text-foreground font-semibold">{assign.employee_name || "Employee"}</span>
                </p>

                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" /> Assigned: {assign.assigned_date}
                </p>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex justify-end">
                <button
                  onClick={() => setSelectedAssetId(assign.asset_id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  <RotateCcw className="size-3.5" /> Check-in Asset
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Return Check-in Modal ── */}
      {selectedAssetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Process Asset Return
            </h3>
            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Return Condition
                </label>
                <select
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="Pristine">Pristine / Like New</option>
                  <option value="Good">Good Condition</option>
                  <option value="Fair">Fair / Minor Wear</option>
                  <option value="Damaged">Damaged (Requires Maintenance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Inspection Notes & Comments
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Note scratches, missing accessories, or required repair work..."
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssetId(null)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReturning}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isReturning ? "Processing..." : "Complete Check-in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
