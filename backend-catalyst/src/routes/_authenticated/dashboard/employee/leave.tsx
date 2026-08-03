import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Palmtree, Plus, Calendar, CheckCircle2, Clock, XCircle, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import {
  useGetLeaveBalanceQuery,
  useGetLeaveRequestsQuery,
  useApplyLeaveMutation,
  type LeaveTypeBalance,
} from "@/services/employeeDashboardApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/employee/leave")({
  component: EmployeeLeavePage,
});

const DEFAULT_LEAVE_BALANCES: LeaveTypeBalance[] = [
  { type: "Casual Leave", total: 12, used: 0, remaining: 12, color: "text-sky-500" },
  { type: "Sick Leave", total: 10, used: 0, remaining: 10, color: "text-rose-500" },
  { type: "Earned Leave", total: 15, used: 0, remaining: 15, color: "text-emerald-500" },
  { type: "Comp Off", total: 3, used: 0, remaining: 3, color: "text-amber-500" },
];

function EmployeeLeavePage() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [form, setForm] = useState({ type: "Casual Leave", from: "", to: "", reason: "" });

  const { data: balanceRes, isLoading: isBalanceLoading } = useGetLeaveBalanceQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: requestsRes, isLoading: isRequestsLoading } = useGetLeaveRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [applyLeave, { isLoading: isSubmitting }] = useApplyLeaveMutation();

  const leaveBalances = balanceRes?.data?.balances && balanceRes.data.balances.length > 0
    ? balanceRes.data.balances
    : DEFAULT_LEAVE_BALANCES;

  const leaveHistory = requestsRes?.data ?? [];

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.reason.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await applyLeave({
        type: form.type,
        from_date: form.from,
        to_date: form.to,
        reason: form.reason.trim(),
      }).unwrap();

      if (res.success) {
        toast.success("Leave Applied Successfully", {
          description: `${form.type} from ${form.from} to ${form.to} submitted for approval.`,
        });
        setIsApplyOpen(false);
        setForm({ type: "Casual Leave", from: "", to: "", reason: "" });
      } else {
        toast.error("Failed to submit leave application", { description: res.message });
      }
    } catch (err: any) {
      toast.error("Error applying leave", { description: err?.data?.message || err?.message || "Server error occurred." });
    }
  };

  const statusIcon: Record<string, React.ReactNode> = {
    Approved: <CheckCircle2 className="size-3 text-emerald-500" />,
    Pending: <Clock className="size-3 text-amber-500" />,
    Rejected: <XCircle className="size-3 text-rose-500" />,
  };

  const statusColors: Record<string, string> = {
    Approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    Pending: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    Rejected: "border-rose-500/20 bg-rose-500/10 text-rose-500",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Leave Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            View balances, apply for leave, and track approval status.
          </p>
        </div>
        <button
          onClick={() => setIsApplyOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
        >
          <Plus className="size-4" /> Apply for Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isBalanceLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="glass-tile h-28 animate-pulse rounded-2xl p-4 bg-secondary/30" />
            ))
          : leaveBalances.map((leave) => (
              <div key={leave.type} className="glass-tile rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {leave.type}
                  </span>
                  <Palmtree className={`size-4 ${leave.color || "text-primary"}`} />
                </div>
                <div className="flex items-end gap-1">
                  <span className="font-display text-2xl font-bold text-foreground">
                    {leave.remaining}
                  </span>
                  <span className="text-xs text-muted-foreground mb-0.5">/ {leave.total}</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-gradient-brand transition-all duration-500"
                    style={{ width: `${leave.total > 0 ? (leave.remaining / leave.total) * 100 : 0}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">{leave.used} used</p>
              </div>
            ))}
      </div>

      {/* Leave History Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground">Leave History</h3>
          <span className="text-xs text-muted-foreground font-mono">
            Total: {leaveHistory.length}
          </span>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          {isRequestsLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              Loading leave requests...
            </div>
          ) : leaveHistory.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Inbox className="size-8 text-muted-foreground/50" />
              <p className="font-medium text-foreground">No Leave Requests Found</p>
              <p className="text-[11px] max-w-xs">
                You haven't submitted any leave applications yet. Click "Apply for Leave" above to create one.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-bold">ID</th>
                  <th className="px-5 py-3 font-bold">Type</th>
                  <th className="px-5 py-3 font-bold">From</th>
                  <th className="px-5 py-3 font-bold">To</th>
                  <th className="px-5 py-3 font-bold">Days</th>
                  <th className="px-5 py-3 font-bold">Reason</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Approver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {leaveHistory.map((leave) => (
                  <tr key={leave.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-3 font-mono font-semibold text-primary">
                      {leave.id.length > 10 ? `LV-${leave.id.slice(0, 6)}` : leave.id}
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">{leave.type}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{leave.from_date}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{leave.to_date}</td>
                    <td className="px-5 py-3 font-bold text-foreground">{leave.days}</td>
                    <td className="px-5 py-3 text-muted-foreground max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          statusColors[leave.status] || "border-secondary text-muted-foreground"
                        }`}
                      >
                        {statusIcon[leave.status]} {leave.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{leave.approver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Apply Leave Dialog */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Apply for Leave</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit a leave request for manager approval.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApplyLeave} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Leave Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none cursor-pointer focus:border-ring"
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Earned Leave</option>
                <option>Comp Off</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  From
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <Calendar className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="date"
                    required
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  To
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <Calendar className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="date"
                    required
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Reason
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe your reason for leave..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none resize-none focus:border-ring placeholder:text-muted-foreground/60"
              />
            </div>
            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsApplyOpen(false)}
                disabled={isSubmitting}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                Submit Request
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
