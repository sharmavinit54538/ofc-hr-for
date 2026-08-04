import type { ApiResponse } from "@/types/api";
import { baseApi } from "@/services/api";
import type {
  LeaveRequestItem,
  LeaveRequestCreateInput,
  LeaveRequestUpdateInput,
  LeaveStatsData,
  LeaveApprovalRuleItem,
  LeaveApprovalRuleCreateInput,
} from "@/types/leave";

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listLeaveRequests: builder.query<ApiResponse<LeaveRequestItem[]>, { status?: string; search?: string } | void>({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params && params["status"]) queryParams["status"] = params["status"];
        if (params && params["search"]) queryParams["search"] = params["search"];
        return {
          url: "/api/v1/leave/requests",
          params: queryParams,
        };
      },
      providesTags: [{ type: "Leave" as const, id: "REQUESTS_LIST" }],
    }),

    getLeaveStats: builder.query<ApiResponse<LeaveStatsData>, void>({
      query: () => "/api/v1/leave/stats",
      providesTags: [{ type: "Leave" as const, id: "STATS" }],
    }),

    createLeaveRequest: builder.mutation<ApiResponse<LeaveRequestItem>, LeaveRequestCreateInput>({
      query: (body) => ({
        url: "/api/v1/leave/requests",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Leave" as const, id: "REQUESTS_LIST" },
        { type: "Leave" as const, id: "STATS" },
      ],
    }),

    updateLeaveRequestStatus: builder.mutation<ApiResponse<LeaveRequestItem>, { id: string; body: LeaveRequestUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/leave/requests/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Leave" as const, id: "REQUESTS_LIST" },
        { type: "Leave" as const, id: "STATS" },
      ],
    }),

    deleteLeaveRequest: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/leave/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Leave" as const, id: "REQUESTS_LIST" },
        { type: "Leave" as const, id: "STATS" },
      ],
    }),

    // ── Approval Rules ─────────────────────────────────────────────────────
    listLeaveApprovalRules: builder.query<ApiResponse<LeaveApprovalRuleItem[]>, void>({
      query: () => "/api/v1/leave/approvals/rules",
      providesTags: [{ type: "Leave" as const, id: "RULES_LIST" }],
    }),

    createLeaveApprovalRule: builder.mutation<ApiResponse<LeaveApprovalRuleItem>, LeaveApprovalRuleCreateInput>({
      query: (body) => ({
        url: "/api/v1/leave/approvals/rules",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Leave" as const, id: "RULES_LIST" }],
    }),

    deleteLeaveApprovalRule: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/leave/approvals/rules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Leave" as const, id: "RULES_LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListLeaveRequestsQuery,
  useGetLeaveStatsQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestStatusMutation,
  useDeleteLeaveRequestMutation,
  useListLeaveApprovalRulesQuery,
  useCreateLeaveApprovalRuleMutation,
  useDeleteLeaveApprovalRuleMutation,
} = leaveApi;
