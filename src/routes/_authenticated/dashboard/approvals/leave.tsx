import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_APPROVALS } from "@/lib/approvals/mock-data";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/leave")({
  component: LeaveApprovalsPage,
});

function LeaveApprovalsPage() {
  const items = MOCK_APPROVALS.filter((a) => a.type === "Leave");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave & Out-of-Office Approvals Queue"
        description="Manager queue for annual, casual, medical, and privilege leave applications."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Leave Approvals" }]}
        backHref="/dashboard/approvals"
      />

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">ID</th>
                <th className="px-5 py-3.5 font-bold">Title</th>
                <th className="px-5 py-3.5 font-bold">Requester</th>
                <th className="px-5 py-3.5 font-bold">Duration</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
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
                    <button onClick={() => toast.success("Leave Approved")} className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
