import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/leave/approvals")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/leave/approvals"
      parentHref="/dashboard/leave"
      parentLabel="Leave"
      title="Multi-Level Approval Rules"
      description="Manager escalation policies, auto-approval thresholds, and delegation rules."
      items={[
        { id: "1", title: "Standard 2-Level Approval Flow", subtitle: "Level 1: Direct Manager -> Level 2: HR BP", status: "Enforced", date: "Default for all staff", metric: "Auto-escalate in 48h" },
      ]}
    />
  ),
});
