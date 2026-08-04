/**
 * Mock data for the Executive Suite & C-Level Control Plane.
 * High-level corporate telemetry, strategic KPIs, and AI insights.
 */

export const MOCK_EXECUTIVE_METRICS = {
  totalHeadcount: 0,
  headcountGrowth: "0%",
  annualPayrollSpend: "—",
  revenuePerEmployee: "—",
  voluntaryAttritionRate: "0%",
  esgComplianceScore: "—",
  openExecutiveRoles: 0,
  aiProductivityIndex: "0%",
};

export interface DepartmentHeadcount {
  department: string;
  count: number;
  budget: string;
  growth: string;
  head: string;
}

export const MOCK_DEPARTMENT_BREAKDOWN: DepartmentHeadcount[] = [];

export interface ExecutiveAiInsight {
  id: string;
  title: string;
  category: "Flight Risk" | "Cost Savings" | "Compliance Risk" | "Productivity";
  impact: "High Impact" | "Critical" | "Moderate";
  description: string;
  actionableRecommendation: string;
}

export const MOCK_EXECUTIVE_INSIGHTS: ExecutiveAiInsight[] = [];
