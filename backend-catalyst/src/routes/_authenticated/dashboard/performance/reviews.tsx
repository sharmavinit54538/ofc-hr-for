import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/performance/reviews")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/performance/reviews"
      parentHref="/dashboard/performance"
      parentLabel="Performance"
      title="Appraisal Cycles & Reviews"
      description="Mid-year check-ins, annual reviews, self-assessments, and 9-box talent matrix calibration."
      items={[
        { id: "1", title: "H2 2026 Mid-Year Performance Cycle", subtitle: "All Active Workforce · 1,248 Reviews", status: "In Progress (68% Complete)", date: "Closes Aug 25", metric: "Active Cycle" },
      ]}
    />
  ),
});
