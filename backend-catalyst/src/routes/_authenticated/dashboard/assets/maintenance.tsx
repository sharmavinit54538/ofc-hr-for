import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Wrench,
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle2,
  DollarSign,
  Search,
  Hammer,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_MAINTENANCE, AssetMaintenanceRecord, AssetCategory } from "@/lib/assets/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/assets/maintenance")({
  component: MaintenancePage,
});

function MaintenancePage() {
  const [tickets, setTickets] = useState<AssetMaintenanceRecord[]>(MOCK_MAINTENANCE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    assetId: "AST-8845",
    assetName: 'iPad Pro 12.9" M2',
    category: "Tablet" as AssetCategory,
    assignedTo: "Ananya Deshmukh",
    issueDescription: "Battery overheating and rapid drain under load.",
    maintenanceType: "Battery Replacement" as AssetMaintenanceRecord["maintenanceType"],
    vendor: "Apple Enterprise Direct",
    estCompletion: "2026-08-08",
    cost: 120,
  });

  const filtered = tickets.filter(
    (t) =>
      t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vendor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: AssetMaintenanceRecord = {
      id: `mnt_${Date.now()}`,
      ticketId: `MNT-${Math.floor(4404 + Math.random() * 100)}`,
      assetId: formData.assetId,
      assetName: formData.assetName,
      category: formData.category,
      assignedTo: formData.assignedTo,
      issueDescription: formData.issueDescription,
      maintenanceType: formData.maintenanceType,
      vendor: formData.vendor,
      reportedDate: new Date().toISOString().split("T")[0]!,
      estCompletion: formData.estCompletion,
      cost: Number(formData.cost) || 0,
      status: "In Diagnostics",
    };

    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    toast.success("Maintenance Ticket Logged", {
      description: `Ticket ${newTicket.ticketId} assigned to ${formData.vendor}.`,
    });
  };

  const handleCompleteTicket = (id: string) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: "Completed" as const } : t)),
    );
    toast.success("Maintenance Resolved", {
      description: "Asset repaired, verified, and re-enabled in active inventory.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Maintenance & Servicing"
        description="Track hardware repair tickets, warranty claims, vendor RMAs, and servicing cost telemetry."
        breadcrumbs={[
          { label: "Asset Management", href: "/dashboard/assets" },
          { label: "Maintenance & Repair" },
        ]}
        backHref="/dashboard/assets"
        backLabel="Back to Asset Management"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Log Repair Ticket
          </button>
        }
      />

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Servicing Tickets</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {tickets.filter((t) => t.status !== "Completed").length}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Wrench className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Warranty Claims</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">4</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
            <Hammer className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Completed (This Month)</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">12</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Est. Maintenance Spend</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">$1,850</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <DollarSign className="size-5" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-tile flex items-center justify-between rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket ID, asset name, vendor..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {filtered.length} Repair Records
        </span>
      </div>

      {/* Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Ticket ID</th>
                <th className="px-5 py-3.5 font-bold">Asset Name</th>
                <th className="px-5 py-3.5 font-bold">Type</th>
                <th className="px-5 py-3.5 font-bold">Service Vendor</th>
                <th className="px-5 py-3.5 font-bold">Reported Date</th>
                <th className="px-5 py-3.5 font-bold">Est. ETA</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-mono font-bold text-primary">{t.ticketId}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-foreground">{t.assetName}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{t.assetId}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{t.maintenanceType}</td>
                  <td className="px-5 py-4 font-semibold text-foreground">{t.vendor}</td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{t.reportedDate}</td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{t.estCompletion}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        t.status === "Completed"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : t.status === "Repairing"
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                          : "border-sky-500/20 bg-sky-500/10 text-sky-400"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {t.status !== "Completed" ? (
                      <button
                        onClick={() => handleCompleteTicket(t.id)}
                        className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      >
                        Mark Fixed
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-muted-foreground">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Log Repair & Maintenance Ticket</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Schedule repair or warranty dispatch with authorized vendor.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="mt-4 space-y-3 text-xs">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Asset ID</label>
                <input
                  type="text"
                  required
                  value={formData.assetId}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={formData.assetName}
                  onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Issue Description</label>
              <textarea
                rows={2}
                required
                value={formData.issueDescription}
                onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none resize-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Service Vendor</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Estimated Cost ($)</label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                />
              </div>
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                Dispatch Ticket
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
