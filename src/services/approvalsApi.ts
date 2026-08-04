import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";

/* ── Types ─────────────────────────────────────────────── */

export interface ApprovalItem {
  id: string;
  approvalId: string;
  type: string;
  requestTitle: string;
  requesterName: string;
  requesterDept: string;
  priority: string;
  submittedDate: string;
  assignedApprover: string;
  amountOrDays?: string;
  status: string;
  comments?: string;
}

export interface ApprovalSummary {
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  urgent_count: number;
  total_count: number;
  avg_turnaround: string;
}

export interface ApprovalActionInput {
  action: string;
  comments?: string;
}

/* ── Queries / Mutations ───────────────────────────────── */

export const approvalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApprovals: builder.query<
      ApiResponse<ApprovalItem[]>,
      { type?: string; status?: string; q?: string }
    >({
      query: ({ type, status, q } = {}) => {
        const params = new URLSearchParams();
        if (type) params.append("approval_type", type);
        if (status) params.append("approval_status", status);
        if (q) params.append("q", q);
        const qs = params.toString();
        return `/api/v1/approvals${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Approval"],
    }),

    getApprovalSummary: builder.query<ApiResponse<ApprovalSummary>, void>({
      query: () => "/api/v1/approvals/summary",
      providesTags: ["Approval"],
    }),

    updateApprovalStatus: builder.mutation<
      ApiResponse<ApprovalItem>,
      { approvalId: string; body: ApprovalActionInput }
    >({
      query: ({ approvalId, body }) => ({
        url: `/api/v1/approvals/${approvalId}/action`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Approval"],
    }),

    bulkApprovalAction: builder.mutation<
      ApiResponse<{ updated_count: number }>,
      ApprovalActionInput
    >({
      query: (body) => ({
        url: "/api/v1/approvals/bulk-action",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Approval"],
    }),
  }),
});

export const {
  useGetApprovalsQuery,
  useGetApprovalSummaryQuery,
  useUpdateApprovalStatusMutation,
  useBulkApprovalActionMutation,
} = approvalsApi;
