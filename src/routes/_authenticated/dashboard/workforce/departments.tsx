import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Building2,
  Users,
  ArrowRight,
  Loader2,
  Trash2,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useListEmployeesQuery,
} from "@/services/employeeApi";
import { getApiErrorMessage } from "@/utils/api-error";
import type { Department } from "@/types/employee";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/workforce/departments")({
  component: DepartmentsPage,
});

interface DepartmentDisplayItem {
  id: string;
  name: string;
  head: string;
  count: number;
  code: string;
  description: string;
  status: string;
  location: string;
  email: string;
  phone: string;
  color: string;
  budget: number | null;
  cost_center: string;
  raw: Department;
}

const EMPTY_FORM = {
  name: "",
  description: "",
  code: "",
  location: "",
  email: "",
  phone: "",
  color: "",
  budget: "",
  cost_center: "",
};

function DepartmentsPage() {
  const { data: departmentsRes, isLoading, isError } = useListDepartmentsQuery();
  const { data: employeesRes } = useListEmployeesQuery({ page: 1, page_size: 100 });
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const [viewingDept, setViewingDept] = useState<DepartmentDisplayItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentDisplayItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  const employees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);

  const departmentsList = useMemo<DepartmentDisplayItem[]>(() => {
    const rawDepts = departmentsRes?.data ?? [];
    return rawDepts.map((dept, index) => {
      const memberCount = employees.filter(
        (emp) => emp.department?.toLowerCase() === dept.name.toLowerCase() || emp.department_id === dept.id,
      ).length;

      const codeName = dept.code || dept.name
        .split(" ")
        .map((w) => w.charAt(0))
        .join("")
        .toUpperCase();

      return {
        id: dept.id,
        name: dept.name,
        head: dept.head_name || "Unassigned",
        count: dept.employee_count ?? memberCount,
        code: dept.code || `DEP-${codeName || (index + 1)}`,
        description: dept.description || "Enterprise business unit.",
        status: dept.status || "Active",
        location: dept.location || "",
        email: dept.email || "",
        phone: dept.phone || "",
        color: dept.color || "",
        budget: dept.budget ?? null,
        cost_center: dept.cost_center || "",
        raw: dept,
      };
    });
  }, [departmentsRes, employees]);

  const currentDeptEmployees = useMemo(() => {
    if (!viewingDept) return [];
    return employees.filter(
      (emp) => emp.department?.toLowerCase() === viewingDept.name.toLowerCase(),
    );
  }, [viewingDept, employees]);

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a department name.");
      return;
    }

    try {
      await createDepartment({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        code: formData.code.trim() || undefined,
        location: formData.location.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        color: formData.color.trim() || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        cost_center: formData.cost_center.trim() || undefined,
      }).unwrap();

      toast.success("Department Created", {
        description: `${formData.name} has been created successfully.`,
      });

      setIsAddModalOpen(false);
      setFormData({ ...EMPTY_FORM });
    } catch (err) {
      toast.error("Failed to create department", {
        description: getApiErrorMessage(err),
      });
    }
  };

  const openEditModal = (dept: DepartmentDisplayItem) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      code: dept.code,
      location: dept.location,
      email: dept.email,
      phone: dept.phone,
      color: dept.color,
      budget: dept.budget != null ? String(dept.budget) : "",
      cost_center: dept.cost_center,
    });
  };

  const handleEditDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    if (!formData.name.trim()) {
      toast.error("Department name is required.");
      return;
    }

    try {
      await updateDepartment({
        id: editingDept.id,
        body: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          code: formData.code.trim() || undefined,
          location: formData.location.trim() || undefined,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          color: formData.color.trim() || undefined,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          cost_center: formData.cost_center.trim() || undefined,
        },
      }).unwrap();

      toast.success("Department Updated", {
        description: `${formData.name} has been updated successfully.`,
      });

      setEditingDept(null);
      setFormData({ ...EMPTY_FORM });
      if (viewingDept?.id === editingDept.id) setViewingDept(null);
    } catch (err) {
      toast.error("Failed to update department", {
        description: getApiErrorMessage(err),
      });
    }
  };

  const [deletingDept, setDeletingDept] = useState<DepartmentDisplayItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deletingDept) return;
    try {
      setIsDeleting(true);
      await deleteDepartment(deletingDept.id).unwrap();
      toast.success("Department Deleted", {
        description: `${deletingDept.name} has been removed.`,
      });
      if (viewingDept?.id === deletingDept.id) setViewingDept(null);
      setDeletingDept(null);
    } catch (err) {
      toast.error("Failed to delete department", {
        description: getApiErrorMessage(err),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Shared form fields renderer
  const renderFormFields = () => (
    <>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Department Name *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Legal & Compliance"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Department Code
          </label>
          <input
            type="text"
            placeholder="e.g. DEP-LC"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Bengaluru, IN"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Description & Scope
        </label>
        <textarea
          rows={3}
          placeholder="Brief description of responsibilities..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-xl border border-input bg-card/70 p-3 text-xs outline-none focus:border-ring resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Contact Email
          </label>
          <input
            type="email"
            placeholder="dept@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Contact Phone
          </label>
          <input
            type="text"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Budget (₹)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 500000"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Cost Center
          </label>
          <input
            type="text"
            placeholder="e.g. CC-1001"
            value={formData.cost_center}
            onChange={(e) => setFormData({ ...formData, cost_center: e.target.value })}
            className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none focus:border-ring"
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Departments"
        description="Business units, cost centers, and departmental leadership structure."
        breadcrumbs={[{ label: "Workforce", href: "/dashboard/workforce" }, { label: "Departments" }]}
        backHref="/dashboard/workforce"
        backLabel="Back to Workforce"
        actions={
          <button
            onClick={() => {
              setFormData({ ...EMPTY_FORM });
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="size-4" /> Add Department
          </button>
        }
      />

      {/* ── Department Cards Grid ──────────────────────────────── */}
      {isLoading ? (
        <div className="glass-tile flex items-center justify-center p-12 rounded-2xl">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading department data...</span>
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Building2 className="size-10 text-destructive" />
          <h3 className="font-display text-base font-bold text-foreground">Error Loading Departments</h3>
          <p className="text-xs text-muted-foreground">Unable to fetch department data from backend.</p>
        </div>
      ) : departmentsList.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Building2 className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No Departments Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Click "Add Department" above to create your first organizational department.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departmentsList.map((dept) => (
            <div
              key={dept.id}
              onClick={() => setViewingDept(dept)}
              className="glass-tile group relative flex flex-col justify-between rounded-2xl p-5 transition-all duration-300 hover-lift hover:border-primary/40 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
                    <Building2 className="size-5.5" />
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    {dept.code}
                  </span>
                </div>
                <div className="mt-4 space-y-1.5">
                  <h3 className="font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-border/50 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Department Head:</span>
                  <span className="font-bold text-foreground">{dept.head}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Users className="size-3.5 text-primary" /> {dept.count} Members
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(dept);
                      }}
                      className="text-muted-foreground hover:text-primary p-1 rounded-md transition-colors"
                      title="Edit department"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingDept(dept);
                      }}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
                      title="Delete department"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                  <span>View Department Details</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Department Details View Modal ───────────────────────── */}
      <Dialog open={Boolean(viewingDept)} onOpenChange={(open) => !open && setViewingDept(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          {viewingDept && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                      <Building2 className="size-6" />
                    </div>
                    <div>
                      <DialogTitle className="font-display text-xl font-bold">
                        {viewingDept.name}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-primary font-bold">
                        Code: {viewingDept.code}
                      </DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-4 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  {viewingDept.description}
                </p>

                <div className="grid gap-3 sm:grid-cols-2 rounded-xl border border-border/60 bg-card/40 p-4">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                      Department Head
                    </span>
                    <span className="font-bold text-foreground text-sm mt-0.5 block">
                      {viewingDept.head}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                      Active Workforce
                    </span>
                    <span className="font-bold text-primary text-sm mt-0.5 block">
                      {viewingDept.count} Employees
                    </span>
                  </div>

                  {viewingDept.location && (
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                        Location
                      </span>
                      <span className="font-bold text-foreground text-sm mt-0.5 block">
                        {viewingDept.location}
                      </span>
                    </div>
                  )}

                  {viewingDept.email && (
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                        Email
                      </span>
                      <span className="font-bold text-foreground text-sm mt-0.5 block">
                        {viewingDept.email}
                      </span>
                    </div>
                  )}

                  {viewingDept.cost_center && (
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                        Cost Center
                      </span>
                      <span className="font-bold text-foreground text-sm mt-0.5 block">
                        {viewingDept.cost_center}
                      </span>
                    </div>
                  )}

                  {viewingDept.budget != null && (
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                        Budget
                      </span>
                      <span className="font-bold text-foreground text-sm mt-0.5 block">
                        ₹{viewingDept.budget.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Team Members List */}
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px] mb-2">
                    Department Members ({currentDeptEmployees.length})
                  </h4>
                  {currentDeptEmployees.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground italic">No employees assigned to this department yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-36 overflow-y-auto no-scrollbar pr-1">
                      {currentDeptEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 p-2.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-brand font-display font-bold text-primary-foreground text-xs shadow-glow">
                              {emp.full_name ? emp.full_name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-xs">{emp.full_name}</p>
                              <p className="text-[10px] text-muted-foreground">{emp.job_title || "Staff"}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-primary">{emp.role}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-6 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setViewingDept(null)}
                  className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Close
                </button>
                <Link
                  to="/dashboard/workforce/employees"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
                >
                  View All Employees <ArrowRight className="size-3.5" />
                </Link>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Add Department Dialog Modal ──────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              Add New Department
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a new business unit or department.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddDepartment} className="mt-4 space-y-4">
            {renderFormFields()}

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
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="size-3.5 animate-spin" /> : null}
                Create Department
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Department Dialog Modal ──────────────────────────── */}
      <Dialog open={Boolean(editingDept)} onOpenChange={(open) => !open && setEditingDept(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              Edit Department
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update department details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditDepartment} className="mt-4 space-y-4">
            {renderFormFields()}

            <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingDept(null)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="size-3.5 animate-spin" /> : null}
                Save Changes
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ──────────────── */}
      <Dialog open={Boolean(deletingDept)} onOpenChange={(open) => !open && setDeletingDept(null)}>
        <DialogContent className="glass-elevated max-w-sm rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive shadow-glow">
              <Trash2 className="size-6" />
            </div>
            <div>
              <DialogTitle className="font-display text-lg font-bold text-foreground">
                Delete Department
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed text-muted-foreground mt-1">
                Are you sure you want to delete department <span className="font-semibold text-foreground">"{deletingDept?.name}"</span>? This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setDeletingDept(null)}
              disabled={isDeleting}
              className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground shadow-glow hover:bg-destructive/90 transition-all disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : null}
              Delete Department
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
