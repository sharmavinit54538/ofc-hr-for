import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListAssignmentsQuery,
  useAssignAssetMutation,
  useListAssetsQuery,
} from "@/services/assetsApi";
import { useListEmployeesQuery } from "@/services/employeeApi";
import { toast } from "sonner";
import {
  Plus,
  Inbox,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  Package,
  Calendar,
  User,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/assets/assign")({
  component: AssetAssignPage,
});

function AssetAssignPage() {
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [notes, setNotes] = useState("");

  const { data, isLoading, isError, refetch } = useListAssignmentsQuery({ page: 1, page_size: 20 });
  const { data: availableAssetsData } = useListAssetsQuery({ status: "AVAILABLE" });
  const { data: employeesData } = useListEmployeesQuery();

  const [assignAsset, { isLoading: isAssigning }] = useAssignAssetMutation();

  const assignments = data?.data?.items ?? [];
  const availableAssets = availableAssetsData?.data?.items ?? [];
  const employees = employeesData?.data?.items ?? [];

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !selectedEmployeeId) {
      toast.error("Please select both an asset and an employee.");
      return;
    }

    try {
      await assignAsset({
        asset_id: selectedAssetId,
        employee_id: selectedEmployeeId,
        assigned_date: assignedDate,
        expected_return_date: expectedReturnDate || undefined,
        notes,
      }).unwrap();

      toast.success("Asset assigned to employee successfully.");
      setIsAssignOpen(false);
      setSelectedAssetId("");
      setSelectedEmployeeId("");
      setNotes("");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to assign asset.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Allocation & Check-Out"
        description="Assign company equipment to active employees, track deployment dates, and set expected check-in schedules."
        breadcrumbs={[
          { label: "Assets", href: "/dashboard/assets" },
          { label: "Asset Allocation" },
        ]}
        actions={
          <button
            onClick={() => setIsAssignOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Assign Asset
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
            Failed to load assignment logs
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching assignments from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : assignments.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No active asset assignments
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No asset assignment records exist in PostgreSQL. Assign your first asset.
          </p>
          <button
            onClick={() => setIsAssignOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Assign Asset
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assign) => (
            <div
              key={assign.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <UserCheck className="size-3" /> {assign.status}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Tag: {assign.asset_tag || "N/A"}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {assign.asset_name || "Asset"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <User className="size-3.5 text-muted-foreground/70" /> Assigned to:{" "}
                  <span className="text-foreground font-semibold">{assign.employee_name || "Employee"}</span>
                </p>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <Calendar className="size-3" /> Assigned: {assign.assigned_date}
                  </p>
                  {assign.expected_return_date && (
                    <p className="text-amber-500">Expected Return: {assign.expected_return_date}</p>
                  )}
                </div>
              </div>

              {assign.assigned_by_name && (
                <div className="mt-4 border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
                  Assigned by: {assign.assigned_by_name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Assign Modal ── */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Assign Asset to Employee
            </h3>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Available Asset
                </label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Select Asset...</option>
                  {availableAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.tag_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Recipient Employee
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Select Employee...</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Assignment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={assignedDate}
                    onChange={(e) => setAssignedDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Expected Return Date
                  </label>
                  <input
                    type="date"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reason for allocation, condition notes..."
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isAssigning ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
