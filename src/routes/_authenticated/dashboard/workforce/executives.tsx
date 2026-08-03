import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Crown,
  Building2,
  Mail,
  ShieldCheck,
  Eye,
  Loader2,
  CheckCircle2,
  Copy,
  TrendingUp,
  Award,
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

export const Route = createFileRoute("/_authenticated/dashboard/workforce/executives")({
  component: ExecutivesPage,
});

interface ExecutiveDisplayItem {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  job_title: string;
  status: string;
}

export function ExecutivesPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes } = useListDepartmentsQuery();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingExec, setViewingExec] = useState<ExecutiveDisplayItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    tempPassword: string;
    fullName: string;
    employeeId: string;
  } | null>(null);

  // Form State for creating new Executive
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    department: "",
    job_title: "Chief Executive Officer (CEO)",
  });

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  // Filter employees with role === "EXECUTIVE" or executive titles
  const executivesList = useMemo<ExecutiveDisplayItem[]>(() => {
    const execs = rawEmployees.filter((emp) => {
      const isRoleExec = emp.role === "EXECUTIVE";
      const titleLower = emp.job_title?.toLowerCase() || "";
      const isTitleExec =
        titleLower.includes("chief") ||
        titleLower.includes("vp") ||
        titleLower.includes("vice president") ||
        titleLower.includes("director") ||
        titleLower.includes("c-suite") ||
        titleLower.includes("executive");
      return isRoleExec || isTitleExec;
    });

    return execs.map((e) => ({
      id: e.id,
      employee_id: e.employee_id || `EXEC-${e.id.substring(0, 5)}`,
      full_name: e.full_name,
      email: e.email,
      department: e.department || "Executive Board / Corporate",
      job_title: e.job_title || "Executive Leadership",
      status: e.is_active ? "Active" : "Inactive",
    }));
  }, [rawEmployees]);

  const filteredExecutives = useMemo(() => {
    if (!searchQuery.trim()) return executivesList;
    const q = searchQuery.toLowerCase();
    return executivesList.filter(
      (e) =>
        e.full_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.job_title.toLowerCase().includes(q),
    );
  }, [executivesList, searchQuery]);

  const handleCreateExecutive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.email.trim()) {
      toast.error("Please fill in Executive Full Name and Email.");
      return;
    }

    try {
      const result = await createEmployee({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        department: formData.department || undefined,
        job_title: formData.job_title.trim() || "Vice President",
        role: "EXECUTIVE",
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
        toast.success("Executive Account Created", {
          description: `${formData.full_name} has been assigned the EXECUTIVE role.`,
        });
      }

      setFormData({
        full_name: "",
        email: "",
        department: "",
        job_title: "Chief Executive Officer (CEO)",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create executive account.");
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
        title="Executive Leadership Directory"
        description="Corporate governance, C-Suite officers, Vice Presidents, and strategic enterprise decision-makers."
        breadcrumbs={[{ label: "Workforce", href: "/dashboard/workforce" }, { label: "Executives" }]}
        backHref="/dashboard/workforce"
        backLabel="Back to Workforce"
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="size-4" /> Add Executive Member
          </button>
        }
      />

      {/* ── KPI Stats Summary ──────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-tile rounded-2xl p-4 flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
            <Crown className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Executives</p>
            <p className="font-display text-xl font-bold text-foreground">{executivesList.length}</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
            <Award className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">C-Suite & CXO Officers</p>
            <p className="font-display text-xl font-bold text-foreground">
              {executivesList.filter((e) => e.job_title.toLowerCase().includes("chief") || e.job_title.toLowerCase().includes("c")).length}
            </p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Building2 className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Corporate Divisions</p>
            <p className="font-display text-xl font-bold text-foreground">
              {new Set(executivesList.map((e) => e.department)).size}
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
            placeholder="Search executives by name, title, email, or department..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-ring focus:shadow-glow"
          />
        </div>
        <span className="glass-tile rounded-xl px-3.5 py-2 text-xs font-semibold text-muted-foreground">
          Executives ({filteredExecutives.length})
        </span>
      </div>

      {/* ── Executives Table ───────────────────────────────────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        {isLoadingEmps ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="ml-2.5 text-xs font-semibold">Loading Executive Directory...</span>
          </div>
        ) : filteredExecutives.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <Crown className="size-10 text-amber-500/60" />
            <h3 className="font-display text-base font-bold text-foreground">No Executive Members Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Click "+ Add Executive Member" above to create C-Suite or VP accounts.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Executive Name</th>
                  <th className="px-5 py-3.5 font-bold">Title / Designation</th>
                  <th className="px-5 py-3.5 font-bold">Department</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredExecutives.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 font-display text-xs font-bold text-amber-500 shadow-glow">
                          <Crown className="size-4" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{e.full_name}</p>
                          <span className="text-[11px] text-muted-foreground">{e.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold text-purple-400">
                        <ShieldCheck className="size-3.5" />
                        {e.job_title}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground font-medium">{e.department}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                        {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setViewingExec(e)}
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

      {/* ── Add New Executive Modal ─────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Add Executive Member</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create an account with the EXECUTIVE role for C-Suite officers and corporate leadership.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateExecutive} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Mehta"
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
                placeholder="e.g. CEO@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Executive Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Technology Officer (CTO)"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Department / Board
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none cursor-pointer"
                >
                  <option value="">Select Division...</option>
                  <option value="Executive Board">Executive Board</option>
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
                Save Executive Member
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Created Executive Credentials Modal ─────────────────── */}
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
                      Executive Account Created!
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

      {/* ── View Executive Details Modal ────────────────────────── */}
      <Dialog open={Boolean(viewingExec)} onOpenChange={(open) => !open && setViewingExec(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          {viewingExec && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-glow">
                    <Crown className="size-5" />
                  </div>
                  <div>
                    <DialogTitle className="font-display text-lg font-bold">{viewingExec.full_name}</DialogTitle>
                    <DialogDescription className="text-xs text-purple-400 font-bold">{viewingExec.job_title}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-3 rounded-xl border border-border/60 bg-card/40 p-4 text-xs">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" /> Email:
                  </span>
                  <span className="font-semibold text-foreground">{viewingExec.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-primary" /> Department:
                  </span>
                  <span className="font-semibold text-foreground">{viewingExec.department}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-blue-400" /> Employee ID:
                  </span>
                  <span className="font-mono font-bold text-foreground">{viewingExec.employee_id}</span>
                </div>
              </div>

              <DialogFooter className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingExec(null)}
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
