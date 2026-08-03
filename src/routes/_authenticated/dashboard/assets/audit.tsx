import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ClipboardCheck,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  RefreshCw,
  MapPin,
  Barcode,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_AUDITS, AuditRecord } from "@/lib/assets/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/assets/audit")({
  component: StockAuditPage,
});

function StockAuditPage() {
  const [audits, setAudits] = useState<AuditRecord[]>(MOCK_AUDITS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");

  const filtered = audits.filter(
    (a) =>
      a.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSimulateScan = () => {
    if (!scannedBarcode.trim()) {
      toast.error("Please enter a valid barcode / QR string.");
      return;
    }

    toast.success("Barcode Scanned & Verified", {
      description: `Tag [${scannedBarcode}] matched asset in Bengaluru HQ - Floor 4. Record updated.`,
    });
    setIsScannerOpen(false);
    setScannedBarcode("");
  };

  const handleMarkVerified = (id: string) => {
    setAudits(
      audits.map((a) => (a.id === id ? { ...a, scanStatus: "Verified" as const, lastScannedDate: "Just now" } : a)),
    );
    toast.success("Stock Record Verified", {
      description: "Physical audit verified by auditor.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Audit & Physical Verification"
        description="Barcoding, RFID tag scanning, physical stock reconciliation, and location discrepancy alerts."
        breadcrumbs={[
          { label: "Asset Management", href: "/dashboard/assets" },
          { label: "Stock Audit" },
        ]}
        backHref="/dashboard/assets"
        backLabel="Back to Asset Management"
        actions={
          <button
            onClick={() => setIsScannerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <QrCode className="size-4" /> Scan Barcode / QR Tag
          </button>
        }
      />

      {/* Audit Telemetry */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Q3 Audit Campaign</p>
            <p className="font-display text-xl font-bold text-foreground mt-1">99.1% Verified</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Scanned Today</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">142</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
            <Barcode className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location Mismatches</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">3</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <MapPin className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unverified Flagged</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">1</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle className="size-5" />
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
            placeholder="Search barcode, serial number, location..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {filtered.length} Audit Records
        </span>
      </div>

      {/* Audit Items Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Asset ID</th>
                <th className="px-5 py-3.5 font-bold">Asset Name</th>
                <th className="px-5 py-3.5 font-bold">Barcode / QR</th>
                <th className="px-5 py-3.5 font-bold">Assigned User</th>
                <th className="px-5 py-3.5 font-bold">Scanned Location</th>
                <th className="px-5 py-3.5 font-bold">Audit Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-mono font-bold text-primary">{item.assetId}</td>
                  <td className="px-5 py-4 font-bold text-foreground">{item.assetName}</td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{item.barcode}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{item.assignedTo}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.location}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        item.scanStatus === "Verified"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : item.scanStatus === "Location Mismatch"
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                          : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {item.scanStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {item.scanStatus !== "Verified" ? (
                      <button
                        onClick={() => handleMarkVerified(item.id)}
                        className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      >
                        Verify Location
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-muted-foreground">Scanned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scanner Simulation Modal */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">QR / Barcode Scanner Terminal</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Point physical handheld scanner or enter barcode tag to match asset.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4 text-xs">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center">
              <QrCode className="size-12 text-primary animate-pulse" />
              <p className="mt-2 font-semibold text-foreground">Camera / Barcode Reader Ready</p>
              <p className="text-[11px] text-muted-foreground">Align QR code tag within frame</p>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Manual Barcode Input</label>
              <input
                type="text"
                placeholder="BAR-8841-MAC"
                value={scannedBarcode}
                onChange={(e) => setScannedBarcode(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none font-mono"
              />
            </div>
          </div>

          <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsScannerOpen(false)}
              className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSimulateScan}
              className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
            >
              Verify Tag Match
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
