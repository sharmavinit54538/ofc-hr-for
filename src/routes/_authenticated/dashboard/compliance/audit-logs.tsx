import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useGetAuditLogsQuery } from "@/services/complianceApi";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/compliance/audit-logs")({
  component: AuditLogsPage,
});

function AuditLogsPage() {
  const { data: logsRes, isLoading } = useGetAuditLogsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const items = logsRes?.data ?? [];

  if (isLoading) {
    return (
      <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-primary" />
        Loading immutable system audit logs...
      </div>
    );
  }

  return (
    <GenericSubModuleView
      href="/dashboard/compliance/audit-logs"
      parentHref="/dashboard/compliance"
      parentLabel="Compliance"
      title="Immutable Audit Trail Logs"
      description="SOC 2 Type II compliant activity telemetry, permission changes, and access logs."
      items={items}
    />
  );
}
