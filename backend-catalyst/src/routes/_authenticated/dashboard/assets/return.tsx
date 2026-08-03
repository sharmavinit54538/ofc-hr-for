import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
  ShieldCheck,
  PackageCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_ASSETS } from "@/lib/assets/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/assets/return")({
  component: AssetReturnPage,
});

interface ReturnItem {
  id: string;
  assetId: string;
  assetName: string;
  assignedTo: string;
  department: string;
  returnReason: "Resignation / Offboarding" | "Device Upgrade" | "Repair / Replacement";
  condition: "Pristine" | "Fair" | "Minor Damage" | "Damaged";
  dataWipe: "Verified & Wiped" | "Pending Data Wipe";
  returnDate: string;
}

function AssetReturnPage() {
  const [returnLogs, setReturnLogs] = useState<ReturnItem[]>([
    {
      id: "ret-1",
      assetId: "AST-8822",
      assetName: 'MacBook Pro 14" M2 Pro',
      assignedTo: "Karan Singh",
      department: "Product Engineering",
      returnReason: "Resignation / Offboarding",
      condition: "Pristine",
      dataWipe: "Verified & Wiped",
      returnDate: "2026-07-28",
    },
    {
      id: "ret-2",
      assetId: "AST-8819",
      assetName: "Dell Latitude 5530",
      assignedTo: "Neha Sharma",
      department: "Human Resources",
      returnReason: "Device Upgrade",
      condition: "Fair",
      dataWipe: "Pending Data Wipe",
      returnDate: "2026-08-01",
    },
  ]);

  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetId: "AST-8841",
    condition: "Pristine" as ReturnItem["condition"],
    reason: "Resignation / Offboarding" as ReturnItem["returnReason"],
    notes: "",
  });

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = MOCK_ASSETS.find((a) => a.assetId === formData.assetId) ?? MOCK_ASSETS[0]!;

    const newReturn: ReturnItem = {
      id: `ret_${Date.now()}`,
      assetId: targetAsset.assetId,
      assetName: targetAsset.name,
      assignedTo: targetAsset.assignedTo || "Employee",
      department: targetAsset.department,
      returnReason: formData.reason,
      condition: formData.condition,
      dataWipe: "Pending Data Wipe",
      returnDate: new Date().toISOString().split("T")[0]!,
    };

    setReturnLogs([newReturn, ...returnLogs]);
    setIsCheckinModalOpen(false);
    toast.success("Asset Check-in Completed", {
      description: `${targetAsset.assetId} checked into storage. Data wipe scheduled.`,
    });
  };

  const handleRunDataWipe = (id: string) => {
    setReturnLogs(
      returnLogs.map((item) =>
        item.id === id ? { ...item, dataWipe: "Verified & Wiped" as const } : item,
      ),
    );
    toast.success("Remote Data Wipe Complete", {
      description: "Cryptographic disk wipe verified & certificate generated.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Return & Offboarding Check-in"
        description="Receive returned employee hardware, log device physical state, enforce security data wiping, and return assets to available inventory."
        breadcrumbs={[
          { label: "Asset Management", href: "/dashboard/assets" },
          { label: "Return Asset" },
        ]}
        backHref="/dashboard/assets"
        backLabel="Back to Asset Management"
        actions={
          <button
            onClick={() => setIsCheckinModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <RotateCcw className="size-4" /> Process Device Return
          </button>
        }
      />

      {/* KPI Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Returns Processed (This Month)</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">18</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <PackageCheck className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Security Data Wipes</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {returnLogs.filter((r) => r.dataWipe.includes("Pending")).length}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <RefreshCw className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Offboarding Hardware Pending</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">3</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle className="size-5" />
          </div>
        </div>
      </div>

      {/* Returns Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60 font-display text-sm font-bold text-foreground">
          Recent Equipment Returns Log
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Asset ID</th>
                <th className="px-5 py-3.5 font-bold">Asset Name</th>
                <th className="px-5 py-3.5 font-bold">Returned By</th>
                <th className="px-5 py-3.5 font-bold">Reason</th>
                <th className="px-5 py-3.5 font-bold">Condition</th>
                <th className="px-5 py-3.5 font-bold">Security Wipe</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {returnLogs.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-mono font-bold text-primary">{item.assetId}</td>
                  <td className="px-5 py-4 font-bold text-foreground">{item.assetName}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{item.assignedTo}</p>
                    <p className="text-[11px] text-muted-foreground">{item.department}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{item.returnReason}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-foreground border border-border/60">
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {item.dataWipe.includes("Verified") ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        <ShieldCheck className="size-3" /> Wiped & Certified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                        <RefreshCw className="size-3 animate-spin" /> Pending Wipe
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {item.dataWipe.includes("Pending") && (
                      <button
                        onClick={() => handleRunDataWipe(item.id)}
                        className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-[11px] font-bold text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20"
                      >
                        Execute Wipe
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Modal */}
      <Dialog open={isCheckinModalOpen} onOpenChange={setIsCheckinModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Process Equipment Return</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Inspect device, record return cause, and restock hardware.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCheckinSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Select Returned Asset
              </label>
              <select
                value={formData.assetId}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none cursor-pointer"
              >
                {MOCK_ASSETS.filter((a) => a.status === "Assigned").map((a) => (
                  <option key={a.id} value={a.assetId} className="bg-card text-foreground">
                    {a.assetId} - {a.name} ({a.assignedTo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Return Reason
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value as any })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="Resignation / Offboarding">Resignation / Offboarding</option>
                <option value="Device Upgrade">Device Upgrade</option>
                <option value="Repair / Replacement">Repair / Replacement</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Physical Inspection Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="Pristine">Pristine / Like New</option>
                <option value="Fair">Fair / Minor Scratches</option>
                <option value="Minor Damage">Minor Damage</option>
                <option value="Damaged">Damaged / Non-functional</option>
              </select>
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckinModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                Check-in & Restock
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
