import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Mail,
  MapPin,
  User,
  Briefcase,
  Building2,
  UserCheck,
  UserX,
  Eye,
  Pencil,
  Trash2,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Shield,
  Crown,
  Copy,
  CheckCircle2,
  Calendar,
  Hash,
  Users,
  GitBranch,
  Layers,
  ArrowUpDown,
  CheckSquare,
  Square,
  Network,
  BarChart3,
  Table as TableIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { Role } from "@/lib/auth/types";
import { PageHeader } from "@/components/admin/page-header";
import { useDebounce } from "@/hooks/useDebounce";
import { getApiErrorMessage } from "@/utils/api-error";
import type { Employee } from "@/types/employee";
import {
  useListEmployeesQuery,
  useListDepartmentsQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useSetEmployeeStatusMutation,
  useExportEmployeesMutation,
  useChangeManagerMutation,
  useBulkReassignMutation,
} from "@/services/employeeApi";
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
import { EmployeeHierarchyCard } from "@/components/workforce/employee-hierarchy-card";
import { OrgChartView } from "@/components/workforce/org-chart-view";
import { ManagerAnalyticsView } from "@/components/workforce/manager-analytics-view";
import { computeEmployeeHierarchyInfo } from "@/utils/hierarchy";

export const Route = createFileRoute("/_authenticated/dashboard/workforce/employees")({
  component: EmployeesPage,
});

const BRANCHES = [
  "Bengaluru, IN",
  "Mumbai, IN",
  "Pune, IN",
  "Hyderabad, IN",
  "Gurugram, IN",
  "Chennai, IN",
  "Delhi, IN",
];

const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Intern"];
const WORK_MODES = ["On-site", "Hybrid", "Remote"];

const ROLES = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "MANAGER", label: "Manager" },
  { value: "HR_ADMIN", label: "HR Admin" },
  { value: "IT_ADMIN", label: "IT Admin" },
  { value: "EXECUTIVE", label: "Executive" },
];

export const formatRoleLabel = (role?: unknown): string => {
  if (!role) return "No Role";

  if (typeof role === "string") {
    const trimmed = role.trim();
    if (!trimmed) return "No Role";

    switch (trimmed.toUpperCase()) {
      case "HR_ADMIN":
        return "HR Admin";
      case "IT_ADMIN":
        return "IT Admin";
      case "EMPLOYEE":
        return "Employee";
      case "MANAGER":
        return "Manager";
      case "EXECUTIVE":
        return "Executive";
      default:
        return trimmed
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  if (typeof role === "object" && role !== null) {
    const value =
      (role as any).name ??
      (role as any).role ??
      (role as any).title ??
      (role as any).designation ??
      (role as any).label ??
      "";

    if (!value) return "No Role";

    return formatRoleLabel(value);
  }

  return "No Role";
};

const renderRoleBadge = (role?: unknown) => {
  const formatted = formatRoleLabel(role);

  let roleKey = "";
  if (typeof role === "string") {
    roleKey = role.trim().toUpperCase();
  } else if (typeof role === "object" && role !== null) {
    const value =
      (role as any).name ??
      (role as any).role ??
      (role as any).title ??
      (role as any).designation ??
      "";
    if (typeof value === "string") {
      roleKey = value.trim().toUpperCase();
    } else if (typeof value === "object" && value !== null) {
      roleKey = formatRoleLabel(value).toUpperCase().replace(/\s+/g, "_");
    }
  }

  if (!roleKey) {
    roleKey = formatted.toUpperCase().replace(/\s+/g, "_");
  }

  switch (roleKey) {
    case "HR_ADMIN":
    case "IT_ADMIN":
    case "HR ADMIN":
    case "IT ADMIN":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 shadow-sm backdrop-blur-sm">
          <Shield className="size-3 text-indigo-400" />
          {formatted}
        </span>
      );
    case "EXECUTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400 shadow-sm backdrop-blur-sm">
          <Crown className="size-3 text-purple-400" />
          {formatted}
        </span>
      );
    case "MANAGER":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 shadow-sm backdrop-blur-sm">
          <Briefcase className="size-3 text-amber-400" />
          {formatted}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold text-sky-400 shadow-sm backdrop-blur-sm">
          <User className="size-3 text-sky-400" />
          {formatted}
        </span>
      );
  }
};

interface CreateEmployeeForm {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  branch: string;
  reportingManager: string;
  employmentType: string;
  joiningDate: string;
  team: string;
  workMode: string;
}

interface GeneratedCredentials {
  employeeId: string;
  email: string;
  tempPassword: string;
  fullName: string;
  emailSent?: boolean | undefined;
}

function EmployeesPage() {
  // View Switcher: "table" | "org-chart" | "manager"
  const [activeView, setActiveView] = useState<"table" | "org-chart" | "manager">("table");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedManager, setSelectedManager] = useState("All Managers");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedEmpType, setSelectedEmpType] = useState("All Types");
  const [sortBy, setSortBy] = useState<"name" | "level" | "department" | "manager">("name");

  const debouncedSearch = useDebounce(searchQuery);

  // Queries & Mutations
  const {
    data: employeesRes,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useListEmployeesQuery({
    search: debouncedSearch || undefined,
    filters: {
      department: selectedDept === "All Departments" ? undefined : selectedDept,
    },
    page: 1,
    page_size: 100,
  });

  const { data: departmentsRes } = useListDepartmentsQuery();

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  const [setEmployeeStatus] = useSetEmployeeStatusMutation();
  const [exportEmployees, { isLoading: isExporting }] = useExportEmployeesMutation();
  const [changeManager] = useChangeManagerMutation();
  const [bulkReassign, { isLoading: isBulkReassigning }] = useBulkReassignMutation();

  const rawEmployees = useMemo<Employee[]>(() => {
    if (!employeesRes?.data) return [];
    const d = employeesRes.data;
    if (Array.isArray(d)) return d as Employee[];
    if (Array.isArray((d as any).items)) return (d as any).items as Employee[];
    if (Array.isArray((d as any).employees)) return (d as any).employees as Employee[];
    return [];
  }, [employeesRes]);

  // Compute hierarchy information for each raw employee
  const employeesWithHierarchy = useMemo(() => {
    try {
      return rawEmployees.map((emp: Employee) => {
        if (!emp) return {} as any;
        const hierarchyInfo = computeEmployeeHierarchyInfo(emp, rawEmployees);

        const email =
          emp.email ||
          (emp as any).company_email ||
          (emp as any).personal_email ||
          (emp as any).work_email ||
          (emp as any).email_address ||
          (emp as any).user?.email ||
          "";

        const rawName =
          emp.full_name ||
          (emp as any).name ||
          (((emp as any).first_name || (emp as any).last_name)
            ? `${(emp as any).first_name || ""} ${(emp as any).last_name || ""}`.trim()
            : "") ||
          (emp as any).user?.full_name ||
          email ||
          "Employee";

        const jobTitle =
          emp.job_title ||
          (emp as any).designation ||
          (emp as any).role_title ||
          "";

        const roleVal =
          emp.role ||
          (emp as any).role_title ||
          (emp as any).designation ||
          "EMPLOYEE";

        return {
          ...emp,
          email,
          full_name: rawName,
          job_title: jobTitle,
          role: roleVal,
          hierarchy_level: hierarchyInfo.level,
          reporting_manager: hierarchyInfo.reportingManager?.full_name || emp.reporting_manager || "—",
          reporting_manager_id: hierarchyInfo.reportingManager?.id || emp.reporting_manager_id,
          direct_reports_count: hierarchyInfo.directReports.length,
          team_size: hierarchyInfo.teamSize,
          organization_path: hierarchyInfo.organizationPath,
        };
      });
    } catch (err) {
      console.error("[Hierarchy Computation Error]", err);
      return rawEmployees.map((emp) => {
        const email =
          emp?.email ||
          (emp as any)?.company_email ||
          (emp as any)?.personal_email ||
          (emp as any)?.work_email ||
          (emp as any)?.email_address ||
          "";
        const rawName =
          emp?.full_name ||
          (emp as any)?.name ||
          (((emp as any)?.first_name || (emp as any)?.last_name)
            ? `${(emp as any)?.first_name || ""} ${(emp as any)?.last_name || ""}`.trim()
            : "") ||
          email ||
          "Employee";

        return {
          ...emp,
          email,
          full_name: rawName,
          job_title: emp?.job_title || (emp as any)?.designation || "",
          role: emp?.role || (emp as any)?.role_title || (emp as any)?.designation || "EMPLOYEE",
          hierarchy_level: 1,
          reporting_manager: emp?.reporting_manager || "—",
          direct_reports_count: 0,
          team_size: 1,
          organization_path: [],
        };
      });
    }
  }, [rawEmployees]);

  // Filtered & Sorted Employee List for Table View
  const filteredEmployees = useMemo(() => {
    return employeesWithHierarchy
      .filter((emp: (typeof employeesWithHierarchy)[number]) => {
        // Search filter
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          const match =
            emp.full_name?.toLowerCase().includes(q) ||
            emp.email?.toLowerCase().includes(q) ||
            emp.employee_id?.toLowerCase().includes(q) ||
            emp.job_title?.toLowerCase().includes(q) ||
            emp.department?.toLowerCase().includes(q) ||
            emp.reporting_manager?.toLowerCase().includes(q) ||
            emp.team?.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Department filter
        if (selectedDept !== "All Departments" && emp.department !== selectedDept) return false;

        // Manager filter
        if (selectedManager !== "All Managers" && emp.reporting_manager !== selectedManager)
          return false;

        // Level filter
        if (selectedLevel !== "All Levels") {
          const levelNum = parseInt(selectedLevel.replace(/\D/g, ""), 10);
          if (!isNaN(levelNum) && emp.hierarchy_level !== levelNum) return false;
        }

        // Status filter
        if (selectedStatus !== "All Statuses" && emp.status !== selectedStatus) return false;

        // Employment type filter
        if (selectedEmpType !== "All Types" && emp.employment_type !== selectedEmpType)
          return false;

        return true;
      })
      .sort((a: (typeof employeesWithHierarchy)[number], b: (typeof employeesWithHierarchy)[number]) => {
        if (sortBy === "level") return (a.hierarchy_level ?? 99) - (b.hierarchy_level ?? 99);
        if (sortBy === "department") return (a.department ?? "").localeCompare(b.department ?? "");
        if (sortBy === "manager")
          return (a.reporting_manager ?? "").localeCompare(b.reporting_manager ?? "");
        return a.full_name.localeCompare(b.full_name);
      });
  }, [
    employeesWithHierarchy,
    debouncedSearch,
    selectedDept,
    selectedManager,
    selectedLevel,
    selectedStatus,
    selectedEmpType,
    sortBy,
  ]);

  const availableDepartments = useMemo<string[]>(() => {
    if (!departmentsRes?.data) return [];
    const d = departmentsRes.data;
    if (Array.isArray(d)) return d.map((dept: any) => dept.name).filter(Boolean);
    if (Array.isArray((d as any).items)) return (d as any).items.map((dept: any) => dept.name).filter(Boolean);
    return [];
  }, [departmentsRes]);

  const managerOptions = useMemo<string[]>(
    () => Array.from(new Set(employeesWithHierarchy.map((emp: (typeof employeesWithHierarchy)[number]) => emp.full_name).filter(Boolean))),
    [employeesWithHierarchy],
  );

  // Bulk Selection State
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isBulkManagerModalOpen, setIsBulkManagerModalOpen] = useState(false);
  const [targetBulkManager, setTargetBulkManager] = useState("");

  const toggleSelectAllRows = () => {
    if (selectedRowIds.length === filteredEmployees.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredEmployees.map((e: (typeof employeesWithHierarchy)[number]) => e.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleBulkAssignManagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRowIds.length || !targetBulkManager) return;

    try {
      const mgrObj = employeesWithHierarchy.find((e: (typeof employeesWithHierarchy)[number]) => e.full_name === targetBulkManager);
      await bulkReassign({
        employee_ids: selectedRowIds,
        new_manager_id: mgrObj?.id,
      }).unwrap();

      toast.success("Bulk Manager Assignment Complete", {
        description: `Updated manager to ${targetBulkManager} for ${selectedRowIds.length} employee(s).`,
      });
      setIsBulkManagerModalOpen(false);
      setSelectedRowIds([]);
    } catch (err) {
      toast.error("Failed bulk manager reassignment", {
        description: getApiErrorMessage(err as FetchBaseQueryError),
      });
    }
  };

  // Drag & Drop manager reassignment handler for OrgChart View
  const handleManagerReassign = async (employeeId: string, newManagerId: string) => {
    try {
      const managerEmp = employeesWithHierarchy.find((e: (typeof employeesWithHierarchy)[number]) => e.id === newManagerId);
      await changeManager({
        employee_id: employeeId,
        new_manager_id: newManagerId,
        new_manager_name: managerEmp?.full_name,
      }).unwrap();

      toast.success("Reporting Hierarchy Updated");
    } catch (err) {
      toast.error("Failed to reassign manager", {
        description: getApiErrorMessage(err as FetchBaseQueryError),
      });
    }
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingEmp, setViewingEmp] = useState<Employee | null>(null);
  const [viewingModalTab, setViewingModalTab] = useState<"profile" | "hierarchy">("profile");
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [deletingEmp, setDeletingEmp] = useState<Employee | null>(null);

  // Credentials returned by backend on creation
  const [credentials, setCredentials] = useState<GeneratedCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateEmployeeForm>({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    branch: "",
    reportingManager: "",
    employmentType: "Full-Time",
    joiningDate: new Date().toISOString().split("T")[0] ?? "",
    team: "Core Engineering",
    workMode: "Hybrid",
  });

  const resetForm = () =>
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      branch: "",
      reportingManager: "",
      employmentType: "Full-Time",
      joiningDate: new Date().toISOString().split("T")[0] ?? "",
      team: "Core Engineering",
      workMode: "Hybrid",
    });

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const mgrObj = employeesWithHierarchy.find((emp: (typeof employeesWithHierarchy)[number]) => emp.full_name === formData.reportingManager);

      const response = await createEmployee({
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        department: formData.department || undefined,
        job_title: formData.designation.trim(),
        branch: formData.branch || undefined,
        reporting_manager: formData.reportingManager || undefined,
        reporting_manager_id: mgrObj?.id,
        employment_type: formData.employmentType,
        joining_date: formData.joiningDate,
        team: formData.team || undefined,
        work_mode: formData.workMode,
        role: "EMPLOYEE",
      }).unwrap();

      const created = response.data;
      setIsAddModalOpen(false);
      resetForm();

      if (created.temp_password) {
        const isSent =
          created.email_sent ??
          (response.message ? response.message.toLowerCase().includes("sent") : true);

        setCredentials({
          employeeId: created.employee_id,
          email: created.email || (created as any).personal_email || (created as any).company_email || formData.email,
          tempPassword: created.temp_password,
          fullName:
            created.full_name ||
            (`${(created as any).first_name || ""} ${(created as any).last_name || ""}`.trim()) ||
            formData.fullName,
          emailSent: isSent,
        });
      }

      if (response.message) {
        toast.success(response.message);
      }
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError as FetchBaseQueryError));
    }
  };

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;

    try {
      const mgrObj = employeesWithHierarchy.find(
        (emp: (typeof employeesWithHierarchy)[number]) => emp.full_name === editingEmp.reporting_manager,
      );

      const response = await updateEmployee({
        id: editingEmp.id,
        body: {
          full_name: editingEmp.full_name,
          email: editingEmp.email,
          job_title: editingEmp.job_title || "",
          department: editingEmp.department,
          branch: editingEmp.branch || editingEmp.location,
          reporting_manager: editingEmp.reporting_manager,
          reporting_manager_id: mgrObj?.id,
          role: (typeof editingEmp.role === "string"
            ? editingEmp.role
            : (editingEmp.role as any)?.name ?? (editingEmp.role as any)?.role ?? "EMPLOYEE") as Role,
          team: editingEmp.team,
          work_mode: editingEmp.work_mode,
        },
      }).unwrap();

      setEditingEmp(null);
      if (response.message) toast.success(response.message);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError as FetchBaseQueryError));
    }
  };

  const handleToggleStatus = async (emp: Employee) => {
    try {
      const response = await setEmployeeStatus({
        id: emp.id,
        status: emp.status === "Active" ? "Inactive" : "Active",
      }).unwrap();
      if (response.message) toast.success(response.message);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError as FetchBaseQueryError));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEmp) return;

    try {
      const response = await deleteEmployee(deletingEmp.id).unwrap();
      setDeletingEmp(null);
      if (response.message) toast.success(response.message);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError as FetchBaseQueryError));
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportEmployees({
        format: "csv",
        search: debouncedSearch || undefined,
        filters: {
          department: selectedDept === "All Departments" ? undefined : selectedDept,
        },
      }).unwrap();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "employees_hierarchy.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError as FetchBaseQueryError));
    }
  };

  const inputClass =
    "w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none transition-all focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5";

  return (
    <div className="space-y-6">
      {/* ── Page Header & View Mode Switcher ────────────────────── */}
      <PageHeader
        title="Employee Directory & Hierarchy"
        description="Central enterprise workforce module. View directory, manage reporting chains, and visualize interactive org charts."
        breadcrumbs={[{ label: "Workforce", href: "/dashboard/workforce" }, { label: "Employees" }]}
        backHref="/dashboard/workforce"
        backLabel="Back to Workforce"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl border border-input bg-card/60 p-1">
              <button
                type="button"
                onClick={() => setActiveView("table")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeView === "table"
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableIcon className="size-3.5" /> Table Directory
              </button>

              <button
                type="button"
                onClick={() => setActiveView("org-chart")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeView === "org-chart"
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Network className="size-3.5" /> Org Chart
              </button>

              <button
                type="button"
                onClick={() => setActiveView("manager")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeView === "manager"
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="size-3.5" /> Manager View
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              <Download className="size-3.5" /> {isExporting ? "Exporting…" : "Export CSV"}
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="size-4" /> Create Employee
            </button>
          </div>
        }
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── View Renderers ─────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════ */}

      {activeView === "org-chart" ? (
        <OrgChartView
          employees={employeesWithHierarchy}
          onSelectEmployee={(emp) => {
            setViewingEmp(emp);
            setViewingModalTab("hierarchy");
          }}
          onManagerReassign={handleManagerReassign}
        />
      ) : activeView === "manager" ? (
        <ManagerAnalyticsView
          employees={employeesWithHierarchy}
          onSelectEmployee={(emp) => {
            setViewingEmp(emp);
            setViewingModalTab("hierarchy");
          }}
        />
      ) : (
        <>
          {/* ── Filter & Search Toolbar ───────────────────────────── */}
          <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Global Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by employee name, email, ID, manager, team, location..."
                  className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-ring focus:shadow-glow"
                />
              </div>

              {/* Counter Pill */}
              <div className="flex items-center gap-2">
                <span className="glass-tile rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Total ({employeesRes?.data.total ?? filteredEmployees.length})
                  {isFetching && !isLoading ? " · syncing…" : ""}
                </span>
              </div>
            </div>

            {/* Extended Multi-Filters Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
              {/* Department Filter */}
              <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs">
                <Filter className="mr-1.5 size-3.5 text-muted-foreground" />
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="All Departments" className="bg-card text-foreground">
                    All Departments
                  </option>
                  {availableDepartments.map((dept) => (
                    <option key={dept} value={dept} className="bg-card text-foreground">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reporting Manager Filter */}
              <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs">
                <Users className="mr-1.5 size-3.5 text-muted-foreground" />
                <select
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="All Managers" className="bg-card text-foreground">
                    All Managers
                  </option>
                  {managerOptions.map((mgr) => (
                    <option key={mgr} value={mgr} className="bg-card text-foreground">
                      {mgr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="All Statuses" className="bg-card text-foreground">
                    All Statuses
                  </option>
                  <option value="Active" className="bg-card text-foreground">
                    Active
                  </option>
                  <option value="Inactive" className="bg-card text-foreground">
                    Inactive
                  </option>
                  <option value="On Leave" className="bg-card text-foreground">
                    On Leave
                  </option>
                </select>
              </div>

              {/* Sort By Selector */}
              <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs ml-auto">
                <ArrowUpDown className="mr-1.5 size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-primary"
                >
                  <option value="name" className="bg-card text-foreground">
                    Employee Name
                  </option>
                  <option value="department" className="bg-card text-foreground">
                    Department
                  </option>
                  <option value="manager" className="bg-card text-foreground">
                    Reporting Manager
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Bulk Actions Floating Bar ───────────────────────────── */}
          {selectedRowIds.length > 0 && (
            <div className="glass-elevated flex items-center justify-between rounded-2xl border border-primary/30 p-3.5 shadow-float bg-primary/10">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <CheckSquare className="size-4" />
                <span>{selectedRowIds.length} Employee(s) Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBulkManagerModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
                >
                  <Users className="size-3.5" /> Assign Manager
                </button>
                <button
                  onClick={handleExportCSV}
                  className="glass-tile rounded-xl px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Bulk Export
                </button>
                <button
                  onClick={() => setSelectedRowIds([])}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* ── Employee Data Table ────────────────────────────────── */}
          <div className="glass-tile overflow-hidden rounded-2xl border border-border">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground font-bold">
                  <tr>
                    <th className="px-3 py-3.5 text-center w-10">
                      <button
                        type="button"
                        onClick={toggleSelectAllRows}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {selectedRowIds.length > 0 &&
                        selectedRowIds.length === filteredEmployees.length ? (
                          <CheckSquare className="size-4 text-primary" />
                        ) : (
                          <Square className="size-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3.5">Employee</th>
                    <th className="px-4 py-3.5">ID</th>
                    <th className="px-4 py-3.5">Designation</th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Reporting Manager</th>
                    <th className="px-4 py-3.5 text-center">Direct Reports</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {isLoading && (
                    <tr>
                      <td colSpan={9} className="px-5 py-10 text-center text-muted-foreground">
                        Loading workforce employee hierarchy telemetry…
                      </td>
                    </tr>
                  )}

                  {!isLoading && isError && (
                    <tr>
                      <td colSpan={9} className="px-5 py-10 text-center">
                        <p className="font-semibold text-destructive">
                          {getApiErrorMessage(error as FetchBaseQueryError)}
                        </p>
                        <button
                          type="button"
                          onClick={() => void refetch()}
                          className="mt-3 inline-flex items-center rounded-lg border border-input px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  )}

                  {!isLoading && !isError && filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-5 py-10 text-center text-muted-foreground">
                        No employees found matching current search and hierarchy filters.
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    !isError &&
                    filteredEmployees.map((emp: (typeof employeesWithHierarchy)[number]) => {
                      const isSelected = selectedRowIds.includes(emp.id);

                      return (
                        <tr
                          key={emp.id}
                          className={`transition-colors hover:bg-secondary/40 ${
                            isSelected ? "bg-primary/5" : ""
                          }`}
                        >
                          <td className="px-3 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleSelectRow(emp.id)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {isSelected ? (
                                <CheckSquare className="size-4 text-primary" />
                              ) : (
                                <Square className="size-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand font-display font-bold text-primary-foreground shadow-glow">
                                {emp.full_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{emp.full_name}</p>
                                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <Mail className="size-3" /> {emp.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-mono font-semibold text-muted-foreground">
                            {emp.employee_id}
                          </td>
                          <td className="px-4 py-4 font-medium text-foreground">
                            {emp.job_title || "—"}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{emp.department || "—"}</td>
                          <td className="px-4 py-4">
                            <span className="font-semibold text-foreground">
                              {emp.reporting_manager || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-foreground">
                            {emp.direct_reports_count ?? 0}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                emp.status === "Active"
                                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                  : "border-rose-500/20 bg-rose-500/10 text-rose-500"
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  emp.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                              />
                              {emp.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    title="More Options"
                                    className="grid size-8 place-items-center rounded-lg border border-border/40 bg-card/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </button>
                                </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 glass-elevated rounded-xl p-1.5 shadow-float"
                              >
                                <DropdownMenuItem
                                  onClick={() => {
                                    setViewingEmp(emp);
                                    setViewingModalTab("profile");
                                  }}
                                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer hover:bg-secondary"
                                >
                                  <Eye className="size-4 text-muted-foreground" /> View Profile
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    setViewingEmp(emp);
                                    setViewingModalTab("hierarchy");
                                  }}
                                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer hover:bg-secondary"
                                >
                                  <GitBranch className="size-4 text-primary" /> View Hierarchy
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => setEditingEmp(emp)}
                                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer hover:bg-secondary"
                                >
                                  <Pencil className="size-4 text-muted-foreground" /> Edit
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1 bg-border/60" />

                                {emp.status === "Active" ? (
                                  <DropdownMenuItem
                                    onClick={() => handleToggleStatus(emp)}
                                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-500 cursor-pointer hover:bg-rose-500/10"
                                  >
                                    <UserX className="size-4 text-rose-500" /> Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleToggleStatus(emp)}
                                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-500 cursor-pointer hover:bg-emerald-500/10"
                                  >
                                    <UserCheck className="size-4 text-emerald-500" /> Activate
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator className="my-1 bg-border/60" />

                                <DropdownMenuItem
                                  onClick={() => setDeletingEmp(emp)}
                                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-destructive cursor-pointer hover:bg-destructive/10"
                                >
                                  <Trash2 className="size-4 text-destructive" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── Create Employee Dialog ─────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              Create New Employee & Assign Hierarchy
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Fill in employee details and reporting manager. Hierarchy levels and paths update automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEmployee} className="mt-4 space-y-4">
            {/* Row 1: Full Name & Work Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name *</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <User className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Work Email *</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <Mail className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone & Designation */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <Phone className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Designation / Job Title *</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <Briefcase className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Senior Software Engineer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Department & Branch */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Department</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <Building2 className="size-4 shrink-0 text-muted-foreground" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none cursor-pointer"
                  >
                    {availableDepartments.map((dept) => (
                      <option key={dept} value={dept} className="bg-card text-foreground">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Branch / Work Location</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none cursor-pointer"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b} className="bg-card text-foreground">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 4: Reporting Manager & Employment Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Reporting Manager</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <Users className="size-4 shrink-0 text-muted-foreground" />
                  <select
                    value={formData.reportingManager}
                    onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none cursor-pointer"
                  >
                    <option value="" className="bg-card text-foreground">
                      None (Top Executive / CEO)
                    </option>
                    {managerOptions.map((m) => (
                      <option key={m} value={m} className="bg-card text-foreground">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Employment Type</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <GitBranch className="size-4 shrink-0 text-muted-foreground" />
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none cursor-pointer"
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-card text-foreground">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 5: Team & Work Mode */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Team Name</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <Layers className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g. Frontend Platform"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Work Mode</label>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card/70 px-3 py-2.5">
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    className="w-full bg-transparent text-xs outline-none cursor-pointer"
                  >
                    {WORK_MODES.map((wm) => (
                      <option key={wm} value={wm} className="bg-card text-foreground">
                        {wm}
                      </option>
                    ))}
                  </select>
                </div>
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
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-60"
              >
                {isCreating ? "Creating…" : "Create Employee"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── Generated Credentials Dialog ───────────────────────── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Dialog open={Boolean(credentials)} onOpenChange={(open) => !open && setCredentials(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-500" />
              </div>
              <div>
                <DialogTitle className="font-display text-lg font-bold text-emerald-500">
                  Employee Created Successfully
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Temporary login credentials for {credentials?.fullName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {credentials && (
            <div className="mt-4 space-y-3">
              {/* Employee ID */}
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Employee ID
                  </p>
                  <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                    {credentials.employeeId}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(credentials.employeeId, "id")}
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {copiedField === "id" ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>

              {/* Work Email */}
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Work Email
                  </p>
                  <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                    {credentials.email}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(credentials.email, "email")}
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {copiedField === "email" ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>

              {/* Temporary Password */}
              <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    Temporary Password
                  </p>
                  <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                    {credentials.tempPassword}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(credentials.tempPassword, "password")}
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {copiedField === "password" ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>

              {/* Email Delivery Status Banner */}
              <div
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-semibold ${
                  credentials.emailSent
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                }`}
              >
                {credentials.emailSent ? (
                  <>
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    <span>✔ Welcome Email Sent to {credentials.email}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                    <span>⚠ Welcome Email Could Not Be Sent (Share credentials manually)</span>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground leading-relaxed">
                <p className="font-semibold text-primary mb-1">⚠️ Important</p>
                <p>
                  Share these credentials securely with the employee. The employee can use these to sign
                  in at the OFC HR login portal.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => setCredentials(null)}
              className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
            >
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── View Profile & Hierarchy Dialog Modal ───────────────── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Dialog open={Boolean(viewingEmp)} onOpenChange={(open) => !open && setViewingEmp(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-xl">
          {viewingEmp && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand font-display text-lg font-bold text-primary-foreground shadow-glow">
                      {viewingEmp.full_name?.charAt(0)}
                    </div>
                    <div>
                      <DialogTitle className="font-display text-lg font-bold">
                        {viewingEmp.full_name}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">
                        {viewingEmp.job_title} · {viewingEmp.employee_id}
                      </DialogDescription>
                    </div>
                  </div>

                  {/* Modal Tab Switcher */}
                  <div className="flex items-center rounded-xl border border-input bg-card/60 p-1">
                    <button
                      type="button"
                      onClick={() => setViewingModalTab("profile")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                        viewingModalTab === "profile"
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Profile Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingModalTab("hierarchy")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                        viewingModalTab === "hierarchy"
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Org Hierarchy
                    </button>
                  </div>
                </div>
              </DialogHeader>

              {viewingModalTab === "profile" ? (
                <div className="mt-4 space-y-3 rounded-xl border border-border/60 bg-card/40 p-4 text-xs">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-3.5 text-primary" /> Email:
                    </span>
                    <span className="font-semibold text-foreground">{viewingEmp.email}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Phone className="size-3.5 text-primary" /> Phone:
                    </span>
                    <span className="font-semibold text-foreground">
                      {viewingEmp.phone || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-primary" /> Department:
                    </span>
                    <span className="font-semibold text-foreground">
                      {viewingEmp.department || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" /> Location:
                    </span>
                    <span className="font-semibold text-foreground">
                      {viewingEmp.branch || viewingEmp.location || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <UserCheck className="size-3.5 text-primary" /> Role:
                    </span>
                    <span className="font-bold text-primary">
                      {formatRoleLabel(viewingEmp.role)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-primary" /> MFA Enforced:
                    </span>
                    <span className="font-bold text-accent">
                      {viewingEmp.mfa_enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <EmployeeHierarchyCard
                    employee={viewingEmp}
                    allEmployees={employeesWithHierarchy}
                    onSelectEmployee={(target) => setViewingEmp(target)}
                  />
                </div>
              )}

              <DialogFooter className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingEmp(null)}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  Close Profile
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Edit Employee Dialog Modal ──────────────────────────── */}
      <Dialog open={Boolean(editingEmp)} onOpenChange={(open) => !open && setEditingEmp(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          {editingEmp && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold">
                  Edit Employee & Hierarchy Position
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Update employee profile information and reporting manager.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingEmp.full_name}
                    onChange={(e) => setEditingEmp({ ...editingEmp, full_name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Work Email</label>
                  <input
                    type="email"
                    required
                    value={editingEmp.email}
                    onChange={(e) => setEditingEmp({ ...editingEmp, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Job Title</label>
                    <input
                      type="text"
                      required
                      value={editingEmp.job_title || ""}
                      onChange={(e) => setEditingEmp({ ...editingEmp, job_title: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Department</label>
                    <select
                      value={editingEmp.department || ""}
                      onChange={(e) =>
                        setEditingEmp({ ...editingEmp, department: e.target.value })
                      }
                      className={inputClass + " cursor-pointer"}
                    >
                      {availableDepartments.map((dept) => (
                        <option key={dept} value={dept} className="bg-card text-foreground">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Reporting Manager</label>
                    <select
                      value={editingEmp.reporting_manager || ""}
                      onChange={(e) =>
                        setEditingEmp({ ...editingEmp, reporting_manager: e.target.value })
                      }
                      className={inputClass + " cursor-pointer"}
                    >
                      <option value="" className="bg-card text-foreground">
                        None (Top Executive / CEO)
                      </option>
                      {managerOptions
                        .filter((m) => m !== editingEmp.full_name)
                        .map((mgr) => (
                          <option key={mgr} value={mgr} className="bg-card text-foreground">
                            {mgr}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Role</label>
                    <select
                      value={
                        typeof editingEmp.role === "string"
                          ? editingEmp.role
                          : (editingEmp.role as any)?.name ??
                            (editingEmp.role as any)?.role ??
                            (editingEmp.role as any)?.title ??
                            "EMPLOYEE"
                      }
                      onChange={(e) => setEditingEmp({ ...editingEmp, role: e.target.value as any })}
                      className={inputClass + " cursor-pointer"}
                    >
                      {ROLES.map((roleObj) => (
                        <option key={roleObj.value} value={roleObj.value} className="bg-card text-foreground">
                          {roleObj.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEmp(null)}
                    className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-60"
                  >
                    {isUpdating ? "Saving…" : "Update Changes"}
                  </button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ────────────────────────── */}
      <Dialog open={Boolean(deletingEmp)} onOpenChange={(open) => !open && setDeletingEmp(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 text-destructive mb-1">
              <div className="grid size-10 place-items-center rounded-xl bg-destructive/10">
                <AlertTriangle className="size-5" />
              </div>
              <DialogTitle className="font-display text-xl font-bold">
                Delete User
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-2">
              Are you sure you want to delete <strong className="text-foreground">{deletingEmp?.full_name}</strong>?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeletingEmp(null)}
              className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-xl bg-destructive px-5 py-2 text-xs font-semibold text-destructive-foreground shadow-glow transition-all hover:bg-destructive/90 disabled:opacity-60"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Bulk Assign Manager Dialog ─────────────────────────── */}
      <Dialog open={isBulkManagerModalOpen} onOpenChange={setIsBulkManagerModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              Bulk Assign Reporting Manager
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Reassign reporting manager for {selectedRowIds.length} selected employee(s).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBulkAssignManagerSubmit} className="mt-4 space-y-4">
            <div>
              <label className={labelClass}>Select New Reporting Manager</label>
              <select
                required
                value={targetBulkManager}
                onChange={(e) => setTargetBulkManager(e.target.value)}
                className={inputClass + " cursor-pointer"}
              >
                <option value="" className="bg-card text-foreground">
                  -- Select Manager --
                </option>
                {managerOptions.map((mgr) => (
                  <option key={mgr} value={mgr} className="bg-card text-foreground">
                    {mgr}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBulkManagerModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBulkReassigning || !targetBulkManager}
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
              >
                {isBulkReassigning ? "Updating…" : "Apply Bulk Assignment"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
