import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/compliance/audit-logs")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/compliance/audit-logs"
      parentHref="/dashboard/compliance"
      parentLabel="Compliance"
      title="Immutable Audit Trail Logs"
      description="SOC 2 Type II compliant activity telemetry, permission changes, and access logs."
      items={[
        { id: "1", title: "Role Assignment Modification", subtitle: "Actor: Aarav Mehta · Target: Priya Nair (Granted IT_ADMIN)", status: "Logged & Hashed", date: "Today 08:12 IST", metric: "SHA-256 Verified" },
      ]}
    />
  ),
});
