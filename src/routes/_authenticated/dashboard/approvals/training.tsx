import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { useGetApprovalsQuery, useUpdateApprovalStatusMutation } from "@/services/approvalsApi";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/training")({
  component: TrainingApprovalsPage,
});

function TrainingApprovalsPage() {
  const { data: res, isLoading } = useGetApprovalsQuery({ type: "Training" });
  const [updateStatus] = useUpdateApprovalStatusMutation();
  const items = res?.data ?? [];

  const handleApprove = async (id: string) => {
    try {
      await updateStatus({ approvalId: id, body: { action: "Approved" } }).unwrap();
      toast.success("Training Request Approved");
    } catch {
      toast.error("Failed to approve training request.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training & L&D Program Approvals"
        description="Employee training enrollments, certification reimbursements, and L&D budget approvals."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Training" }]}
        backHref="/dashboard/approvals"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="glass-tile rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
          <Inbox className="size-12 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">No training approval requests</p>
          <p className="text-xs text-muted-foreground/60">Training requests will appear here when submitted.</p>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">ID</th>
                  <th className="px-5 py-3.5 font-bold">Request Title</th>
                  <th className="px-5 py-3.5 font-bold">Requester</th>
                  <th className="px-5 py-3.5 font-bold">Details</th>
                  <th className="px-5 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.map((i) => (
                  <tr key={i.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{i.approvalId}</td>
                    <td className="px-5 py-4 font-bold text-foreground">{i.requestTitle}</td>
                    <td className="px-5 py-4 text-muted-foreground">{i.requesterName}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{i.amountOrDays}</td>
                    <td className="px-5 py-4 text-right">
                      {i.status === "Pending" ? (
                        <button onClick={() => handleApprove(i.id)} className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                          <ThumbsUp className="inline size-3 mr-1" />Approve
                        </button>
                      ) : (
                        <span className="text-muted-foreground font-mono text-[11px]">{i.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
