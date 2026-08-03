import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Shield,
  Building2,
  Mail,
  ShieldCheck,
  Eye,
  Loader2,
  CheckCircle2,
  Copy,
  Terminal,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery, useCreateEmployeeMutation } from "@/services/employeeApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/workforce/it-admins")({
  component: ITAdminsPage,
});

interface ITAdminDisplayItem {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  job_title: string;
  status: string;
}

export function ITAdminsPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes } = useListDepartmentsQuery();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingAdmin, setViewingAdmin] = useState<ITAdminDisplayItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    tempPassword: string;
    fullName: string;
    employeeId: string;
  } | null>(null);

  // Form State for creating new IT Admin
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    job_title: "IT Administrator",
    department: "Information Technology",
    employment_type: "Full-Time",
    work_mode: "On-site",
  });

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  // Filter employees for IT Admins (role === IT_ADMIN or IT department / IT job titles)
  const itAdminsList = useMemo(() => {
    return rawEmployees.filter(
      (e) =>
        e.role === "IT_ADMIN" ||
        e.job_title?.toLowerCase().includes("it admin") ||
        e.job_title?.toLowerCase().includes("system admin")
    );
  }, [rawEmployees]);

  const filteredAdmins = useMemo(() => {
    return itAdminsList.filter((a) => {
      const q = searchQuery.toLowerCase();
      return (
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.job_title?.toLowerCase().includes(q) ||
        a.employee_id.toLowerCase().includes(q)
      );
    });
  }, [itAdminsList, searchQuery]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      toast.error("Please fill in Full Name and Work Email.");
      return;
    }

    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || undefined,
        job_title: formData.job_title || "IT Administrator",
        department: formData.department || "Information Technology",
        employment_type: formData.employment_type,
        work_mode: formData.work_mode,
        role: "IT_ADMIN" as const,
      };

      const res = await createEmployee(payload).unwrap();
      const created = res.data;

      setCreatedCredentials({
        email: created.email,
        tempPassword: created.temp_password || "Welcome@123",
        fullName: created.full_name,
        employeeId: created.employee_id,
      });

      toast.success(`IT Admin Created Successfully!`, {
        description: `Account provisioned for ${created.full_name} with IT_ADMIN permissions.`,
      });

      setIsAddModalOpen(false);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        job_title: "IT Administrator",
        department: "Information Technology",
        employment_type: "Full-Time",
        work_mode: "On-site",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create IT Admin account.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="IT Administrators & Security Governance"
        description="Dedicated directory for IT Administrators, System Engineers, and Technical Security Controllers."
        breadcrumbs={[{ label: "Workforce", href: "/dashboard/workforce" }, { label: "IT Admins" }]}
      />

      {/* KPI Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total IT Admins</span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Shield className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoadingEmps ? <Loader2 className="size-5 animate-spin" /> : itAdminsList.length}
            </div>
            <p className="mt-1 text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3" /> System Security Clearances Level 1
            </p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Departments</span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-foreground">
              {rawDepartments.length}
            </div>
            <p className="mt-1 text-[11px] font-medium text-muted-foreground">
              Infrastructure & Systems Monitored
            </p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">RBAC Status</span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Key className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold text-foreground">Active</div>
            <p className="mt-1 text-[11px] font-semibold text-purple-400 flex items-center gap-1">
              <Terminal className="size-3" /> Dedicated IT Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Create Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IT Admins by name, email, employee ID..."
            className="w-full rounded-xl border border-border/60 bg-card/60 pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
        >
          <Plus className="size-4" /> Add IT Admin
        </button>
      </div>

      {/* IT Admins Grid List */}
      {isLoadingEmps ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : filteredAdmins.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAdmins.map((admin) => (
            <div key={admin.id} className="glass-tile rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all hover-lift">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 font-display text-lg font-bold text-purple-400 border border-purple-500/20">
                      {admin.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground leading-snug">{admin.full_name}</h3>
                      <p className="text-[11px] text-muted-foreground">{admin.job_title || "IT Administrator"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 font-bold text-purple-400">
                    <Shield className="size-3" /> IT Admin
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-400">
                    <ShieldCheck className="size-3" /> {admin.status}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-primary shrink-0" />
                    <span className="truncate">{admin.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="size-3.5 text-primary shrink-0" />
                    <span>{admin.department || "Information Technology"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
                <span className="font-mono font-bold text-primary">{admin.employee_id}</span>
                <button
                  onClick={() => setViewingAdmin(admin)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <Eye className="size-3.5" /> Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-tile rounded-2xl p-8 text-center space-y-3 flex flex-col items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
            <Shield className="size-6" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">No IT Admins Found</h3>
          <p className="text-xs text-muted-foreground max-w-md">
            Click "+ Add IT Admin" to provision a new IT Administrator account with IT_ADMIN permissions.
          </p>
        </div>
      )}

      {/* Modal: Create IT Admin */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base">
              <Shield className="size-5 text-purple-400" /> Provision New IT Administrator
            </DialogTitle>
            <DialogDescription className="text-xs">
              Create an official IT Admin account. The user will be assigned IT_ADMIN role permissions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Vikramaditya Singh"
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. vikram.it@organization.com"
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  placeholder="IT Administrator"
                  className="w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Information Technology"
                  className="w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                Provision IT Admin
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Credentials Created Modal */}
      {createdCredentials && (
        <Dialog open={!!createdCredentials} onOpenChange={() => setCreatedCredentials(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-400 font-display text-base">
                <CheckCircle2 className="size-5" /> IT Admin Credentials Generated
              </DialogTitle>
              <DialogDescription className="text-xs">
                Save or copy these login credentials for {createdCredentials.fullName}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Employee ID:</span>
                  <span className="font-mono font-bold text-primary">{createdCredentials.employeeId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Login Email:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{createdCredentials.email}</span>
                    <button onClick={() => handleCopy(createdCredentials.email, "Email")} className="text-primary hover:underline">
                      <Copy className="size-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Temporary Password:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-amber-400">{createdCredentials.tempPassword}</span>
                    <button onClick={() => handleCopy(createdCredentials.tempPassword, "Password")} className="text-primary hover:underline">
                      <Copy className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <button
                onClick={() => setCreatedCredentials(null)}
                className="w-full rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow"
              >
                Done
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Details View Modal */}
      {viewingAdmin && (
        <Dialog open={!!viewingAdmin} onOpenChange={() => setViewingAdmin(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display text-base">
                <Shield className="size-5 text-purple-400" /> IT Admin Record Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="font-semibold text-foreground">{viewingAdmin.full_name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Work Email:</span>
                <span className="font-semibold text-foreground">{viewingAdmin.email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Job Title:</span>
                <span className="font-semibold text-foreground">{viewingAdmin.job_title}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-semibold text-foreground">{viewingAdmin.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Employee ID:</span>
                <span className="font-mono font-bold text-primary">{viewingAdmin.employee_id}</span>
              </div>
            </div>

            <DialogFooter>
              <button
                onClick={() => setViewingAdmin(null)}
                className="w-full rounded-xl border border-border px-4 py-2 text-xs font-semibold"
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
