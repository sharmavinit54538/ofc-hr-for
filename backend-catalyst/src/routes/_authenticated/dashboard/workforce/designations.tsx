import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  BadgeCheck,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Building2,
  Award,
  Loader2,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";
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

export const Route = createFileRoute("/_authenticated/dashboard/workforce/designations")({
  component: DesignationsPage,
});

interface DesignationItem {
  id: string;
  title: string;
  grade: string;
  department: string;
  minPay: string;
  maxPay: string;
}

const GRADES = [
  "L3 - Junior / Associate",
  "L4 - Mid Level",
  "L5 - Senior Specialist",
  "L6 - Lead / Manager",
  "L7 - Principal / Director",
  "L8 - Executive VP",
  "CXO Level",
];

function DesignationsPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 100 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const [customDesignations, setCustomDesignations] = useState<DesignationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDes, setEditingDes] = useState<DesignationItem | null>(null);
  const [viewingDes, setViewingDes] = useState<DesignationItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    grade: "L5 - Senior Specialist",
    department: "",
    minPay: "—",
    maxPay: "—",
  });

  const apiDepartments = useMemo<string[]>(() => {
    return (departmentsRes?.data ?? []).map((d) => d.name);
  }, [departmentsRes]);

  // Derive designations from real API employees
  const apiDesignations = useMemo<DesignationItem[]>(() => {
    const items = employeesRes?.data?.items ?? [];
    const derivedMap = new Map<string, DesignationItem>();

    items.forEach((emp) => {
      if (emp.job_title && emp.job_title.trim()) {
        const titleKey = emp.job_title.trim();
        if (!derivedMap.has(titleKey)) {
          derivedMap.set(titleKey, {
            id: `des_api_${emp.id}`,
            title: emp.job_title,
            grade: emp.role === "EXECUTIVE" ? "CXO / Executive" : emp.role === "MANAGER" ? "L6 - Lead / Manager" : "L5 - Senior Specialist",
            department: emp.department ?? "General",
            minPay: "—",
            maxPay: "—",
          });
        }
      }
    });

    return Array.from(derivedMap.values());
  }, [employeesRes]);

  // Combine real API designations + user-created custom ones
  const allDesignations = useMemo(() => {
    return [...apiDesignations, ...customDesignations];
  }, [apiDesignations, customDesignations]);

  const filteredDesignations = useMemo(() => {
    if (!searchQuery.trim()) return allDesignations;
    const q = searchQuery.toLowerCase();
    return allDesignations.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.grade.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q),
    );
  }, [allDesignations, searchQuery]);

  const handleAddDesignation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a designation title.");
      return;
    }

    const newItem: DesignationItem = {
      id: `des_${Date.now()}`,
      title: formData.title.trim(),
      grade: formData.grade,
      department: formData.department || "General",
      minPay: formData.minPay.trim() || "—",
      maxPay: formData.maxPay.trim() || "—",
    };

    setCustomDesignations([newItem, ...customDesignations]);
    setIsAddModalOpen(false);
    toast.success("Designation Added", {
      description: `${formData.title} (${formData.grade}) added.`,
    });

    setFormData({
      title: "",
      grade: "L5 - Senior Specialist",
      department: apiDepartments[0] || "",
      minPay: "—",
      maxPay: "—",
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDes) return;

    setCustomDesignations(
      customDesignations.map((item) => (item.id === editingDes.id ? editingDes : item)),
    );
    setEditingDes(null);
    toast.success("Designation Updated", {
      description: `Updated pay bands for ${editingDes.title}.`,
    });
  };

  const handleDelete = (id: string, title: string) => {
    setCustomDesignations(customDesignations.filter((item) => item.id !== id));
    toast.success("Designation Removed", {
      description: `${title} removed from designations directory.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Job Designations & Pay Bands"
        description="Standardized job titles, grade levels, and compensation bands across the enterprise."
        breadcrumbs={[{ label: "Workforce", href: "/dashboard/workforce" }, { label: "Designations" }]}
        backHref="/dashboard/workforce"
        backLabel="Back to Workforce"
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="size-4" /> Add Designation
          </button>
        }
      />

      {/* ── Toolbar Search & Count ──────────────────────────────── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search designations, grades, or departments..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-ring focus:shadow-glow"
          />
        </div>
        <span className="glass-tile rounded-xl px-3.5 py-2 text-xs font-semibold text-muted-foreground">
          Designations ({filteredDesignations.length})
        </span>
      </div>

      {/* ── Designations Table ─────────────────────────────────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        {isLoadingEmps ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="ml-2.5 text-xs font-semibold">Loading designations...</span>
          </div>
        ) : filteredDesignations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <Award className="size-10 text-muted-foreground/60" />
            <h3 className="font-display text-base font-bold text-foreground">No Designations Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Click "+ Add Designation" above to define standard job titles, grade levels, and compensation bands.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Designation Title</th>
                  <th className="px-5 py-3.5 font-bold">Grade Level</th>
                  <th className="px-5 py-3.5 font-bold">Department</th>
                  <th className="px-5 py-3.5 font-bold">Pay Band Range</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredDesignations.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="grid size-8 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                          <BadgeCheck className="size-4" />
                        </div>
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {item.grade}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{item.department}</td>
                    <td className="px-5 py-4 font-bold text-foreground">
                      {item.minPay} – {item.maxPay}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 glass-elevated rounded-xl p-1.5 shadow-float">
                          <DropdownMenuItem
                            onClick={() => setViewingDes(item)}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer hover:bg-secondary"
                          >
                            <Eye className="size-4 text-muted-foreground" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditingDes(item)}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer hover:bg-secondary"
                          >
                            <Pencil className="size-4 text-muted-foreground" /> Edit Grade
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-border/60" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id, item.title)}
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
        )}
      </div>

      {/* ── Add Designation Dialog Modal ────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              Add New Job Designation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define standard job titles, grade levels, and compensation bands.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddDesignation} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Designation Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Enterprise Architect"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Grade Level
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none cursor-pointer"
                >
                  {GRADES.map((grade) => (
                    <option key={grade} value={grade} className="bg-card text-foreground">
                      {grade}
                    </option>
                  ))}
                </select>
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
                  {apiDepartments.map((dept) => (
                    <option key={dept} value={dept} className="bg-card text-foreground">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Min Pay Band
                </label>
                <input
                  type="text"
                  placeholder="$110k"
                  value={formData.minPay}
                  onChange={(e) => setFormData({ ...formData, minPay: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Max Pay Band
                </label>
                <input
                  type="text"
                  placeholder="$160k"
                  value={formData.maxPay}
                  onChange={(e) => setFormData({ ...formData, maxPay: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
                />
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
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
              >
                Save Designation
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── View Designation Dialog Modal ───────────────────────── */}
      <Dialog open={Boolean(viewingDes)} onOpenChange={(open) => !open && setViewingDes(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          {viewingDes && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                    <BadgeCheck className="size-5" />
                  </div>
                  <div>
                    <DialogTitle className="font-display text-lg font-bold">
                      {viewingDes.title}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-primary font-bold">
                      {viewingDes.grade}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-3 rounded-xl border border-border/60 bg-card/40 p-4 text-xs">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-primary" /> Department:
                  </span>
                  <span className="font-semibold text-foreground">{viewingDes.department}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Award className="size-3.5 text-primary" /> Enterprise Grade:
                  </span>
                  <span className="font-bold text-primary">{viewingDes.grade}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="size-3.5 text-emerald-400" /> Pay Range:
                  </span>
                  <span className="font-bold text-foreground">
                    {viewingDes.minPay} – {viewingDes.maxPay}
                  </span>
                </div>
              </div>

              <DialogFooter className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingDes(null)}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  Close
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Edit Designation Dialog Modal ───────────────────────── */}
      <Dialog open={Boolean(editingDes)} onOpenChange={(open) => !open && setEditingDes(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          {editingDes && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold">
                  Edit Job Designation
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Update pay bands and grades for {editingDes.title}.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Designation Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDes.title}
                    onChange={(e) => setEditingDes({ ...editingDes, title: e.target.value })}
                    className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Grade Level
                    </label>
                    <select
                      value={editingDes.grade}
                      onChange={(e) => setEditingDes({ ...editingDes, grade: e.target.value })}
                      className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none cursor-pointer"
                    >
                      {GRADES.map((grade) => (
                        <option key={grade} value={grade} className="bg-card text-foreground">
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Department
                    </label>
                    <select
                      value={editingDes.department}
                      onChange={(e) => setEditingDes({ ...editingDes, department: e.target.value })}
                      className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none cursor-pointer"
                    >
                      {apiDepartments.map((dept) => (
                        <option key={dept} value={dept} className="bg-card text-foreground">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Min Pay Band
                    </label>
                    <input
                      type="text"
                      value={editingDes.minPay}
                      onChange={(e) => setEditingDes({ ...editingDes, minPay: e.target.value })}
                      className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Max Pay Band
                    </label>
                    <input
                      type="text"
                      value={editingDes.maxPay}
                      onChange={(e) => setEditingDes({ ...editingDes, maxPay: e.target.value })}
                      className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
                    />
                  </div>
                </div>

                <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingDes(null)}
                    className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
                  >
                    Update Designation
                  </button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
