import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/attendance")({
  component: AttendanceApprovalsPage,
});

function AttendanceApprovalsPage() {
  const requests = [
    { id: "1", type: "Missing Punch Regularization", name: "Aarav Sharma", date: "2026-08-01", reason: "Gate terminal biometric power outage" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Punch Regularization Approvals"
        description="Manager queue for missing biometric punch logs and remote work check-in overrides."
        breadcrumbs={[{ label: "Approvals", href: "/dashboard/approvals" }, { label: "Attendance" }]}
        backHref="/dashboard/approvals"
      />

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Request Type</th>
                <th className="px-5 py-3.5 font-bold">Employee</th>
                <th className="px-5 py-3.5 font-bold">Log Date</th>
                <th className="px-5 py-3.5 font-bold">Reason</th>
                <th className="px-5 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {requests.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-bold text-foreground">{r.type}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.name}</td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{r.date}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.reason}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => toast.success("Attendance Approved")} className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
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
