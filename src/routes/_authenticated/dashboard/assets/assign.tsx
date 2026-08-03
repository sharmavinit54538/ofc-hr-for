import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Send,
  FileCheck,
  ShieldCheck,
  Laptop,
  Mail,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_ASSETS, AssetRecord } from "@/lib/assets/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/assets/assign")({
  component: AssetAssignmentPage,
});

function AssetAssignmentPage() {
  const [assignedAssets, setAssignedAssets] = useState<AssetRecord[]>(() =>
    MOCK_ASSETS.filter((a) => a.status === "Assigned"),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    assetId: "AST-8843",
    employeeName: "",
    employeeId: "NW-1210",
    email: "",
    department: "Product Engineering",
    notes: "Assigned for remote onboarding workstation setup.",
  });

  const filtered = assignedAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName.trim()) {
      toast.error("Please enter the recipient employee's name.");
      return;
    }

    const newAssignment: AssetRecord = {
      id: `ast_assign_${Date.now()}`,
      assetId: formData.assetId,
      name: `Assigned Hardware (${formData.assetId})`,
      category: "Laptop",
      assignedTo: formData.employeeName,
      assignedEmail: formData.email || `${formData.employeeName.toLowerCase().replace(/ /g, ".")}@northwind.com`,
      employeeId: formData.employeeId,
      department: formData.department,
      status: "Assigned",
      purchaseDate: "2024-05-20",
      warranty: "Active",
      serialNumber: "SN-ASSIGNED-8843",
      purchaseCost: 2400,
      currentValue: 2100,
      location: `${formData.department} Office`,
      vendor: "Apple Enterprise Direct",
    };

    setAssignedAssets([newAssignment, ...assignedAssets]);
    setIsAssignModalOpen(false);
    toast.success("Asset Assigned & Dispatched", {
      description: `Dispatched ${formData.assetId} to ${formData.employeeName}. Digital sign-off link sent.`,
    });

    setFormData({
      assetId: "AST-8843",
      employeeName: "",
      employeeId: "NW-1210",
      email: "",
      department: "Product Engineering",
      notes: "Assigned for remote onboarding workstation setup.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Assignment & Handover"
        description="Allocate company hardware to workforce members. Track active handovers, e-signatures, and serial assignments."
        breadcrumbs={[
          { label: "Asset Management", href: "/dashboard/assets" },
          { label: "Assign Asset" },
        ]}
        backHref="/dashboard/assets"
        backLabel="Back to Asset Management"
        actions={
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> New Assignment Handover
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Handovers</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">{assignedAssets.length}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <UserCheck className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Available Hardware Pool</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">412</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
            <Laptop className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending E-Signatures</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">5</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="size-5" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-tile flex items-center justify-between rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter assigned hardware by employee or Asset ID..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          Showing {filtered.length} active assignments
        </span>
      </div>

      {/* Assignment Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Asset ID</th>
                <th className="px-5 py-3.5 font-bold">Asset Name</th>
                <th className="px-5 py-3.5 font-bold">Assigned Employee</th>
                <th className="px-5 py-3.5 font-bold">Department</th>
                <th className="px-5 py-3.5 font-bold">Serial Number</th>
                <th className="px-5 py-3.5 font-bold">Sign-off Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-mono font-bold text-primary">{item.assetId}</td>
                  <td className="px-5 py-4 font-bold text-foreground">{item.name}</td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-bold text-foreground">{item.assignedTo}</p>
                      <p className="text-[11px] text-muted-foreground">{item.assignedEmail || `${item.employeeId || "NW-1000"}`}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{item.department}</td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{item.serialNumber}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      <FileCheck className="size-3" /> Signed Receipt
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => toast.info(`Resent sign-off reminder for ${item.assetId}`)}
                      className="glass-tile rounded-lg px-3 py-1.5 text-[11px] font-semibold hover:bg-secondary"
                    >
                      Resend Link
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Assign Asset to Employee</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select available hardware and record workforce handover parameters.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Select Available Hardware
              </label>
              <select
                value={formData.assetId}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="AST-8843">AST-8843 - ThinkPad P1 Gen 6 Workstation (Available)</option>
                <option value="AST-8855">AST-8855 - Dell XPS 15 9530 (Available)</option>
                <option value="AST-8860">AST-8860 - MacBook Air 15 M3 16GB (Available)</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Employee Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  placeholder="NW-1210"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Employee Email
                </label>
                <input
                  type="email"
                  placeholder="vikram@northwind.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Handover Notes / Condition
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring resize-none"
              />
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
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
                Issue & Dispatch
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
