import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListMaintenancesQuery,
  useScheduleMaintenanceMutation,
  useUpdateMaintenanceMutation,
  useDeleteMaintenanceMutation,
  useListAssetsQuery,
} from "@/services/assetsApi";
import { toast } from "sonner";
import {
  Plus,
  Inbox,
  AlertTriangle,
  RefreshCw,
  Wrench,
  CheckCircle,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { MaintenanceStatus } from "@/types/asset";

export const Route = createFileRoute("/_authenticated/dashboard/assets/maintenance")({
  component: AssetMaintenancePage,
});

function AssetMaintenancePage() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("Routine AMC Checkup");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState<number>(150);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));

  const { data, isLoading, isError, refetch } = useListMaintenancesQuery({ page: 1, page_size: 20 });
  const { data: assetsData } = useListAssetsQuery();

  const [scheduleMaint, { isLoading: isScheduling }] = useScheduleMaintenanceMutation();
  const [updateMaint] = useUpdateMaintenanceMutation();
  const [deleteMaint] = useDeleteMaintenanceMutation();

  const maintenances = data?.data?.items ?? [];
  const assets = assetsData?.data?.items ?? [];

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !maintenanceType) {
      toast.error("Please select an asset and specify the maintenance type.");
      return;
    }

    try {
      await scheduleMaint({
        asset_id: selectedAssetId,
        maintenance_type: maintenanceType,
        description,
        cost,
        scheduled_date: scheduledDate,
      }).unwrap();

      toast.success("Maintenance work order scheduled successfully.");
      setIsScheduleOpen(false);
      setSelectedAssetId("");
      setDescription("");
    } catch {
      toast.error("Failed to schedule maintenance.");
    }
  };

  const handleCompleteToggle = async (id: string, currentStatus: MaintenanceStatus) => {
    const nextStatus: MaintenanceStatus = currentStatus === "COMPLETED" ? "SCHEDULED" : "COMPLETED";
    try {
      await updateMaint({ id, body: { status: nextStatus } }).unwrap();
      toast.success(`Maintenance status changed to ${nextStatus}.`);
    } catch {
      toast.error("Failed to update maintenance status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this maintenance log?")) return;
    try {
      await deleteMaint(id).unwrap();
      toast.success("Maintenance log deleted.");
    } catch {
      toast.error("Failed to delete maintenance log.");
    }
  };

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case "COMPLETED":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Completed</span>;
      case "IN_PROGRESS":
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">In Repair</span>;
      default:
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">Scheduled</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Repair & Maintenance"
        description="Schedule routine servicing, track repair costs, AMC agreements, and work orders."
        breadcrumbs={[
          { label: "Assets", href: "/dashboard/assets" },
          { label: "Maintenance" },
        ]}
        actions={
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Schedule Maintenance
          </button>
        }
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
            Failed to load maintenance schedules
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching maintenance records from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : maintenances.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No maintenance records found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No active or historical repair logs exist in PostgreSQL.
          </p>
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Schedule Work Order
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {maintenances.map((maint) => (
            <div
              key={maint.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Wrench className="size-3" /> Tag: {maint.asset_tag || "N/A"}
                  </span>
                  {getStatusBadge(maint.status)}
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {maint.maintenance_type}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Asset: <span className="text-foreground font-semibold">{maint.asset_name || "Hardware"}</span>
                </p>

                {maint.description && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {maint.description}
                  </p>
                )}

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <Calendar className="size-3" /> Scheduled: {maint.scheduled_date}
                  </p>
                  <p className="flex items-center gap-0.5 text-foreground font-semibold">
                    <DollarSign className="size-3.5 text-muted-foreground" /> Cost: ${maint.cost.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleCompleteToggle(maint.id, maint.status)}
                  className="rounded-lg border border-input px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-secondary flex items-center gap-1"
                >
                  <CheckCircle className="size-3 text-emerald-500" />
                  {maint.status === "COMPLETED" ? "Reopen Servicing" : "Mark Completed"}
                </button>

                <button
                  onClick={() => handleDelete(maint.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Maintenance"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Schedule Modal ── */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Schedule Asset Maintenance
            </h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Target Asset
                </label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Select Asset...</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.tag_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Maintenance Type
                </label>
                <input
                  type="text"
                  required
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  placeholder="e.g. Battery Replacement / AMC Servicing"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Estimated Cost ($)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Issue Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe hardware issue or vendor AMC task..."
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isScheduling ? "Scheduling..." : "Schedule Maintenance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
