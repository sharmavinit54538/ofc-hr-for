export interface ReportMeta {
  id: string;
  title: string;
  category: "Executive" | "Workforce" | "Operations" | "Financial" | "AI & Audit";
  description: string;
  href: string;
  iconName: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  lastGenerated?: string;
  exportFormat?: string;
  downloadsCount?: number;
}

export const REPORTS_CATALOGUE: ReportMeta[] = [];

export const MONTHLY_HEADCOUNT_TREND: any[] = [];

export const DEPARTMENT_RATIOS: any[] = [];

export const GENDER_DISTRIBUTION: any[] = [];

export const RECRUITMENT_FUNNEL: any[] = [];

export const PERFORMANCE_RATINGS: any[] = [];

export const PAYROLL_SUMMARY: any = {
  totalGrossPayroll: "$0",
  totalTaxDeductions: "$0",
  totalPfContributions: "$0",
  averageSalary: "$0",
};

export const AI_IMPACT_METRICS: any[] = [];
