import { createFileRoute } from "@tanstack/react-router";
import { Ticket, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/manager/helpdesk")({
  component: ManagerHelpdeskPage,
});

interface HelpdeskTicketItem {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
}

function ManagerHelpdeskPage() {
  const tickets: HelpdeskTicketItem[] = [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manager Helpdesk & Escalations"
        description="Escalate team issues, request IT hardware, and manage team support tickets."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "Helpdesk" }]}
        backHref="/dashboard/manager"
        actions={
          <button
            onClick={() => toast.info("New Escalation Ticket", { description: "Opening ticket modal." })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
          >
            <Plus className="size-4" /> Create Ticket
          </button>
        }
      />

      {tickets.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Ticket className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No Support Tickets Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Click "+ Create Ticket" above to escalate team hardware, IT, or facility requests.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="glass-tile rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-primary">{t.id}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  t.status === "Resolved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                }`}>
                  {t.status}
                </span>
              </div>
              <h3 className="font-display text-sm font-bold text-foreground">{t.subject}</h3>
              <p className="text-muted-foreground">Category: <strong className="text-foreground">{t.category}</strong> · Priority: {t.priority}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
