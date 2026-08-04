import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useGetRiskMonitorsQuery } from "@/services/complianceApi";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/compliance/risks")({
  component: RiskMonitorsPage,
});

function RiskMonitorsPage() {
  const { data: risksRes, isLoading } = useGetRiskMonitorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const items = risksRes?.data ?? [];

  if (isLoading) {
    return (
      <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-primary" />
        Loading risk threat assessment telemetry...
      </div>
    );
  }

  return (
    <GenericSubModuleView
      href="/dashboard/compliance/risks"
      parentHref="/dashboard/compliance"
      parentLabel="Compliance"
      title="Risk Management & Threat Detection"
      description="Policy breach alerts, unauthorized data download monitoring, and credential safety."
      items={items}
    />
  );
}
