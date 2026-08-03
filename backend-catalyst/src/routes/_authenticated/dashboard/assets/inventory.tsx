import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Package,
  User,
  Building2,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  Wrench,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import {
  MOCK_ASSETS,
  AssetRecord,
  AssetCategory,
  AssetStatus,
} from "@/lib/assets/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/dashboard/assets/inventory")({
  component: InventoryPage,
});

const ALL_CATEGORIES: (AssetCategory | "All Categories")[] = [
  "All Categories",
  "Laptop",
  "Desktop",
  "Monitor",
  "Mobile Phone",
  "Tablet",
  "Printer",
  "Biometric Device",
  "ID Card",
  "Access Card",
  "Headset",
  "Keyboard",
  "Mouse",
  "Office Furniture",
  "Other",
];

const ALL_STATUSES: (AssetStatus | "All Statuses")[] = [
  "All Statuses",
  "Available",
  "Assigned",
  "Maintenance",
  "Lost",
  "Retired",
];

function InventoryPage() {
  const [assets, setAssets] = useState<AssetRecord[]>(MOCK_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | "All Categories">("All Categories");
  const [selectedStatus, setSelectedStatus] = useState<AssetStatus | "All Statuses">("All Statuses");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<AssetRecord | null>(null);
  const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<AssetRecord | null>(null);

  // Form State for Add
  const [formData, setFormData] = useState({
    name: "",
    category: "Laptop" as AssetCategory,
    assignedTo: "Unassigned",
    department: "Product Engineering",
    status: "Available" as AssetStatus,
    purchaseDate: new Date().toISOString().split("T")[0],
    warranty: "Active (3 Years)",
    serialNumber: "",
    purchaseCost: 1200,
    location: "Bengaluru HQ - IT Stock Room",
    vendor: "Apple Enterprise Direct",
  });

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "All Categories" || asset.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All Statuses" || asset.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [assets, searchQuery, selectedCategory, selectedStatus]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.serialNumber.trim()) {
      toast.error("Please enter asset name and serial number.");
      return;
    }

    const newRecord: AssetRecord = {
      id: `ast_${Date.now()}`,
      assetId: `AST-${Math.floor(8850 + Math.random() * 900)}`,
      name: formData.name.trim(),
      category: formData.category,
      assignedTo: formData.assignedTo.trim() || "Unassigned",
      department: formData.department,
      status: formData.status,
      purchaseDate: formData.purchaseDate || new Date().toISOString().split("T")[0]!,
      warranty: formData.warranty,
      serialNumber: formData.serialNumber.trim(),
      purchaseCost: Number(formData.purchaseCost) || 0,
      currentValue: Number(formData.purchaseCost) || 0,
      location: formData.location,
      vendor: formData.vendor,
    };

    setAssets([newRecord, ...assets]);
    setIsAddModalOpen(false);
    toast.success("Asset Added to Inventory", {
      description: `${newRecord.name} (${newRecord.assetId}) successfully registered.`,
    });

    setFormData({
      name: "",
      category: "Laptop",
      assignedTo: "Unassigned",
      department: "Product Engineering",
      status: "Available",
      purchaseDate: new Date().toISOString().split("T")[0],
      warranty: "Active (3 Years)",
      serialNumber: "",
      purchaseCost: 1200,
      location: "Bengaluru HQ - IT Stock Room",
      vendor: "Apple Enterprise Direct",
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    setAssets(assets.map((a) => (a.id === editingAsset.id ? editingAsset : a)));
    setEditingAsset(null);
    toast.success("Asset Updated", {
      description: `Saved changes for ${editingAsset.assetId}.`,
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingAsset) return;
    setAssets(assets.filter((a) => a.id !== deletingAsset.id));
    toast.success("Asset Removed", {
      description: `Asset ${deletingAsset.assetId} deleted from system.`,
    });
    setDeletingAsset(null);
  };

  const renderStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold text-sky-400">
            <CheckCircle2 className="size-3" /> Available
          </span>
        );
      case "Assigned":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
            <UserCheck className="size-3" /> Assigned
          </span>
        );
      case "Maintenance":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
            <Wrench className="size-3" /> Maintenance
          </span>
        );
      case "Lost":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
            <AlertTriangle className="size-3" /> Lost
          </span>
        );
      case "Retired":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
            <XCircle className="size-3" /> Retired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Asset Inventory Registry"
        description="Comprehensive hardware and equipment inventory table. View details, serial numbers, allocation status, and warranties."
        breadcrumbs={[
          { label: "Asset Management", href: "/dashboard/assets" },
          { label: "Inventory" },
        ]}
        backHref="/dashboard/assets"
        backLabel="Back to Asset Management"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success("Exporting Inventory CSV")}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <Download className="size-3.5" /> Export CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Plus className="size-4" /> Add Asset
            </button>
          </div>
        }
      />

      {/* ── Filter Toolbar ────────────────────────────────────── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Asset ID, Name, Serial No, Employee, Dept..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5">
            <Filter className="mr-2 size-3.5 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-card text-foreground">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
            >
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st} className="bg-card text-foreground">
                  {st}
                </option>
              ))}
            </select>
          </div>

          <span className="glass-tile rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground">
            Total ({filteredAssets.length})
          </span>
        </div>
      </div>

      {/* ── Asset Inventory Table ───────────────────────────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Asset ID</th>
                <th className="px-5 py-3.5 font-bold">Asset Name</th>
                <th className="px-5 py-3.5 font-bold">Category</th>
                <th className="px-5 py-3.5 font-bold">Assigned To</th>
                <th className="px-5 py-3.5 font-bold">Department</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold">Purchase Date</th>
                <th className="px-5 py-3.5 font-bold">Warranty</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-mono font-bold text-primary">
                    {asset.assetId}
                  </td>
                  <td className="px-5 py-4 font-bold text-foreground">
                    <div>
                      <p>{asset.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">SN: {asset.serialNumber}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-lg bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                      {asset.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-foreground font-medium">
                    {asset.assignedTo}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{asset.department}</td>
                  <td className="px-5 py-4">{renderStatusBadge(asset.status)}</td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{asset.purchaseDate}</td>
                  <td className="px-5 py-4 text-muted-foreground text-[11px] font-medium">{asset.warranty}</td>
                  <td className="px-5 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 glass-elevated rounded-xl p-1.5">
                        <DropdownMenuItem
                          onClick={() => setViewingAsset(asset)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer"
                        >
                          <Eye className="size-4 text-muted-foreground" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEditingAsset(asset)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer"
                        >
                          <Pencil className="size-4 text-muted-foreground" /> Edit Asset
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-border/60" />
                        <DropdownMenuItem
                          onClick={() => setDeletingAsset(asset)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-destructive cursor-pointer hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4 text-destructive" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Asset Dialog ─────────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Add Inventory Asset</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register a new hardware item into Northwind's central repository.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Asset Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MacBook Pro 16 M3 Max"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as AssetCategory })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none cursor-pointer"
                >
                  {ALL_CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                    <option key={c} value={c} className="bg-card text-foreground">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none cursor-pointer"
                >
                  {ALL_STATUSES.filter((s) => s !== "All Statuses").map((s) => (
                    <option key={s} value={s} className="bg-card text-foreground">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="C02G4109MD6R"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Assigned To
                </label>
                <input
                  type="text"
                  placeholder="Employee Name or Unassigned"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
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
                Create Asset
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── View Details Modal ────────────────────────────────── */}
      <Dialog open={Boolean(viewingAsset)} onOpenChange={(o) => !o && setViewingAsset(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          {viewingAsset && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground font-display text-lg font-bold shadow-glow">
                    {viewingAsset.category.charAt(0)}
                  </div>
                  <div>
                    <DialogTitle className="font-display text-lg font-bold">
                      {viewingAsset.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground font-mono">
                      {viewingAsset.assetId} · SN: {viewingAsset.serialNumber}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-3 rounded-xl border border-border/60 bg-card/40 p-4 text-xs">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-bold text-foreground">{viewingAsset.category}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Assigned User:</span>
                  <span className="font-bold text-foreground">{viewingAsset.assignedTo}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold text-foreground">{viewingAsset.department}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Status:</span>
                  {renderStatusBadge(viewingAsset.status)}
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span className="font-semibold text-foreground">{viewingAsset.vendor}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-semibold text-foreground">{viewingAsset.location}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">Original Cost:</span>
                  <span className="font-bold text-primary">${viewingAsset.purchaseCost}</span>
                </div>
              </div>

              <DialogFooter className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingAsset(null)}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  Close
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Edit Details Modal ────────────────────────────────── */}
      <Dialog open={Boolean(editingAsset)} onOpenChange={(o) => !o && setEditingAsset(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          {editingAsset && (
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold">Edit Asset {editingAsset.assetId}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Update asset details and assignments.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={editingAsset.name}
                    onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                    className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Assigned To</label>
                    <input
                      type="text"
                      value={editingAsset.assignedTo}
                      onChange={(e) => setEditingAsset({ ...editingAsset, assignedTo: e.target.value })}
                      className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Department</label>
                    <input
                      type="text"
                      value={editingAsset.department}
                      onChange={(e) => setEditingAsset({ ...editingAsset, department: e.target.value })}
                      className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Status</label>
                    <select
                      value={editingAsset.status}
                      onChange={(e) => setEditingAsset({ ...editingAsset, status: e.target.value as AssetStatus })}
                      className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer"
                    >
                      {ALL_STATUSES.filter((s) => s !== "All Statuses").map((s) => (
                        <option key={s} value={s} className="bg-card text-foreground">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Warranty Info</label>
                    <input
                      type="text"
                      value={editingAsset.warranty}
                      onChange={(e) => setEditingAsset({ ...editingAsset, warranty: e.target.value })}
                      className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  Save Changes
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Modal ─────────────────────────── */}
      <Dialog open={Boolean(deletingAsset)} onOpenChange={(o) => !o && setDeletingAsset(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <div className="flex items-center gap-3 text-destructive mb-1">
              <div className="grid size-10 place-items-center rounded-xl bg-destructive/10">
                <AlertTriangle className="size-5" />
              </div>
              <DialogTitle className="font-display text-xl font-bold">Remove Asset</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-2">
              Are you sure you want to delete <strong className="text-foreground">{deletingAsset?.name} ({deletingAsset?.assetId})</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeletingAsset(null)}
              className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="rounded-xl bg-destructive px-5 py-2 text-xs font-semibold text-destructive-foreground shadow-glow"
            >
              Delete Permanently
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
