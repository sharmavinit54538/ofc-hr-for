import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/ai-insights")({
  component: ExecutiveAiInsightsPage,
});

function ExecutiveAiInsightsPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const totalEmps = rawEmployees.length;
  const totalDepts = rawDepartments.length;
  const isLoading = isLoadingEmps || isLoadingDepts;

  const dynamicInsights = useMemo(() => {
    return [
      {
        id: "INS-001",
        category: "Workforce Headcount",
        impact: "Optimal",
        title: `Enterprise workforce of ${totalEmps} employee(s) mapped`,
        description: `Currently registered and tracked across ${totalDepts} business department(s).`,
        actionableRecommendation: "Maintain active organization structure and regular performance audits.",
      },
      {
        id: "INS-002",
        category: "Security & Role Governance",
        impact: "High Impact",
        title: "Role-Based Access Control Audit",
        description: "Executive and HR admin permissions are actively enforced via JWT tokens and RBAC middleware.",
        actionableRecommendation: "Conduct periodic review of executive permissions under Settings > Organization.",
      },
    ];
  }, [totalEmps, totalDepts]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Executive Telemetry & Insights"
        description="Autonomous AI workforce recommendations, cost optimization opportunities, and telemetry alerts."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "AI Insights" }]}
        backHref="/dashboard/executive"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {dynamicInsights.map((item) => (
            <div key={item.id} className="glass-tile rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-400">
                  {item.id} · {item.category}
                </span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                  {item.impact}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
                <span className="font-bold text-primary">AI Actionable Recommendation:</span>{" "}
                {item.actionableRecommendation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
