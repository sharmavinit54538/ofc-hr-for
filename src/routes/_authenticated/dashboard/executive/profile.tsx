import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Building2, Crown, ShieldCheck, Calendar, Briefcase, Loader2 } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { PageHeader } from "@/components/admin/page-header";
import { useGetEmployeeProfileQuery } from "@/services/employeeSettingsApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/profile")({
  component: ExecutiveProfilePage,
});

function ExecutiveProfilePage() {
  const authUser = useAuthStore((s) => s.user);
  const { data: profileRes, isLoading } = useGetEmployeeProfileQuery();
  const profile = profileRes?.data;

  const fullName = profile?.full_name || authUser?.fullName || "Executive Member";
  const jobTitle = profile?.job_title || authUser?.jobTitle || "Executive Office";
  const department = profile?.department || "Executive Leadership";
  const email = profile?.work_email || authUser?.email || "Not Provided";
  const phone = profile?.phone || authUser?.phone || "Not Provided";
  const location = profile?.work_location || profile?.office_branch || profile?.city || authUser?.location || authUser?.branch || "Headquarters";
  const employeeId = profile?.employee_id || authUser?.employeeId || authUser?.id?.substring(0, 8) || "N/A";
  const role = profile?.role || authUser?.role || "EXECUTIVE";
  const joiningDate = profile?.joining_date || "N/A";

  const initial = fullName ? fullName.charAt(0).toUpperCase() : "E";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Profile & Credentials"
        description="View your live executive office credentials, authorization status, and organizational details."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "My Profile" }]}
        backHref="/dashboard/executive"
      />

      <div className="glass-tile rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand font-display text-3xl font-bold text-primary-foreground shadow-glow">
            {isLoading ? <Loader2 className="size-8 animate-spin" /> : initial}
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {fullName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {jobTitle} · {department}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400">
                <Crown className="size-3.5 text-purple-400" /> Executive Role ({role})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <ShieldCheck className="size-3.5 text-emerald-400" /> Verified Account
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-tile rounded-2xl p-5 space-y-3 text-xs max-w-xl">
        <h3 className="font-display text-base font-bold text-foreground mb-4">Official Executive Credentials & Telemetry</h3>
        
        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
          <span className="text-muted-foreground flex items-center gap-1.5"><Mail className="size-3.5 text-primary" /> Work Email</span>
          <span className="font-semibold text-foreground">{email}</span>
        </div>

        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
          <span className="text-muted-foreground flex items-center gap-1.5"><Phone className="size-3.5 text-primary" /> Phone</span>
          <span className="font-semibold text-foreground">{phone}</span>
        </div>

        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
          <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" /> Location / Branch</span>
          <span className="font-semibold text-foreground">{location}</span>
        </div>

        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
          <span className="text-muted-foreground flex items-center gap-1.5"><Briefcase className="size-3.5 text-primary" /> Department</span>
          <span className="font-semibold text-foreground">{department}</span>
        </div>

        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
          <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="size-3.5 text-primary" /> Joining Date</span>
          <span className="font-semibold text-foreground">{joiningDate}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-muted-foreground flex items-center gap-1.5"><Building2 className="size-3.5 text-primary" /> Employee ID</span>
          <span className="font-mono font-bold text-primary">{employeeId}</span>
        </div>
      </div>
    </div>
  );
}
