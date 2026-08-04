import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Ticket, Plus, Clock, CheckCircle2, AlertCircle, Search, Filter, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
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

export const Route = createFileRoute("/_authenticated/dashboard/helpdesk/")({
  component: HelpdeskIndexPage,
});

function HelpdeskIndexPage() {
  const { data: ticketsRes, isLoading } = useGetEmployeeTicketsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createTicket, { isLoading: isSubmitting }] = useCreateTicketMutation();

  const tickets = ticketsRes?.data ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("IT Support");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [description, setDescription] = useState("");

  const filteredTickets = tickets.filter((t) => {
    const ticketId = t.ticket_number || t.id || "";
    const matchesSearch =
      (t.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assigned_to || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in subject and description.");
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
        toast.success("Ticket Submitted Successfully", {
          description: `Ticket ${res.data?.ticket_number || res.data?.id || ""} logged.`,
        });
        setIsNewTicketOpen(false);
        setSubject("");
        setDescription("");
      } else {
        toast.error("Failed to submit ticket", { description: res.message });
      }
    } catch (err: any) {
      toast.error("Error submitting ticket", {
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
      <PageHeader
        title="Enterprise Helpdesk & Service Desk"
        description="Manage IT, HR Operations, Payroll, and Facilities support tickets across the organization."
        actions={
          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:opacity-90 transition-all"
          >
            <Plus className="size-4" /> Log New Ticket
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-500/10 p-2.5 text-sky-500">
              <Ticket className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
              <p className="text-xl font-bold">{tickets.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-500">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">In Progress / Open</p>
              <p className="text-xl font-bold">{tickets.filter((t) => t.status === "In Progress" || t.status === "Open").length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="text-xl font-bold">{tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2.5 text-purple-500">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Critical Priority</p>
              <p className="text-xl font-bold">{tickets.filter((t) => t.priority === "Critical" || t.priority === "High").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, assigned..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Categories</option>
            <option value="IT Support">IT Support</option>
            <option value="Payroll & Benefits">Payroll & Benefits</option>
            <option value="Hardware & Devices">Hardware & Devices</option>
            <option value="Facilities & Security">Facilities & Security</option>
          </select>
        </div>
      </div>

      {/* Ticket List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2 border rounded-xl bg-card">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading helpdesk tickets from backend...
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Helpdesk Tickets Found</p>
          <p className="text-[11px] max-w-xs">
            There are currently no tickets logged. Click "Log New Ticket" above to submit a support request.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <div key={t.id} className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/50">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-primary">{t.ticket_number || t.id}</span>
                  <h3 className="text-sm font-semibold text-foreground">{t.subject}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] ${priorityColors[t.priority] || ""}`}>
                    {t.priority}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusColors[t.status] || ""}`}>
                    {t.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Category:</span> {t.category}
                </div>
                <div>
                  <span className="font-medium text-foreground">Assigned:</span> {t.assigned_to || "Unassigned"} · <span className="font-medium text-foreground">Created:</span> {t.created_at || "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Ticket Modal */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log New Support Ticket</DialogTitle>
            <DialogDescription>Submit your request directly to IT Support or HR Operations.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTicket} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-foreground">Ticket Subject</label>
              <input
                type="text"
                placeholder="Brief summary of the issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 rounded-lg border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 rounded-lg border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="IT Support">IT Support</option>
                  <option value="Payroll & Benefits">Payroll & Benefits</option>
                  <option value="Hardware & Devices">Hardware & Devices</option>
                  <option value="Facilities & Security">Facilities & Security</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full mt-1 rounded-lg border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Description</label>
              <textarea
                rows={3}
                placeholder="Provide detailed information regarding your request..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 rounded-lg border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <button
                type="button"
                onClick={() => setIsNewTicketOpen(false)}
                disabled={isSubmitting}
                className="rounded-lg border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
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
