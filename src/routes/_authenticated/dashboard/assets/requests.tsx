import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListRequestsQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useListAssetCategoriesQuery,
} from "@/services/assetsApi";
import { toast } from "sonner";
import {
  Plus,
  Inbox,
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  User,
  AlertCircle,
} from "lucide-react";
import { AssetRequestStatus } from "@/types/asset";

export const Route = createFileRoute("/_authenticated/dashboard/assets/requests")({
  component: AssetRequestsPage,
});

function AssetRequestsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [assetCategory, setAssetCategory] = useState("Laptops & Computers");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState("High");

  const { data, isLoading, isError, refetch } = useListRequestsQuery({ page: 1, page_size: 20 });
  const { data: categoriesData } = useListAssetCategoriesQuery();

  const [createReq, { isLoading: isCreating }] = useCreateRequestMutation();
  const [updateReq] = useUpdateRequestMutation();

  const requests = data?.data?.items ?? [];
  const categories = categoriesData?.data ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetCategory || !reason) {
      toast.error("Please specify asset category and justification reason.");
      return;
    }

    try {
      await createReq({
        asset_category: assetCategory,
        reason,
        priority,
      }).unwrap();

      toast.success("Asset request submitted for approval.");
      setIsCreateOpen(false);
      setReason("");
    } catch {
      toast.error("Failed to submit asset request.");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: AssetRequestStatus) => {
    try {
      await updateReq({ id, body: { status: newStatus } }).unwrap();
      toast.success(`Request marked as ${newStatus}.`);
    } catch {
      toast.error("Failed to update request status.");
    }
  };

  const getStatusBadge = (status: AssetRequestStatus) => {
    switch (status) {
      case "APPROVED":
      case "ALLOCATED":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Approved</span>;
      case "REJECTED":
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-500">Rejected</span>;
      default:
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">Pending Approval</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Hardware Requests"
        description="Review hardware requisition requests, approve laptop upgrades, and monitor procurement pipeline."
        breadcrumbs={[
          { label: "Assets", href: "/dashboard/assets" },
          { label: "Requisition Requests" },
        ]}
        actions={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Request Asset
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
            Failed to load hardware requests
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching requests from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No hardware requests pending
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No employee requisition requests found in PostgreSQL.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Submit Requisition
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <AlertCircle className="size-3" /> Priority: {req.priority}
                  </span>
                  {getStatusBadge(req.status)}
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {req.asset_category}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <User className="size-3.5 text-muted-foreground/70" /> Requested by:{" "}
                  <span className="text-foreground font-semibold">{req.employee_name || "Employee"}</span>
                </p>

                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  Justification: {req.reason}
                </p>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground">
                  Submitted: {req.created_at?.slice(0, 10) || "Recent"}
                </span>

                {req.status === "PENDING" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                      className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-500 hover:bg-rose-500/20"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Submit Request Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Submit Hardware Requisition
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Asset Category
                </label>
                <select
                  value={assetCategory}
                  onChange={(e) => setAssetCategory(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="Laptops & Computers">Laptops & Computers</option>
                  <option value="Monitors & Displays">Monitors & Displays</option>
                  <option value="Mobile Devices">Mobile Devices</option>
                  <option value="Peripherals">Peripherals (Keyboard/Mouse)</option>
                  <option value="Software Licenses">Software Licenses</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent (Project Blocker)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Business Justification Reason
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this equipment is needed for your project responsibilities..."
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isCreating ? "Submitting..." : "Submit Requisition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
