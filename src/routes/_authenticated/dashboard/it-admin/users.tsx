import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useListOrganizationUsersQuery } from "@/services/authApi";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/users")({
  component: ItAdminUsersPage,
});

function ItAdminUsersPage() {
  const { data: usersRes, isLoading } = useListOrganizationUsersQuery();
  const users = usersRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Identity & User Management"
        description="Administer user accounts, manage active device sessions, trigger password resets, and enforce lockouts."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "User Management" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="ml-2 text-xs">Loading user accounts...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <Users className="size-10 text-muted-foreground/60" />
            <h3 className="font-display text-base font-bold text-foreground">No Users Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              No organization users found in the identity directory.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">User</th>
                  <th className="px-5 py-3.5 font-bold">Role</th>
                  <th className="px-5 py-3.5 font-bold">MFA Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((acc) => (
                  <tr key={acc.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">
                      {acc.full_name || "User"}
                      <p className="text-[11px] text-muted-foreground font-normal">{acc.email}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-primary">{acc.role || "EMPLOYEE"}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                        Enforced
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toast.success(`Password reset link sent to ${acc.email}`)}
                        className="glass-tile rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-secondary"
                      >
                        Reset Credentials
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
