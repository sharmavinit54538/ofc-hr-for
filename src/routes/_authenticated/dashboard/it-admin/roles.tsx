import { createFileRoute } from "@tanstack/react-router";
import { Lock, Shield, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ROLE_DEFINITIONS } from "@/lib/auth/roles";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/roles")({
  component: ItAdminRolesPage,
});

function ItAdminRolesPage() {
  const rolesList = Object.values(ROLE_DEFINITIONS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Access Control Matrix"
        description="Configure Role-Based Access Control (RBAC) permission matrices and security group assignments."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Roles & Permissions" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {rolesList.map((r) => (
          <div key={r.role} className="glass-tile rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">{r.role}</span>
              <span className="text-[10px] text-muted-foreground">Landing: {r.landing}</span>
            </div>
            <h3 className="font-display text-sm font-bold text-foreground">{r.label}</h3>
            <p className="text-xs text-muted-foreground">{r.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {r.permissions.map((p) => (
                <span key={p} className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[9px] font-mono font-semibold">
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
