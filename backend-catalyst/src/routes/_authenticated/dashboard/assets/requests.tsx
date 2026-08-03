import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FilePlus,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  UserCheck,
  AlertCircle,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_REQUESTS, AssetRequestRecord, AssetCategory } from "@/lib/assets/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/assets/requests")({
  component: AssetRequestsPage,
});

function AssetRequestsPage() {
  const [requests, setRequests] = useState<AssetRequestRecord[]>(MOCK_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    employeeName: "",
    department: "Product Engineering",
    requestedCategory: "Laptop" as AssetCategory,
    itemName: 'MacBook Pro 16" M3 Max',
    reason: "New Hire Compute Requisition",
    priority: "High" as AssetRequestRecord["priority"],
  });

  const filtered = requests.filter(
    (r) =>
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "IT Approved" as const } : r)),
    );
    toast.success("Request Approved", {
      description: "Hardware request approved. IT hardware dispatch initiated.",
    });
  };

  const handleReject = (id: string) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "Rejected" as const } : r)),
    );
    toast.info("Request Rejected", {
      description: "Requisition declined and employee notified.",
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName.trim()) {
      toast.error("Please enter employee name.");
      return;
    }

    const newReq: AssetRequestRecord = {
      id: `req_${Date.now()}`,
      requestId: `REQ-${Math.floor(9905 + Math.random() * 100)}`,
      employeeName: formData.employeeName.trim(),
      employeeId: `NW-${Math.floor(1200 + Math.random() * 100)}`,
      department: formData.department,
      requestedCategory: formData.requestedCategory,
      itemName: formData.itemName,
      reason: formData.reason,
      priority: formData.priority,
      requestDate: new Date().toISOString().split("T")[0]!,
      status: "Pending Manager",
    };

    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    toast.success("Requisition Submitted", {
      description: `${newReq.requestId} submitted for approval.`,
    });

    setFormData({
      employeeName: "",
      department: "Product Engineering",
      requestedCategory: "Laptop",
      itemName: 'MacBook Pro 16" M3 Max',
      reason: "New Hire Compute Requisition",
      priority: "High",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Requisitions & Hardware Requests"
        description="Employee equipment request pipeline. Manage hardware approvals, priority queues, and IT fulfillment."
        breadcrumbs={[
          { label: "Asset Management", href: "/dashboard/assets" },
          { label: "Asset Requests" },
        ]}
        backHref="/dashboard/assets"
        backLabel="Back to Asset Management"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Submit Requisition
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Requisitions</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">{requests.length}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FilePlus className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Approval</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {requests.filter((r) => r.status.includes("Pending")).length}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">IT Approved</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {requests.filter((r) => r.status === "IT Approved").length}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dispatched / Completed</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {requests.filter((r) => r.status === "Dispatched").length}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
            <Send className="size-5" />
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
            placeholder="Search request ID, applicant, hardware item..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {filtered.length} Requests
        </span>
      </div>

      {/* Requests Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Req ID</th>
                <th className="px-5 py-3.5 font-bold">Applicant</th>
                <th className="px-5 py-3.5 font-bold">Requested Item</th>
                <th className="px-5 py-3.5 font-bold">Category</th>
                <th className="px-5 py-3.5 font-bold">Priority</th>
                <th className="px-5 py-3.5 font-bold">Date</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((req) => (
                <tr key={req.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-mono font-bold text-primary">{req.requestId}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-foreground">{req.employeeName}</p>
                    <p className="text-[11px] text-muted-foreground">{req.department}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-foreground">{req.itemName}</td>
                  <td className="px-5 py-4 text-muted-foreground">{req.requestedCategory}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        req.priority === "High"
                          ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                          : req.priority === "Medium"
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                          : "border-sky-500/20 bg-sky-500/10 text-sky-400"
                      }`}
                    >
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{req.requestDate}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-foreground">
                      {req.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {req.status.includes("Pending") ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-muted-foreground">Action Completed</span>
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
            <DialogTitle className="font-display text-xl font-bold">New Hardware Requisition</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit hardware request on behalf of an employee or department.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Employee Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Aditya Sharma"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Item Requested</label>
              <input
                type="text"
                required
                placeholder='MacBook Pro 16" M3 Max 64GB'
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Business Justification</label>
              <textarea
                rows={2}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none resize-none"
              />
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
                Submit Requisition
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
