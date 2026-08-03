/**
 * Mock data for the Executive Suite & C-Level Control Plane.
 * High-level corporate telemetry, strategic KPIs, and AI insights.
 */

export const MOCK_EXECUTIVE_METRICS = {
  totalHeadcount: 1248,
  headcountGrowth: "+14.2% YoY",
  annualPayrollSpend: "₹48.2 Cr",
  revenuePerEmployee: "₹84.5 Lakhs",
  voluntaryAttritionRate: "4.8%",
  esgComplianceScore: "98.4 / 100",
  openExecutiveRoles: 3,
  aiProductivityIndex: "94.6%",
};

export interface DepartmentHeadcount {
  department: string;
  count: number;
  budget: string;
  growth: string;
  head: string;
}

export const MOCK_DEPARTMENT_BREAKDOWN: DepartmentHeadcount[] = [
  { department: "Product Engineering", count: 480, budget: "₹18.4 Cr", growth: "+18%", head: "Ananya Iyer" },
  { department: "Sales & Commercial", count: 260, budget: "₹12.2 Cr", growth: "+12%", head: "Vikram Sethi" },
  { department: "Customer Success", count: 180, budget: "₹6.5 Cr", growth: "+8%", head: "Priya Nair" },
  { department: "Finance Operations", count: 140, budget: "₹4.8 Cr", growth: "+4%", head: "Rahul Verma" },
  { department: "Human Resources", count: 95, budget: "₹3.2 Cr", growth: "+6%", head: "Aarav Mehta" },
  { department: "Legal & Compliance", count: 93, budget: "₹3.1 Cr", growth: "+2%", head: "Meera Iyer" },
];

export interface ExecutiveAiInsight {
  id: string;
  title: string;
  category: "Flight Risk" | "Cost Savings" | "Compliance Risk" | "Productivity";
  impact: "High Impact" | "Critical" | "Moderate";
  description: string;
  actionableRecommendation: string;
}

export const MOCK_EXECUTIVE_INSIGHTS: ExecutiveAiInsight[] = [
  {
    id: "INS-901",
    title: "Retention alert in Senior DevOps & Cloud Security roles",
    category: "Flight Risk",
    impact: "Critical",
    description: "Market compensation benchmarks show a 12% gap for Senior DevOps roles against Industry P75.",
    actionableRecommendation: "Approve ₹18 Lakhs out-of-cycle retention adjustment to secure 6 key cloud engineers.",
  },
  {
    id: "INS-902",
    title: "SaaS software license consolidation opportunity",
    category: "Cost Savings",
    impact: "High Impact",
    description: "Duplicate seats detected across Figma, Lucidchart, and Miro across 3 sub-teams.",
    actionableRecommendation: "Consolidate to enterprise plan saving ₹24 Lakhs annually.",
  },
  {
    id: "INS-903",
    title: "Q3 Labor law regulatory update in Karnataka branch",
    category: "Compliance Risk",
    impact: "Moderate",
    description: "New overtime threshold regulation coming into effect Sept 1, 2026.",
    actionableRecommendation: "Policy Center documentation auto-generated; ready for HR sign-off.",
  },
];
