import { createFileRoute } from "@tanstack/react-router";
import { Users, Shield, UserX, Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
const USERS = [
  { id: "usr-01", fullName: "Aarav Mehta", email: "hr.admin@northwind.com", employeeId: "NW-1042", role: "HR_ADMIN" },
  { id: "usr-02", fullName: "Priya Nair", email: "it.admin@northwind.com", employeeId: "NW-0318", role: "IT_ADMIN" },
  { id: "usr-03", fullName: "Vikram Sethi", email: "executive@northwind.com", employeeId: "NW-0007", role: "EXECUTIVE" },
  { id: "usr-04", fullName: "Sanya Kapoor", email: "manager@northwind.com", employeeId: "NW-2290", role: "MANAGER" },
  { id: "usr-05", fullName: "Rahul Verma", email: "employee@northwind.com", employeeId: "NW-3871", role: "EMPLOYEE" },
];

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/users")({
  component: ItAdminUsersPage,
});

function ItAdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Identity & User Management"
        description="Administer user accounts, manage active device sessions, trigger password resets, and enforce lockouts."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "User Management" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">User</th>
                <th className="px-5 py-3.5 font-bold">Employee ID</th>
                <th className="px-5 py-3.5 font-bold">Role</th>
                <th className="px-5 py-3.5 font-bold">MFA Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {USERS.map((acc) => (
                <tr key={acc.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-bold text-foreground">
                    {acc.fullName}
                    <p className="text-[11px] text-muted-foreground font-normal">{acc.email}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{acc.employeeId}</td>
                  <td className="px-5 py-4 font-semibold text-primary">{acc.role}</td>
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
      </div>
    </div>
  );
}
