import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield,
  Check,
  Save,
  Users,
  Plus,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/settings/roles")({
  component: RolesPermissionsPage,
});

interface RoleItem {
  id: string;
  name: string;
  code: string;
  usersCount: number;
  description: string;
  isSystem: boolean;
  permissions: {
    workforce: boolean;
    payroll: boolean;
    attendance: boolean;
    recruitment: boolean;
    settings: boolean;
  };
}

const INITIAL_ROLES: RoleItem[] = [
  {
    id: "role_1",
    name: "HR Administrator",
    code: "HR_ADMIN",
    usersCount: 8,
    description: "Full access to workforce directory, employee contracts, payroll, and onboarding workflows.",
    isSystem: true,
    permissions: { workforce: true, payroll: true, attendance: true, recruitment: true, settings: true },
  },
  {
    id: "role_2",
    name: "IT Administrator",
    code: "IT_ADMIN",
    usersCount: 4,
    description: "Access to SSO integrations, hardware task provisioning, audit logs, and security enforcement.",
    isSystem: true,
    permissions: { workforce: true, payroll: false, attendance: true, recruitment: false, settings: true },
  },
  {
    id: "role_3",
    name: "Department Manager",
    code: "MANAGER",
    usersCount: 24,
    description: "Approval rights for leave applications, team attendance, performance appraisals, and 1-on-1s.",
    isSystem: false,
    permissions: { workforce: true, payroll: false, attendance: true, recruitment: true, settings: false },
  },
  {
    id: "role_4",
    name: "Employee Self-Service",
    code: "EMPLOYEE",
    usersCount: 1200,
    description: "Personal profile viewing, leave requests, payslip downloads, and training module access.",
    isSystem: true,
    permissions: { workforce: false, payroll: false, attendance: true, recruitment: false, settings: false },
  },
];

function RolesPermissionsPage() {
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("role_1");

  const activeRole = (roles.find((r) => r.id === selectedRoleId) || roles[0])!;

  const handleTogglePermission = (key: keyof RoleItem["permissions"]) => {
    setRoles(
      roles.map((r) =>
        r.id === activeRole.id
          ? {
              ...r,
              permissions: {
                ...r.permissions,
                [key]: !r.permissions[key],
              },
            }
          : r,
      ),
    );
  };

  const handleSave = () => {
    toast.success("Role Matrix Saved", {
      description: `Permission scopes updated for ${activeRole.name}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Roles & Permissions Matrix (RBAC)"
        description="Role-based access control, system permission scopes, and custom admin definitions."
        breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }, { label: "Roles & Permissions" }]}
        backHref="/dashboard/settings"
        backLabel="Back to Settings"
        actions={
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Save className="size-4" /> Save Role Matrix
          </button>
        }
      />

      <div className="grid gap-6 md:grid-cols-12">
        {/* ── Left Column: Configured Roles List (4 cols) ───────── */}
        <div className="md:col-span-5 lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Configured Roles ({roles.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`glass-tile flex items-center justify-between rounded-2xl p-3.5 cursor-pointer transition-all ${
                  role.id === activeRole.id
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "hover:bg-secondary/60"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                    <Shield className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-bold text-xs text-foreground">{role.name}</h4>
                    <span className="truncate text-[10px] text-muted-foreground font-mono block mt-0.5">
                      {role.code}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right pl-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                    <Users className="size-3" /> {role.usersCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: Permission Matrix Detail (8 cols) ────── */}
        <div className="md:col-span-7 lg:col-span-8 glass-tile rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {activeRole.name}
                </h3>
                {activeRole.isSystem && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    System Built-in
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeRole.description}
              </p>
            </div>

            <button
              onClick={handleSave}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Save className="size-3.5" /> Save Scopes
            </button>
          </div>

          {/* Module Permission Switches */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Module Access & Enforcement Scopes
            </h4>

            <div className="space-y-3">
              {[
                { key: "workforce", label: "Workforce & Employee Directory", desc: "View, edit, and manage all employee records and org charts" },
                { key: "payroll", label: "Payroll & Salary Structures", desc: "Access salary slips, tax declarations, and bank transfer dispatches" },
                { key: "attendance", label: "Attendance & Shift Management", desc: "View biometric punch logs, shift rosters, and leave approvals" },
                { key: "recruitment", label: "Recruitment & Job Openings", desc: "Post jobs, review applicant resumes, and issue offer letters" },
                { key: "settings", label: "System Settings & Integrations", desc: "Configure SSO, organization profiles, and billing parameters" },
              ].map((perm) => {
                const isChecked = activeRole.permissions[perm.key as keyof RoleItem["permissions"]];
                return (
                  <div
                    key={perm.key}
                    onClick={() => handleTogglePermission(perm.key as keyof RoleItem["permissions"])}
                    className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-colors ${
                      isChecked
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/50 bg-card/60 hover:bg-secondary/40"
                    }`}
                  >
                    <div className="space-y-0.5 pr-3">
                      <h5 className="font-bold text-xs text-foreground">{perm.label}</h5>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{perm.desc}</p>
                    </div>

                    <div
                      className={`flex size-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isChecked
                          ? "border-primary bg-gradient-brand text-primary-foreground shadow-glow"
                          : "border-input bg-card/80"
                      }`}
                    >
                      {isChecked && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
