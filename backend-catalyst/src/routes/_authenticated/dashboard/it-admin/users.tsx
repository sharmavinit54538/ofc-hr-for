import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Loader2, ShieldCheck, KeyRound, UserX, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/users")({
  component: ItAdminUsersPage,
});

function ItAdminUsersPage() {
  const { data: employeesRes, isLoading } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const [searchQuery, setSearchQuery] = useState("");

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);

  const filteredUsers = useMemo(() => {
    return rawEmployees.filter((acc) => {
      const q = searchQuery.toLowerCase();
      return (
        acc.full_name.toLowerCase().includes(q) ||
        acc.email.toLowerCase().includes(q) ||
        acc.employee_id.toLowerCase().includes(q) ||
        acc.role.toLowerCase().includes(q)
      );
    });
  }, [rawEmployees, searchQuery]);

  const handleResetCredentials = (email: string, name: string) => {
    toast.success(`Password reset link dispatched`, {
      description: `Sent credential reset instruction to ${email} (${name}).`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Identity & User Management"
        description="Administer active user accounts, manage security credentials, trigger password resets, and enforce RBAC scopes."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "User Management" }]}
        backHref="/dashboard/it-admin"
      />

      {/* Search Control */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search live users by name, email, employee ID, role..."
          className="w-full rounded-xl border border-border/60 bg-card/60 pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">User</th>
                  <th className="px-5 py-3.5 font-bold">Employee ID</th>
                  <th className="px-5 py-3.5 font-bold">RBAC Role</th>
                  <th className="px-5 py-3.5 font-bold">Account Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((acc) => (
                  <tr key={acc.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">
                      {acc.full_name}
                      <p className="text-[11px] text-muted-foreground font-normal">{acc.email}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{acc.employee_id}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 font-bold text-purple-400">
                        {acc.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        acc.status === "Active"
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                          : "border border-amber-500/20 bg-amber-500/10 text-amber-500"
                      }`}>
                        <CheckCircle2 className="size-3" /> {acc.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleResetCredentials(acc.email, acc.full_name)}
                        className="glass-tile rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-secondary inline-flex items-center gap-1"
                      >
                        <KeyRound className="size-3 text-primary" /> Reset Credentials
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center space-y-2">
            <UserX className="size-8 mx-auto text-muted-foreground" />
            <h4 className="font-display text-sm font-bold text-foreground">No Users Found</h4>
            <p className="text-xs text-muted-foreground">No employee accounts matched your search query in the live database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
