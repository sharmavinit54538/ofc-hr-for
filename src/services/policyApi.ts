import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

export interface PolicyRecord {
  id: string;
  policyId: string;
  title: string;
  category: string;
  version: string;
  effectiveDate: string;
  lastReviewed: string;
  author: string;
  acknowledgementPct: number;
  status: string;
  summary: string;
}

export interface CreatePolicyInput {
  title: string;
  category: string;
  version: string;
  summary: string;
}

export interface PolicySummary {
  total_published: number;
  hr_policies_count: number;
  payroll_policies_count: number;
  attendance_policies_count: number;
  leave_policies_count: number;
  security_policies_count: number;
  avg_acknowledgment_pct: number;
}

export const policyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPolicies: builder.query<ApiResponse<PolicyRecord[]>, { category?: string; q?: string } | void>({
      query: (params) => ({
        url: "/api/v1/policies",
        params: params ? { category: params.category, q: params.q } : {},
      }),
      providesTags: ["Policy"],
    }),

    createPolicy: builder.mutation<ApiResponse<PolicyRecord>, CreatePolicyInput>({
      query: (body) => ({
        url: "/api/v1/policies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Policy"],
    }),

    getPolicySummary: builder.query<ApiResponse<PolicySummary>, void>({
      query: () => "/api/v1/policies/summary",
      providesTags: ["Policy"],
    }),

    getPoliciesByCategory: builder.query<ApiResponse<PolicyRecord[]>, string>({
      query: (category) => `/api/v1/policies/category/${category}`,
      providesTags: ["Policy"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListPoliciesQuery,
  useCreatePolicyMutation,
  useGetPolicySummaryQuery,
  useGetPoliciesByCategoryQuery,
} = policyApi;
