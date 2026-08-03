import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package,
  UserCheck,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  Clock,
  Plus,
  RotateCcw,
  FileSpreadsheet,
  Download,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Building2,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { MOCK_ASSETS, MOCK_CATEGORIES, MOCK_REQUESTS, MOCK_MAINTENANCE } from "@/lib/assets/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/assets/")({
  component: AssetDashboardLandingPage,
});

function AssetDashboardLandingPage() {
  const assetNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "assets");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Form State
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "Laptop",
    serialNumber: "",
    purchaseCost: "",
    department: "Product Engineering",
  });

  const [assignData, setAssignData] = useState({
    assetId: "AST-8843",
    employeeName: "",
    department: "Product Engineering",
  });

  const [returnData, setReturnData] = useState({
    assetId: "AST-8841",
    condition: "Pristine",
    notes: "",
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.serialNumber) {
      toast.error("Please fill in the required asset details.");
      return;
    }
    toast.success("Asset Registered Successfully", {
      description: `${newAsset.name} (SN: ${newAsset.serialNumber}) added to inventory.`,
    });
    setIsAddModalOpen(false);
    setNewAsset({ name: "", category: "Laptop", serialNumber: "", purchaseCost: "", department: "Product Engineering" });
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignData.employeeName) {
      toast.error("Please specify the recipient employee name.");
      return;
    }
    toast.success("Asset Assigned", {
      description: `Asset ${assignData.assetId} assigned to ${assignData.employeeName}.`,
    });
    setIsAssignModalOpen(false);
    setAssignData({ assetId: "AST-8843", employeeName: "", department: "Product Engineering" });
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Asset Check-in Processed", {
      description: `Asset ${returnData.assetId} returned into stock (Condition: ${returnData.condition}).`,
    });
    setIsReturnModalOpen(false);
  };

  const handleExport = () => {
    toast.success("Export Initiated", {
      description: "Asset inventory report generated as CSV.",
    });
  };

  const kpis = [
    { title: "Total Assets", value: "1,420", sub: "+8.4% this quarter", icon: Package, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Assigned Assets", value: "940", sub: "66.2% utilization rate", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Available Assets", value: "412", sub: "Ready for deployment", icon: CheckCircle2, color: "text-sky-500", bg: "bg-sky-500/10" },
    { title: "Under Maintenance", value: "48", sub: "8 critical repairs", icon: Wrench, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Lost Assets", value: "6", sub: "Under investigation", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Asset Requests", value: "14", sub: "Pending approval", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* ── Page Header & Quick Actions ────────────────────────────── */}
      <PageHeader
        title="Asset Management Command Center"
        description="Comprehensive enterprise hardware lifecycle registry. Track physical & digital assets, assignments, servicing, and procurement."
        breadcrumbs={[{ label: "Asset Management" }]}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" /> Hardware Lifecycle Telemetry
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Plus className="size-4" /> Add Asset
            </button>
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <UserCheck className="size-4 text-emerald-500" /> Assign Asset
            </button>
            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <RotateCcw className="size-4 text-amber-500" /> Return Asset
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <FileSpreadsheet className="size-4 text-indigo-500" /> Generate Report
            </button>
            <button
              onClick={handleExport}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <Download className="size-4 text-muted-foreground" /> Export
            </button>
          </div>
        }
      />

      {/* ── Top 6 KPI Cards ────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="glass-tile rounded-2xl p-4 transition-all hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kpi.title}
                </span>
                <div className={`flex size-8 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-display text-2xl font-bold text-foreground">
                  {kpi.value}
                </div>
                <p className="mt-0.5 text-[10px] font-medium text-muted-foreground truncate">
                  {kpi.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Category Hardware Distribution & Active Requests Bar ───── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hardware Distribution */}
        <div className="glass-tile space-y-4 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Hardware Portfolio Distribution
              </h3>
              <p className="text-xs text-muted-foreground">Asset counts and allocation ratio across major categories</p>
            </div>
            <Link
              to="/dashboard/assets/categories"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All 14 Categories <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {MOCK_CATEGORIES.slice(0, 5).map((cat) => {
              const pct = Math.round((cat.assignedCount / cat.totalCount) * 100);
              return (
                <div key={cat.name} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary" />
                      {cat.name}
                    </span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{cat.assignedCount}</strong> / {cat.totalCount} ({pct}% Assigned)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-gradient-brand transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Asset Requests Widget */}
        <div className="glass-tile space-y-4 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground">
              Pending Requisitions
            </h3>
            <Link to="/dashboard/assets/requests" className="text-xs font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_REQUESTS.slice(0, 3).map((req) => (
              <div key={req.id} className="rounded-xl border border-border/50 bg-card/40 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{req.itemName}</span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                    {req.priority} Priority
                  </span>
                </div>
                <p className="text-muted-foreground">Requested by {req.employeeName} ({req.department})</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                  <span>{req.requestDate}</span>
                  <span className="font-semibold text-primary">{req.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sub-Modules Grid ────────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Asset Management Sub-Modules
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {assetNav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>

      {/* ── Add Asset Modal ──────────────────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Add New Hardware Asset</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register a new hardware item into the enterprise inventory registry.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Asset Name</label>
              <input
                type="text"
                required
                placeholder="e.g. MacBook Pro 16 M3 Max"
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none focus:border-ring"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Category</label>
                <select
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as any })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer"
                >
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name} className="bg-card text-foreground">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Serial Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. C02G4109MD6R"
                  value={newAsset.serialNumber}
                  onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none focus:border-ring"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Purchase Cost ($)</label>
                <input
                  type="number"
                  placeholder="2499"
                  value={newAsset.purchaseCost}
                  onChange={(e) => setNewAsset({ ...newAsset, purchaseCost: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Target Department</label>
                <input
                  type="text"
                  value={newAsset.department}
                  onChange={(e) => setNewAsset({ ...newAsset, department: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none focus:border-ring"
                />
              </div>
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                Save Asset
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Assign Asset Modal ───────────────────────────────────────── */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Assign Asset to Employee</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Allocate available hardware to workforce members and issue digital handover certificates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignSubmit} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Select Available Asset</label>
              <select
                value={assignData.assetId}
                onChange={(e) => setAssignData({ ...assignData, assetId: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer"
              >
                {MOCK_ASSETS.map((a) => (
                  <option key={a.id} value={a.assetId} className="bg-card text-foreground">
                    {a.assetId} - {a.name} ({a.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Employee Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={assignData.employeeName}
                onChange={(e) => setAssignData({ ...assignData, employeeName: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none focus:border-ring"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Department</label>
              <input
                type="text"
                value={assignData.department}
                onChange={(e) => setAssignData({ ...assignData, department: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none focus:border-ring"
              />
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                Complete Handover
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Return Asset Modal ───────────────────────────────────────── */}
      <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Process Asset Return</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Check in assigned hardware, inspect physical condition, and schedule data wipe.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReturnSubmit} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Select Assigned Asset</label>
              <select
                value={returnData.assetId}
                onChange={(e) => setReturnData({ ...returnData, assetId: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer"
              >
                {MOCK_ASSETS.filter((a) => a.status === "Assigned").map((a) => (
                  <option key={a.id} value={a.assetId} className="bg-card text-foreground">
                    {a.assetId} - {a.name} ({a.assignedTo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Inspected Condition</label>
              <select
                value={returnData.condition}
                onChange={(e) => setReturnData({ ...returnData, condition: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer"
              >
                <option value="Pristine">Pristine / Like New</option>
                <option value="Fair">Fair / Normal Wear</option>
                <option value="Minor Damage">Minor Damage / Scratches</option>
                <option value="Severe Damage">Severe Damage / Repairs Needed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Inspection Notes</label>
              <textarea
                rows={2}
                placeholder="Optional notes on device state or accessories returned..."
                value={returnData.notes}
                onChange={(e) => setReturnData({ ...returnData, notes: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none focus:border-ring resize-none"
              />
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                Confirm Return & Restock
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Generate Report Modal ────────────────────────────────────── */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Generate Asset Report</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select report parameter and format to export hardware metrics.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Report Type</label>
              <select className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer">
                <option>Full Inventory & Valuation Summary</option>
                <option>Department-wise Hardware Allocation</option>
                <option>Asset Depreciation & Book Value</option>
                <option>Maintenance & Repair Log</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">File Format</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="format" defaultChecked className="accent-primary" /> PDF Executive Report
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="format" className="accent-primary" /> Excel (.xlsx) Data Sheet
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setIsReportModalOpen(false);
                toast.success("Report Generated", { description: "Download started automatically." });
              }}
              className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
            >
              Download Report
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
