import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

export interface ComplianceItem {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  date: string;
  metric: string;
}


export interface ComplianceSummary {
  compliance_score: number;
  statutory_laws_count: number;
  audit_logs_count: number;
  encrypted_docs_count: number;
  threats_detected: number;
}

export const complianceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplianceSummary: builder.query<ApiResponse<ComplianceSummary>, void>({
      query: () => "/api/v1/compliance/summary",
      providesTags: ["Compliance"],
    }),

    getLaborLaws: builder.query<ApiResponse<ComplianceItem[]>, void>({
      query: () => "/api/v1/compliance/laws",
      providesTags: ["Compliance"],
    }),

    getAuditLogs: builder.query<ApiResponse<ComplianceItem[]>, void>({
      query: () => "/api/v1/compliance/audit-logs",
      providesTags: ["Compliance"],
    }),

    getComplianceDocuments: builder.query<ApiResponse<ComplianceItem[]>, void>({
      query: () => "/api/v1/compliance/documents",
      providesTags: ["Compliance"],
    }),

    getRiskMonitors: builder.query<ApiResponse<ComplianceItem[]>, void>({
      query: () => "/api/v1/compliance/risks",
      providesTags: ["Compliance"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetComplianceSummaryQuery,
  useGetLaborLawsQuery,
  useGetAuditLogsQuery,
  useGetComplianceDocumentsQuery,
  useGetRiskMonitorsQuery,
} = complianceApi;
