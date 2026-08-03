import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Palmtree, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_TEAM_LEAVES, type TeamLeaveApproval } from "@/lib/manager/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/manager/leave")({
  component: ManagerLeavePage,
});

function ManagerLeavePage() {
  const [leaves, setLeaves] = useState<TeamLeaveApproval[]>(MOCK_TEAM_LEAVES);

  const handleApprove = (id: string, name: string) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: "Approved" } : l)));
    toast.success("Leave Approved", { description: `Approved leave request for ${name}.` });
  };

  const handleReject = (id: string, name: string) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: "Rejected" } : l)));
    toast.info("Leave Rejected", { description: `Rejected leave request for ${name}.` });
  };

  const statusColors: Record<string, string> = {
    Approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    Pending: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    Rejected: "border-rose-500/20 bg-rose-500/10 text-rose-500",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Leave Approvals"
        description="Review and process leave requests submitted by your direct team members."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "Leave" }]}
        backHref="/dashboard/manager"
      />

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60">
          <h3 className="font-display text-base font-bold text-foreground">Pending & Historical Leave Requests</h3>
        </div>
        {leaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <Palmtree className="size-10 text-muted-foreground/60" />
            <h3 className="font-display text-base font-bold text-foreground">No Leave Requests Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              There are currently no pending or historical leave requests submitted by your team members.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Request ID</th>
                  <th className="px-5 py-3.5 font-bold">Employee</th>
                  <th className="px-5 py-3.5 font-bold">Leave Type</th>
                  <th className="px-5 py-3.5 font-bold">Dates</th>
                  <th className="px-5 py-3.5 font-bold">Days</th>
                  <th className="px-5 py-3.5 font-bold">Reason</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{leave.id}</td>
                    <td className="px-5 py-4 font-bold text-foreground">
                      {leave.employeeName} <span className="font-mono text-[10px] text-muted-foreground">({leave.employeeId})</span>
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">{leave.type}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{leave.from} to {leave.to}</td>
                    <td className="px-5 py-4 font-bold text-foreground">{leave.days}</td>
                    <td className="px-5 py-4 text-muted-foreground max-w-[200px] truncate">{leave.reason}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusColors[leave.status] || ""}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {leave.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleReject(leave.id, leave.employeeName)}
                            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(leave.id, leave.employeeName)}
                            className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600 shadow-glow"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground font-semibold">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
