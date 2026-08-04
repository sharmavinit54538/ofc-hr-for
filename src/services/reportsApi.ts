import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

export interface ReportMeta {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  iconName: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  lastGenerated?: string;
  downloadsCount?: number;
}

export interface ReportsSummary {
  total_reports: number;
  scheduled_reports: number;
  generated_today: number;
  pending_reports: number;
  exported_reports: number;
  favorite_reports: number;
  total_employees: number;
  present_today: number;
  absent_today: number;
  on_leave_today: number;
  total_payroll_spend: number;
  active_departments_count: number;
}

export interface HeadcountReportData {
  total_headcount: number;
  active_employees: number;
  inactive_employees: number;
  gender_distribution: { gender: string; count: number }[];
  department_distribution: { name: string; count: number }[];
  monthly_growth_trend: { month: string; headcount: number }[];
}

export interface PayrollReportData {
  total_gross_payroll: number;
  total_net_payroll: number;
  total_tax_deductions: number;
  total_pf_contributions: number;
  average_salary: number;
  department_payroll_breakdown: { department: string; amount: number }[];
}

export interface AttendanceReportData {
  total_checkins: number;
  on_time_rate: number;
  late_checkins: number;
  avg_working_hours: number;
  attendance_by_day: { day: string; count: number }[];
}

export interface RecruitmentReportData {
  open_requisitions: number;
  total_applicants: number;
  interviews_conducted: number;
  offers_accepted: number;
  funnel: { stage: string; count: number }[];
}

export interface PerformanceReportData {
  total_reviews_completed: number;
  avg_performance_score: number;
  rating_distribution: { rating: string; count: number }[];
}

export interface AttritionReportData {
  total_exits: number;
  attrition_rate: number;
  department_attrition: { department: string; exits: number }[];
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportsCatalog: builder.query<ApiResponse<ReportMeta[]>, void>({
      query: () => "/api/v1/reports/catalog",
      providesTags: [{ type: "Report" as const, id: "CATALOG" }],
    }),

    getReportsSummary: builder.query<ApiResponse<ReportsSummary>, void>({
      query: () => "/api/v1/reports/summary",
      providesTags: [{ type: "Report" as const, id: "SUMMARY" }],
    }),

    getHeadcountReport: builder.query<ApiResponse<HeadcountReportData>, void>({
      query: () => "/api/v1/reports/headcount",
      providesTags: [{ type: "Report" as const, id: "HEADCOUNT" }],
    }),

    getPayrollReport: builder.query<ApiResponse<PayrollReportData>, void>({
      query: () => "/api/v1/reports/payroll",
      providesTags: [{ type: "Report" as const, id: "PAYROLL" }],
    }),

    getAttendanceReport: builder.query<ApiResponse<AttendanceReportData>, void>({
      query: () => "/api/v1/reports/attendance",
      providesTags: [{ type: "Report" as const, id: "ATTENDANCE" }],
    }),

    getRecruitmentReport: builder.query<ApiResponse<RecruitmentReportData>, void>({
      query: () => "/api/v1/reports/recruitment",
      providesTags: [{ type: "Report" as const, id: "RECRUITMENT" }],
    }),

    getPerformanceReport: builder.query<ApiResponse<PerformanceReportData>, void>({
      query: () => "/api/v1/reports/performance",
      providesTags: [{ type: "Report" as const, id: "PERFORMANCE" }],
    }),

    getAttritionReport: builder.query<ApiResponse<AttritionReportData>, void>({
      query: () => "/api/v1/reports/attrition",
      providesTags: [{ type: "Report" as const, id: "ATTRITION" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReportsCatalogQuery,
  useGetReportsSummaryQuery,
  useGetHeadcountReportQuery,
  useGetPayrollReportQuery,
  useGetAttendanceReportQuery,
  useGetRecruitmentReportQuery,
  useGetPerformanceReportQuery,
  useGetAttritionReportQuery,
} = reportsApi;
