import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { useListAssetsQuery, useUpdateAssetMutation } from "@/services/assetsApi";
import { toast } from "sonner";
import {
  CheckCircle2,
  Inbox,
  AlertTriangle,
  RefreshCw,
  Tag,
  Barcode,
  Search,
  ShieldCheck,
} from "lucide-react";
import { AssetCondition } from "@/types/asset";

export const Route = createFileRoute("/_authenticated/dashboard/assets/audit")({
  component: AssetAuditPage,
});

function AssetAuditPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useListAssetsQuery({
    page: 1,
    page_size: 30,
    search: search || undefined,
  });

  const [updateAsset] = useUpdateAssetMutation();

  const assets = data?.data?.items ?? [];

  const handleVerifyCondition = async (id: string, condition: AssetCondition) => {
    try {
      await updateAsset({ id, body: { condition } }).unwrap();
      toast.success(`Asset physical condition verified as ${condition}.`);
    } catch {
      toast.error("Failed to verify asset condition.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Verification & Audit Logs"
        description="Conduct physical inventory audits, verify serial barcodes, confirm condition integrity, and maintain compliance trail."
        breadcrumbs={[
          { label: "Assets", href: "/dashboard/assets" },
          { label: "Audit & Verification" },
        ]}
      />

      {/* ── Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asset tags or serial numbers for audit verification..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
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
            Failed to load audit inventory
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching audit assets from PostgreSQL.
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
            No assets for audit verification
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No inventory items registered in PostgreSQL for audit logging.
          </p>
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
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Condition: {asset.condition}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {asset.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Barcode className="size-3 text-muted-foreground/70" /> SN: {asset.serial_number}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Location: <span className="text-foreground font-semibold">{asset.location || "HQ"}</span> · Department: <span className="text-foreground font-semibold">{asset.department || "General"}</span>
                </p>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground">Audit Check:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleVerifyCondition(asset.id, "EXCELLENT")}
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                  >
                    Pristine
                  </button>
                  <button
                    onClick={() => handleVerifyCondition(asset.id, "GOOD")}
                    className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-500 hover:bg-blue-500/20"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => handleVerifyCondition(asset.id, "DAMAGED")}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-semibold text-rose-500 hover:bg-rose-500/20"
                  >
                    Damaged
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
