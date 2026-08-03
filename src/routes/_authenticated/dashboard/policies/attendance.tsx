import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/policies/attendance")({
  component: AttendancePoliciesPage,
});

function AttendancePoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Work Shift Policies"
        description="Shift timings, late mark thresholds, and remote punch-in regularization rules."
        breadcrumbs={[{ label: "Policy Center", href: "/dashboard/policies" }, { label: "Attendance Policies" }]}
        backHref="/dashboard/policies"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">4 Active Attendance & Shift Guidelines Published.</div>
    </div>
  );
}
