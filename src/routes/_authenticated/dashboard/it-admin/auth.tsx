import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Shield, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/auth")({
  component: ItAdminAuthPage,
});

function ItAdminAuthPage() {
  const policies = [
    { title: "Minimum Password Length", setting: "12 Characters", status: "Enforced" },
    { title: "Password Complexity (Symbols & Digits)", setting: "Required", status: "Enforced" },
    { title: "Password Rotation Interval", setting: "90 Days", status: "Enforced" },
    { title: "Session Inactivity Timeout", setting: "15 Minutes", status: "Enforced" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authentication Policies"
        description="Configure organization-wide password security rules, session timeouts, and lockout limits."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Authentication" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="space-y-3">
        {policies.map((p) => (
          <div key={p.title} className="glass-tile rounded-2xl p-5 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-foreground">{p.title}</p>
              <p className="text-muted-foreground mt-0.5">Rule: <strong className="text-primary">{p.setting}</strong></p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="size-3.5" /> {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
