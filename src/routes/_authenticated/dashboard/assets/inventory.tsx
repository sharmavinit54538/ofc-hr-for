import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListAssetsQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useListAssetCategoriesQuery,
  useListAssetVendorsQuery,
  useExportAssetsReportMutation,
} from "@/services/assetsApi";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Download,
  Inbox,
  AlertTriangle,
  RefreshCw,
  Package,
  Trash2,
  Filter,
  Tag,
  DollarSign,
  MapPin,
  Barcode,
  QrCode,
} from "lucide-react";
import { AssetStatus, AssetCondition, AssetItem } from "@/types/asset";
import { AssetQrModal } from "@/components/admin/asset-qr-modal";

export const Route = createFileRoute("/_authenticated/dashboard/assets/inventory")({
  component: AssetInventoryPage,
});

function AssetInventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedQrAsset, setSelectedQrAsset] = useState<AssetItem | null>(null);

  // Form states
  const [tagId, setTagId] = useState(`AST-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [purchaseCost, setPurchaseCost] = useState<number>(1200);
  const [department, setDepartment] = useState("Product Engineering");
  const [location, setLocation] = useState("HQ");

  // API Hooks
  const { data, isLoading, isError, refetch } = useListAssetsQuery({
    page,
    page_size: 15,
    search: search || undefined,
    status: statusFilter || undefined,
    category_id: categoryFilter || undefined,
  });

  const { data: categoriesData } = useListAssetCategoriesQuery();
  const { data: vendorsData } = useListAssetVendorsQuery();

  const [createAsset, { isLoading: isCreating }] = useCreateAssetMutation();
  const [updateAsset] = useUpdateAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();
  const [exportReport, { isLoading: isExporting }] = useExportAssetsReportMutation();

  const assets = data?.data?.items ?? [];
  const totalPages = data?.data?.total_pages ?? 1;
  const categories = categoriesData?.data ?? [];
  const vendors = vendorsData?.data ?? [];

  const handleExport = async () => {
    try {
      const blob = await exportReport({ format: "csv" }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assets_inventory_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Assets inventory report exported.");
    } catch {
      toast.error("Failed to export report.");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagId || !name || !serialNumber) {
      toast.error("Please fill in Asset Tag, Name, and Serial Number.");
      return;
    }

    try {
      await createAsset({
        tag_id: tagId,
        name,
        serial_number: serialNumber,
        category_id: categoryId || undefined,
        vendor_id: vendorId || undefined,
        purchase_cost: purchaseCost,
        department,
        location,
      }).unwrap();

      toast.success("Asset registered in inventory successfully.");
      setIsCreateOpen(false);
      setName("");
      setSerialNumber("");
      setTagId(`AST-${Math.floor(1000 + Math.random() * 9000)}`);
    } catch {
      toast.error("Failed to create asset.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset from inventory?")) return;
    try {
      await deleteAsset(id).unwrap();
      toast.success("Asset deleted.");
    } catch {
      toast.error("Failed to delete asset.");
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case "AVAILABLE":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Available</span>;
      case "ASSIGNED":
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">Assigned</span>;
      case "IN_REPAIR":
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">In Repair</span>;
      case "DAMAGED":
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-500">Damaged</span>;
      case "LOST":
        return <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-500">Lost</span>;
      default:
        return <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">Disposed</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Inventory"
        description="Comprehensive list of company hardware, electronics, licenses, and furniture."
        breadcrumbs={[
          { label: "Assets", href: "/dashboard/assets" },
          { label: "Inventory" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-50"
            >
              <Download className="size-3.5" /> {isExporting ? "Exporting..." : "Export CSV"}
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Plus className="size-4" /> Register Asset
            </button>
          </div>
        }
      />

      {/* ── Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search assets by tag, name, or serial number..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_REPAIR">In Repair</option>
              <option value="DAMAGED">Damaged</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-tile h-36 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load asset inventory
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching asset records from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : assets.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No assets found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No asset records exist in PostgreSQL matching your criteria.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Register Asset
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    <Tag className="size-3" /> {asset.tag_id}
                  </span>
                  {getStatusBadge(asset.status)}
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {asset.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Barcode className="size-3 text-muted-foreground/70" /> SN: {asset.serial_number}
                </p>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>Category: <span className="text-foreground font-semibold">{asset.category_name || "General"}</span></p>
                  {asset.assigned_to_name && (
                    <p className="text-emerald-500 font-semibold">Assigned to: {asset.assigned_to_name}</p>
                  )}
                  <p className="flex items-center gap-1">
                    <MapPin className="size-3" /> {asset.location} · {asset.department}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-0.5">
                  <DollarSign className="size-3.5 text-muted-foreground" /> {asset.purchase_cost.toLocaleString()}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedQrAsset(asset)}
                    className="inline-flex items-center gap-1 rounded-xl bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                    title="View & Print Asset QR Code"
                  >
                    <QrCode className="size-3.5" /> Scan QR
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Asset QR Code Modal ── */}
      <AssetQrModal
        asset={selectedQrAsset}
        isOpen={!!selectedQrAsset}
        onClose={() => setSelectedQrAsset(null)}
      />

      {/* ── Register Asset Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Register New Asset
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Asset Tag ID
                  </label>
                  <input
                    type="text"
                    required
                    value={tagId}
                    onChange={(e) => setTagId(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    required
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. C02F1234MD6R"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Asset Name / Model
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MacBook Pro 16 M3 Max"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Vendor
                  </label>
                  <select
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value="">Select Vendor...</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Purchase Cost ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isCreating ? "Saving..." : "Register Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
