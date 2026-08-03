import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/leave/balances")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/leave/balances"
      parentHref="/dashboard/leave"
      parentLabel="Leave"
      title="Leave Balances & Accrual Rules"
      description="Policy limits, annual accruals, rollover caps, and encashment rules."
      items={[
        { id: "1", title: "Earned / Privilege Leave (PL)", subtitle: "18 Days / Year · Accrued monthly (+1.5 days)", status: "Active Policy", date: "Cap: 30 Days", metric: "Encashable" },
        { id: "2", title: "Casual & Medical Leave (CL/SL)", subtitle: "12 Days / Year · No rollover", status: "Active Policy", date: "Resets Dec 31", metric: "Non-Encashable" },
      ]}
    />
  ),
});
