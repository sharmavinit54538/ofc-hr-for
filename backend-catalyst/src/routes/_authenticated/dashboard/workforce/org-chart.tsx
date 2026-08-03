import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useChangeManagerMutation } from "@/services/employeeApi";
import { OrgChartView } from "@/components/workforce/org-chart-view";
import { computeEmployeeHierarchyInfo } from "@/utils/hierarchy";
import { useMemo } from "react";
import { toast } from "sonner";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getApiErrorMessage } from "@/utils/api-error";

export const Route = createFileRoute("/_authenticated/dashboard/workforce/org-chart")({
  component: OrgChartPage,
});

function OrgChartPage() {
  const { data: employeesRes, isLoading } = useListEmployeesQuery({ page: 1, page_size: 100 });
  const [changeManager] = useChangeManagerMutation();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);

  const employeesWithHierarchy = useMemo(() => {
    return rawEmployees.map((emp) => {
      const info = computeEmployeeHierarchyInfo(emp, rawEmployees);
      return {
        ...emp,
        hierarchy_level: info.level,
        reporting_manager: info.reportingManager?.full_name || emp.reporting_manager || "—",
        reporting_manager_id: info.reportingManager?.id || emp.reporting_manager_id,
        direct_reports_count: info.directReports.length,
        team_size: info.teamSize,
      };
    });
  }, [rawEmployees]);

  const handleManagerReassign = async (employeeId: string, newManagerId: string) => {
    try {
      const managerEmp = employeesWithHierarchy.find((e) => e.id === newManagerId);
      await changeManager({
        employee_id: employeeId,
        new_manager_id: newManagerId,
        new_manager_name: managerEmp?.full_name,
      }).unwrap();

      toast.success("Reporting Hierarchy Updated");
    } catch (err) {
      toast.error("Failed to reassign manager", {
        description: getApiErrorMessage(err as FetchBaseQueryError),
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Chart Visualizer"
        description="Interactive reporting hierarchy, team structures, and organizational reporting tree."
        breadcrumbs={[{ label: "Workforce", href: "/dashboard/workforce" }, { label: "Organization Chart" }]}
        backHref="/dashboard/workforce"
        backLabel="Back to Workforce"
      />

      {isLoading ? (
        <div className="glass-tile flex items-center justify-center p-12 rounded-3xl">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading org chart telemetry...</span>
        </div>
      ) : (
        <OrgChartView
          employees={employeesWithHierarchy}
          onManagerReassign={handleManagerReassign}
        />
      )}
    </div>
  );
}

