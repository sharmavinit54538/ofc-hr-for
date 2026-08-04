import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  UserCheck,
  Building2,
  Mail,
  Users,
  ShieldCheck,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Crown,
  CheckCircle2,
  Copy,
  Briefcase,
  AlertTriangle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/dashboard/workforce/managers")({
  component: ManagersPage,
});

interface ManagerDisplayItem {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  job_title: string;
  direct_reports_count: number;
  status: string;
  is_dept_head: boolean;
}

function ManagersPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes } = useListDepartmentsQuery();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingManager, setViewingManager] = useState<ManagerDisplayItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    tempPassword: string;
    fullName: string;
    employeeId: string;
  } | null>(null);

  // Form State for creating new Manager
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    department: "",
    job_title: "Team Manager",
  });

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  // Compute Manager list: employees with role MANAGER or EXECUTIVE or managers referenced in employee reporting structure
  const managersList = useMemo<ManagerDisplayItem[]>(() => {
    // Collect all employee reporting_manager_ids
    const directReportsMap = new Map<string, number>();
    rawEmployees.forEach((emp) => {
      if (emp.reporting_manager_id) {
        directReportsMap.set(emp.reporting_manager_id, (directReportsMap.get(emp.reporting_manager_id) || 0) + 1);
      }
    });

    const deptHeadNames = new Set(rawDepartments.map((d) => d.head_name?.toLowerCase()).filter(Boolean));

    // Filter employees who are Managers or Dept Heads
    const managerEmps = rawEmployees.filter((emp) => {
      const isRoleManager = emp.role === "MANAGER" || emp.role === "EXECUTIVE" || emp.role === "HR_ADMIN";
      const isDeptHead = deptHeadNames.has(emp.full_name?.toLowerCase());
      const hasDirectReports = directReportsMap.has(emp.id);
      const isJobTitleManager = emp.job_title?.toLowerCase().includes("manager") || emp.job_title?.toLowerCase().includes("lead");
      return isRoleManager || isDeptHead || hasDirectReports || isJobTitleManager;
    });

    return managerEmps.map((m) => ({
      id: m.id,
      employee_id: m.employee_id || `MGR-${m.id.substring(0, 5)}`,
      full_name: m.full_name,
      email: m.email,
      department: m.department || "General Management",
      job_title: m.job_title || "Department Manager",
      direct_reports_count: directReportsMap.get(m.id) || 0,
      status: m.status === "Active" ? "Active" : "Inactive",
      is_dept_head: deptHeadNames.has(m.full_name?.toLowerCase()),
    }));
  }, [rawEmployees, rawDepartments]);

  const filteredManagers = useMemo(() => {
    if (!searchQuery.trim()) return managersList;
    const q = searchQuery.toLowerCase();
    return managersList.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        m.job_title.toLowerCase().includes(q),
    );
  }, [managersList, searchQuery]);

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.email.trim()) {
      toast.error("Please fill in Manager Full Name and Email.");
      return;
    }

    try {
      const result = await createEmployee({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        department: formData.department || undefined,
        job_title: formData.job_title.trim() || "Team Manager",
        role: "MANAGER",
      }).unwrap();

      const createdEmp = result.data;
      setIsAddModalOpen(false);

      if (createdEmp?.temp_password) {
        setCreatedCredentials({
          email: createdEmp.email,
          tempPassword: createdEmp.temp_password,
          fullName: createdEmp.full_name,
          employeeId: createdEmp.employee_id || createdEmp.id,
        });
      } else {
        toast.success("Manager Created Successfully", {
          description: `${formData.full_name} has been assigned the MANAGER role.`,
        });
      }

      setFormData({
        full_name: "",
        email: "",
        department: "",
        job_title: "Team Manager",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create manager account.");
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to Clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Manager Directory & Leadership"
        description="Dedicated management hub to view, assign, and configure enterprise team leads and department heads."
        breadcrumbs={[{ label: "Workforce", href: "/dashboard/workforce" }, { label: "Managers" }]}
        backHref="/dashboard/workforce"
        backLabel="Back to Workforce"
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="size-4" /> Add New Manager
          </button>
        }
      />

      {/* ── KPI Stats Summary ──────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile rounded-2xl p-4 flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <UserCheck className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Managers</p>
            <p className="font-display text-xl font-bold text-foreground">{managersList.length}</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
            <Crown className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Dept Heads</p>
            <p className="font-display text-xl font-bold text-foreground">
              {managersList.filter((m) => m.is_dept_head).length}
            </p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Direct Reports</p>
            <p className="font-display text-xl font-bold text-foreground">
              {managersList.reduce((acc, curr) => acc + curr.direct_reports_count, 0)}
            </p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
            <Building2 className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Departments Covered</p>
            <p className="font-display text-xl font-bold text-foreground">
              {new Set(managersList.map((m) => m.department)).size}
            </p>
          </div>
        </div>
      </div>

      {/* ── Search Bar ─────────────────────────────────────────── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search managers by name, email, department, or title..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-ring focus:shadow-glow"
          />
        </div>
        <span className="glass-tile rounded-xl px-3.5 py-2 text-xs font-semibold text-muted-foreground">
          Managers ({filteredManagers.length})
        </span>
      </div>

      {/* ── Managers Table ─────────────────────────────────────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        {isLoadingEmps ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="ml-2.5 text-xs font-semibold">Loading Managers Directory...</span>
          </div>
        ) : filteredManagers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <UserCheck className="size-10 text-muted-foreground/60" />
            <h3 className="font-display text-base font-bold text-foreground">No Managers Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Click "+ Add New Manager" to create a team lead or department manager account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Manager Name</th>
                  <th className="px-5 py-3.5 font-bold">Job Title</th>
                  <th className="px-5 py-3.5 font-bold">Department</th>
                  <th className="px-5 py-3.5 font-bold">Direct Reports</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredManagers.map((m) => (
                  <tr key={m.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand font-display text-xs font-bold text-primary-foreground shadow-glow">
                          {m.full_name?.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground">{m.full_name}</span>
                            {m.is_dept_head && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-500 border border-amber-500/20">
                                <Crown className="size-3" /> Head
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground">{m.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                        <ShieldCheck className="size-3.5" />
                        {m.job_title}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground font-medium">{m.department}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
                        <Users className="size-3.5 text-primary" /> {m.direct_reports_count} members
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setViewingManager(m)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-[11px] font-semibold text-foreground hover:bg-secondary transition-colors"
                      >
                        <Eye className="size-3.5" /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add New Manager Modal ───────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Add New Manager</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a new user with the MANAGER role and assign department leadership.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateManager} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rahul.manager@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering Manager"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none cursor-pointer"
                >
                  <option value="">Select Department...</option>
                  {rawDepartments.map((d) => (
                    <option key={d.id} value={d.name} className="bg-card text-foreground">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
              >
                {isCreating && <Loader2 className="size-3.5 animate-spin" />}
                Save Manager Account
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Created Manager Credentials Modal ──────────────────── */}
      <Dialog open={Boolean(createdCredentials)} onOpenChange={(open) => !open && setCreatedCredentials(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          {createdCredentials && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <DialogTitle className="font-display text-lg font-bold text-emerald-500">
                      Manager Account Created!
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Login credentials generated for {createdCredentials.fullName}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Work Email</p>
                    <p className="font-mono text-xs font-bold text-foreground mt-0.5">{createdCredentials.email}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(createdCredentials.email, "email")}
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    {copiedField === "email" ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Temporary Password</p>
                    <p className="font-mono text-xs font-bold text-foreground mt-0.5">{createdCredentials.tempPassword}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(createdCredentials.tempPassword, "password")}
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    {copiedField === "password" ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              <DialogFooter className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCreatedCredentials(null)}
                  className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  Done
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── View Manager Details Modal ──────────────────────────── */}
      <Dialog open={Boolean(viewingManager)} onOpenChange={(open) => !open && setViewingManager(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          {viewingManager && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-brand font-display text-lg font-bold text-primary-foreground shadow-glow">
                    {viewingManager.full_name?.charAt(0)}
                  </div>
                  <div>
                    <DialogTitle className="font-display text-lg font-bold">{viewingManager.full_name}</DialogTitle>
                    <DialogDescription className="text-xs text-primary font-bold">{viewingManager.job_title}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-3 rounded-xl border border-border/60 bg-card/40 p-4 text-xs">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" /> Email:
                  </span>
                  <span className="font-semibold text-foreground">{viewingManager.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-primary" /> Department:
                  </span>
                  <span className="font-semibold text-foreground">{viewingManager.department}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="size-3.5 text-emerald-400" /> Direct Reports:
                  </span>
                  <span className="font-bold text-foreground">{viewingManager.direct_reports_count} Members</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-blue-400" /> Employee ID:
                  </span>
                  <span className="font-mono font-bold text-foreground">{viewingManager.employee_id}</span>
                </div>
              </div>

              <DialogFooter className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingManager(null)}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  Close
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
