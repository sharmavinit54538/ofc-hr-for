import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Building2, Crown, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/executive/profile")({
  component: ExecutiveProfilePage,
});

function ExecutiveProfilePage() {
  const user = useAuthStore((s) => s.user);

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "E";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Profile"
        description="View your executive office details, security clearance level, and organizational position."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "My Profile" }]}
        backHref="/dashboard/executive"
      />

      <div className="glass-tile rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand font-display text-3xl font-bold text-primary-foreground shadow-glow">
            {initial}
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {user?.fullName || "Executive Member"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.jobTitle || "Executive Leadership"} · Executive Office
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400">
                <Crown className="size-3.5 text-purple-400" /> Executive Role ({user?.role || "EXECUTIVE"})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <ShieldCheck className="size-3.5 text-emerald-400" /> Account Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-tile rounded-2xl p-5 space-y-3 text-xs max-w-xl">
        <h3 className="font-display text-base font-bold text-foreground mb-4">Official Executive Credentials</h3>
        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
          <span className="text-muted-foreground flex items-center gap-1.5"><Mail className="size-3.5 text-primary" /> Work Email</span>
          <span className="font-semibold text-foreground">{user?.email || "Not Provided"}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
          <span className="text-muted-foreground flex items-center gap-1.5"><Phone className="size-3.5 text-primary" /> Phone</span>
          <span className="font-semibold text-foreground">{user?.phone || "Not Provided"}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
          <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" /> Location / Branch</span>
          <span className="font-semibold text-foreground">{user?.location || user?.branch || "Headquarters"}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-muted-foreground flex items-center gap-1.5"><Building2 className="size-3.5 text-primary" /> Employee ID</span>
          <span className="font-mono font-bold text-primary">{user?.employeeId || user?.id?.substring(0, 8) || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
