import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce/analytics")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/ai-workforce/analytics"
      parentHref="/dashboard/ai-workforce"
      parentLabel="AI Workforce"
      title="People Analytics AI & Predictive Modeling"
      description="Attrition risk prediction, flight risk indicators, team burnout alerts, and compensation benchmarking."
      items={[
        { id: "1", title: "Flight Risk Predictive Index", subtitle: "Analyzes engagement, 1-on-1 sentiment, and tenure", status: "Low Risk Overall (2.4%)", date: "Updated Daily", metric: "Machine Learning" },
      ]}
    />
  ),
});
