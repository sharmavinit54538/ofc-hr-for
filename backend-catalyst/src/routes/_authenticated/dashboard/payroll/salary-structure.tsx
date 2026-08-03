import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/payroll/salary-structure")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/payroll/salary-structure"
      parentHref="/dashboard/payroll"
      parentLabel="Payroll"
      title="Salary Structure & Compensation Grades"
      description="Basic salary, HRA, special allowances, ESOP grants, and variable bonus templates."
      items={[
        { id: "1", title: "Executive Pay Grade (L8)", subtitle: "50% Basic, 20% HRA, 30% Special Allowance + ESOPs", status: "Active Structure", date: "Grade: L8", metric: "$140k - $210k" },
        { id: "2", title: "Senior Engineering Grade (L6)", subtitle: "50% Basic, 20% HRA, 30% Special Allowance", status: "Active Structure", date: "Grade: L6", metric: "$110k - $150k" },
      ]}
    />
  ),
});
