import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  ShieldCheck,
  Hash,
  Globe,
  Heart,
  Edit,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetEmployeeProfileQuery } from "@/services/employeeSettingsApi";

export const Route = createFileRoute("/_authenticated/dashboard/employee/profile")({
  component: EmployeeProfilePage,
});

function EmployeeProfilePage() {
  const storeUser = useAuthStore((s) => s.user);
  const { data: profileRes, isLoading: isProfileLoading } = useGetEmployeeProfileQuery();

  const profile = profileRes?.data;

  const fullName = profile?.full_name || storeUser?.fullName || "Employee";
  const email = profile?.work_email || storeUser?.email || "employee@company.com";
  const phone = profile?.phone || storeUser?.phone || "+91 98765 43210";
  const employeeId =
    profile?.employee_id ||
    storeUser?.employeeId ||
    (storeUser?.id ? `EMP-${storeUser.id.replace(/-/g, "").slice(0, 6).toUpperCase()}` : "EMP-000101");
  const location = profile?.work_location || profile?.city || storeUser?.location || "Bengaluru HQ — Tower B";
  const jobTitle = profile?.job_title || storeUser?.jobTitle || "Software Engineer";
  const department = profile?.department || storeUser?.department || "Engineering";
  const reportingManager = profile?.reporting_manager || "Sanya Kapoor (VP Engineering)";
  const employmentType = profile?.employment_type || "Full-Time";
  const joiningDate = profile?.joining_date || "Jan 15, 2025";
  const emergencyName = profile?.emergency_contact_name || "Meera Verma";
  const emergencyRel = profile?.emergency_relationship || "Spouse";
  const emergencyPhone = profile?.emergency_phone || "+91 99000 12345";

  const personalInfo = [
    { label: "Full Name", value: fullName, icon: User },
    { label: "Work Email", value: email, icon: Mail },
    { label: "Phone", value: phone, icon: Phone },
    { label: "Employee ID", value: employeeId, icon: Hash },
    { label: "Location", value: location, icon: MapPin },
  ];

  const jobDetails = [
    { label: "Job Title", value: jobTitle, icon: Briefcase },
    { label: "Department", value: department, icon: Building2 },
    { label: "Reporting Manager", value: reportingManager, icon: User },
    { label: "Employment Type", value: employmentType, icon: Calendar },
    { label: "Date of Joining", value: joiningDate, icon: Calendar },
    { label: "Work Location", value: location, icon: Globe },
  ];

  const emergencyContact = [
    { label: "Contact Name", value: emergencyName, icon: User },
    { label: "Relationship", value: emergencyRel, icon: Heart },
    { label: "Phone", value: emergencyPhone, icon: Phone },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-tile rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand font-display text-3xl font-bold text-primary-foreground shadow-glow">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {fullName}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {jobTitle} · {department}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Active
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                <ShieldCheck className="size-3" /> {profile?.role || "Employee"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <div className="glass-tile rounded-2xl p-5">
          <h2 className="font-display text-base font-bold text-foreground mb-4">Personal Information</h2>
          {isProfileLoading ? (
            <div className="space-y-3 py-2">
              <div className="h-6 w-full animate-pulse rounded bg-secondary/60" />
              <div className="h-6 w-full animate-pulse rounded bg-secondary/60" />
              <div className="h-6 w-full animate-pulse rounded bg-secondary/60" />
            </div>
          ) : (
            <div className="space-y-3">
              {personalInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0"
                  >
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="size-3.5 text-primary" /> {item.label}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{item.value}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="glass-tile rounded-2xl p-5">
          <h2 className="font-display text-base font-bold text-foreground mb-4">Job Details</h2>
          {isProfileLoading ? (
            <div className="space-y-3 py-2">
              <div className="h-6 w-full animate-pulse rounded bg-secondary/60" />
              <div className="h-6 w-full animate-pulse rounded bg-secondary/60" />
              <div className="h-6 w-full animate-pulse rounded bg-secondary/60" />
            </div>
          ) : (
            <div className="space-y-3">
              {jobDetails.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0"
                  >
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="size-3.5 text-primary" /> {item.label}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{item.value}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="glass-tile rounded-2xl p-5 lg:col-span-2">
          <h2 className="font-display text-base font-bold text-foreground mb-4">Emergency Contact</h2>
          {isProfileLoading ? (
            <div className="h-12 w-full animate-pulse rounded bg-secondary/60" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {emergencyContact.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-xl border border-border/50 bg-card/40 p-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Icon className="size-3.5 text-primary" /> {item.label}
                    </div>
                    <p className="font-bold text-foreground">{item.value}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
