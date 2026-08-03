import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/compliance/risks")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/compliance/risks"
      parentHref="/dashboard/compliance"
      parentLabel="Compliance"
      title="Risk Management & Threat Detection"
      description="Policy breach alerts, unauthorized data download monitoring, and credential safety."
      items={[
        { id: "1", title: "Data Export Anomaly Monitor", subtitle: "0 Suspicious Bulk Exports Detected in last 30 days", status: "Protected", date: "Continuous Scan", metric: "Zero Threat" },
      ]}
    />
  ),
});
