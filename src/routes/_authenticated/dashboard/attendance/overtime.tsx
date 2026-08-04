import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListOvertimesQuery,
  useCreateOvertimeMutation,
  useUpdateOvertimeStatusMutation,
  useDeleteOvertimeMutation,
} from "@/services/attendanceApi";
import { useListEmployeesQuery } from "@/services/employeeApi";
import { toast } from "sonner";
import {
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Inbox,
  Filter,
  DollarSign,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/attendance/overtime")({
  component: AttendanceOvertimePage,
});

function AttendanceOvertimePage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedUserId, setSelectedUserId] = useState("");
  const [title, setTitle] = useState("");
  const [claimDate, setClaimDate] = useState(new Date().toISOString().slice(0, 10));
  const [hours, setHours] = useState(4.0);
  const [rateMultiplier, setRateMultiplier] = useState(1.5);
  const [reason, setReason] = useState("");

  // API Hooks
  const { data: claimsRes, isLoading, isError, refetch } = useListOvertimesQuery({
    status: statusFilter || undefined,
  });

  const { data: employeesRes } = useListEmployeesQuery();
  const [createOvertime, { isLoading: isSubmitting }] = useCreateOvertimeMutation();
  const [updateOvertimeStatus] = useUpdateOvertimeStatusMutation();
  const [deleteOvertime] = useDeleteOvertimeMutation();

  const claims = claimsRes?.data ?? [];
  const employees = employeesRes?.data?.items ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !title) {
      toast.error("Please select an employee and enter claim title.");
      return;
    }

    try {
      await createOvertime({
        user_id: selectedUserId,
        title,
        date: claimDate,
        hours,
        rate_multiplier: rateMultiplier,
        reason: reason || undefined,
      }).unwrap();

      toast.success("Overtime claim submitted successfully.");
      setIsModalOpen(false);
      setSelectedUserId("");
      setTitle("");
      setReason("");
    } catch {
      toast.error("Failed to submit overtime claim.");
    }
  };

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await updateOvertimeStatus({
        id,
        body: { status },
      }).unwrap();
      toast.success(`Overtime claim ${status.toLowerCase()} successfully.`);
    } catch {
      toast.error("Failed to update claim status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this overtime claim?")) return;
    try {
      await deleteOvertime(id).unwrap();
      toast.success("Overtime claim deleted.");
    } catch {
      toast.error("Failed to delete overtime claim.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
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
        title="Overtime Claims & Approvals"
        description="Extra hours calculation, manager approvals, rate multipliers, and payroll synchronization stored in PostgreSQL."
        breadcrumbs={[
          { label: "Attendance", href: "/dashboard/attendance" },
          { label: "Overtime" },
        ]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Submit Overtime Claim
          </button>
        }
      />

      {/* ── Filter Toolbar ── */}
      <div className="glass-tile flex items-center justify-between rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="size-3.5" /> Filter by Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
          >
            <option value="">All Claims</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* ── Content Area / Table ── */}
      {isLoading ? (
        <div className="glass-tile h-64 animate-pulse rounded-2xl p-6" />
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load overtime claims
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching claims from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : claims.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No overtime claims found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No overtime entries match the selected status. Click below to submit one.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Submit Overtime Claim
          </button>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card/80 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5 pl-5">Employee & Claim Title</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Hours & Rate</th>
                  <th className="p-3.5">Reason / Justification</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-card/40 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-foreground">{claim.title}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {claim.employee_name} ({claim.department})
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-muted-foreground">{claim.date}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-foreground">{claim.hours} hrs</span>
                      <span className="ml-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {claim.rate_multiplier}x Rate
                      </span>
                    </td>
                    <td className="p-3.5 text-muted-foreground max-w-xs truncate">
                      {claim.reason || "N/A"}
                    </td>
                    <td className="p-3.5">{getStatusBadge(claim.status)}</td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {claim.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(claim.id, "APPROVED")}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                              title="Approve Claim"
                            >
                              <CheckCircle2 className="size-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(claim.id, "REJECTED")}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-semibold text-rose-500 hover:bg-rose-500/20"
                              title="Reject Claim"
                            >
                              <XCircle className="size-3" /> Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(claim.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Claim"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Submit Overtime Claim Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Submit Overtime Claim
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Select Employee</label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Select Employee...</option>
                  {employees.map((emp: any) => (
                    <option key={emp.id} value={emp.user_id || emp.id}>
                      {emp.first_name} {emp.last_name} ({emp.department_name || "Employee"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Claim Title / Assignment</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Deployment & Migration"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Rate Multiplier</label>
                <select
                  value={rateMultiplier}
                  onChange={(e) => setRateMultiplier(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value={1.5}>1.5x Standard Overtime Rate</option>
                  <option value={2.0}>2.0x Double Time (Holiday/Night)</option>
                  <option value={1.0}>1.0x Standard Rate</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Reason / Justification</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Detailed explanation for overtime work..."
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isSubmitting ? "Saving..." : "Submit Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
