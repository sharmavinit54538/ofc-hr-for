import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Clock, CheckCircle2, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import {
  useGetEmployeeTicketsQuery,
  useCreateTicketMutation,
} from "@/services/employeeDashboardApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/employee/helpdesk")({
  component: EmployeeHelpdeskPage,
});

function EmployeeHelpdeskPage() {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("IT Support");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [description, setDescription] = useState("");

  const { data: ticketsRes, isLoading } = useGetEmployeeTicketsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createTicket, { isLoading: isSubmitting }] = useCreateTicketMutation();

  const tickets = ticketsRes?.data ?? [];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error("Please provide subject and description.");
      return;
    }

    try {
      const res = await createTicket({
        subject: subject.trim(),
        category,
        priority,
        description: description.trim(),
      }).unwrap();

      if (res.success) {
        toast.success("Ticket Created Successfully", {
          description: `Ticket ${res.data.ticket_number || res.data.id} submitted to ${category}.`,
        });
        setIsNewTicketOpen(false);
        setSubject("");
        setDescription("");
        setCategory("IT Support");
        setPriority("Medium");
      } else {
        toast.error("Failed to create ticket", { description: res.message });
      }
    } catch (err: any) {
      toast.error("Error creating ticket", {
        description: err?.data?.message || err?.message || "Server error occurred.",
      });
    }
  };

  const statusColors: Record<string, string> = {
    Open: "border-sky-500/20 bg-sky-500/10 text-sky-500",
    "In Progress": "border-amber-500/20 bg-amber-500/10 text-amber-500",
    Resolved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    Closed: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
  };

  const priorityColors: Record<string, string> = {
    Low: "text-zinc-400 bg-zinc-500/10",
    Medium: "text-sky-500 bg-sky-500/10",
    High: "text-amber-500 bg-amber-500/10",
    Critical: "text-rose-500 bg-rose-500/10 font-bold",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Employee Helpdesk & Support
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Submit support tickets for IT, HR, Payroll, or Facilities assistance.
          </p>
        </div>
        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
        >
          <Plus className="size-4" /> Create Ticket
        </button>
      </div>

      {/* Ticket List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading helpdesk tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Helpdesk Tickets Found</p>
          <p className="text-[11px] max-w-xs">
            You haven't submitted any support requests yet. Click "Create Ticket" above to submit one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t.id} className="glass-tile rounded-2xl p-5 space-y-3 transition-all hover-lift">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-primary">
                    {t.ticket_number || t.id}
                  </span>
                  <h3 className="font-display text-sm font-bold text-foreground">{t.subject}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] ${priorityColors[t.priority] || ""}`}>
                    {t.priority}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusColors[t.status] || ""}`}>
                    {t.status === "Resolved" ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                    {t.status}
                  </span>
                </div>
              </div>
              {t.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
              )}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>Category: <strong className="text-foreground">{t.category}</strong></span>
                <span>Assigned: <strong className="text-foreground">{t.assigned_to}</strong> · {t.created_at}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Submit Support Ticket</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Get help from IT, HR, or Facilities teams.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTicket} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Subject</label>
              <input
                type="text"
                required
                placeholder="Brief summary of your issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none cursor-pointer focus:border-ring"
                >
                  <option>IT Support</option>
                  <option>HR Ops</option>
                  <option>Payroll</option>
                  <option>Facilities</option>
                  <option>Hardware</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none cursor-pointer focus:border-ring"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Description</label>
              <textarea
                required
                rows={4}
                placeholder="Detail your issue, error message, or request..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none resize-none focus:border-ring placeholder:text-muted-foreground/60"
              />
            </div>
            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewTicketOpen(false)}
                disabled={isSubmitting}
                className="glass-tile rounded-xl px-4 py-2 font-semibold hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2 font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                Submit Ticket
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
