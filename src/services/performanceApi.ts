import type { ApiResponse, ListParams, PaginatedData } from "@/types/api";
import { toQueryParams } from "@/types/api";
import { baseApi } from "@/services/api";
import type {
  ReviewCycle,
  ReviewCycleCreateInput,
  ReviewCycleUpdateInput,
  PerformanceReview,
  ReviewCreateInput,
  ReviewUpdateInput,
  Goal,
  GoalCreateInput,
  GoalUpdateInput,
  FeedbackItem,
  FeedbackCreateInput,
  FeedbackUpdateInput,
  CompetencyItem,
  CompetencyCreateInput,
  CompetencyUpdateInput,
  ImprovementPlanItem,
  ImprovementPlanCreateInput,
  ImprovementPlanUpdateInput,
  PerformanceDashboardData,
} from "@/types/performance";

export const performanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Dashboard ──────────────────────────────────────────────────
    getPerformanceDashboard: builder.query<ApiResponse<PerformanceDashboardData>, void>({
      query: () => "/api/v1/performance/dashboard",
      providesTags: [{ type: "Performance" as const, id: "DASHBOARD" }],
    }),

    // ── Review Cycles ─────────────────────────────────────────────
    listReviewCycles: builder.query<ApiResponse<PaginatedData<ReviewCycle>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/performance/review-cycles",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Performance" as const, id: `CYCLE_${id}` })),
              { type: "Performance" as const, id: "CYCLES_LIST" },
            ]
          : [{ type: "Performance" as const, id: "CYCLES_LIST" }],
    }),

    getReviewCycle: builder.query<ApiResponse<ReviewCycle>, string>({
      query: (id) => `/api/v1/performance/review-cycles/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Performance", id: `CYCLE_${id}` }],
    }),

    createReviewCycle: builder.mutation<ApiResponse<ReviewCycle>, ReviewCycleCreateInput>({
      query: (body) => ({
        url: "/api/v1/performance/review-cycles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Performance", id: "CYCLES_LIST" }, { type: "Performance", id: "DASHBOARD" }],
    }),

    updateReviewCycle: builder.mutation<ApiResponse<ReviewCycle>, { id: string; body: ReviewCycleUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/performance/review-cycles/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Performance", id: `CYCLE_${id}` },
        { type: "Performance", id: "CYCLES_LIST" },
        { type: "Performance", id: "DASHBOARD" },
      ],
    }),

    deleteReviewCycle: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/performance/review-cycles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Performance", id: "CYCLES_LIST" }, { type: "Performance", id: "DASHBOARD" }],
    }),

    // ── Performance Reviews ────────────────────────────────────────
    listReviews: builder.query<ApiResponse<PaginatedData<PerformanceReview>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/performance/reviews",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Performance" as const, id: `REVIEW_${id}` })),
              { type: "Performance" as const, id: "REVIEWS_LIST" },
            ]
          : [{ type: "Performance" as const, id: "REVIEWS_LIST" }],
    }),

    getReview: builder.query<ApiResponse<PerformanceReview>, string>({
      query: (id) => `/api/v1/performance/reviews/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Performance", id: `REVIEW_${id}` }],
    }),

    createReview: builder.mutation<ApiResponse<PerformanceReview>, ReviewCreateInput>({
      query: (body) => ({
        url: "/api/v1/performance/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Performance", id: "REVIEWS_LIST" }, { type: "Performance", id: "DASHBOARD" }],
    }),

    updateReview: builder.mutation<ApiResponse<PerformanceReview>, { id: string; body: ReviewUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/performance/reviews/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Performance", id: `REVIEW_${id}` },
        { type: "Performance", id: "REVIEWS_LIST" },
        { type: "Performance", id: "DASHBOARD" },
      ],
    }),

    submitReview: builder.mutation<ApiResponse<PerformanceReview>, string>({
      query: (id) => ({
        url: `/api/v1/performance/reviews/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Performance", id: `REVIEW_${id}` },
        { type: "Performance", id: "REVIEWS_LIST" },
        { type: "Performance", id: "DASHBOARD" },
      ],
    }),

    approveReview: builder.mutation<ApiResponse<PerformanceReview>, string>({
      query: (id) => ({
        url: `/api/v1/performance/reviews/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Performance", id: `REVIEW_${id}` },
        { type: "Performance", id: "REVIEWS_LIST" },
        { type: "Performance", id: "DASHBOARD" },
      ],
    }),

    rejectReview: builder.mutation<ApiResponse<PerformanceReview>, string>({
      query: (id) => ({
        url: `/api/v1/performance/reviews/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Performance", id: `REVIEW_${id}` },
        { type: "Performance", id: "REVIEWS_LIST" },
        { type: "Performance", id: "DASHBOARD" },
      ],
    }),

    deleteReview: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/performance/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Performance", id: "REVIEWS_LIST" }, { type: "Performance", id: "DASHBOARD" }],
    }),

    // ── Performance Goals / OKRs ───────────────────────────────────
    listGoals: builder.query<ApiResponse<PaginatedData<Goal>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/performance/goals",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Performance" as const, id: `GOAL_${id}` })),
              { type: "Performance" as const, id: "GOALS_LIST" },
            ]
          : [{ type: "Performance" as const, id: "GOALS_LIST" }],
    }),

    getGoal: builder.query<ApiResponse<Goal>, string>({
      query: (id) => `/api/v1/performance/goals/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Performance", id: `GOAL_${id}` }],
    }),

    createGoal: builder.mutation<ApiResponse<Goal>, GoalCreateInput>({
      query: (body) => ({
        url: "/api/v1/performance/goals",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Performance", id: "GOALS_LIST" }, { type: "Performance", id: "DASHBOARD" }],
    }),

    updateGoal: builder.mutation<ApiResponse<Goal>, { id: string; body: GoalUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/performance/goals/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Performance", id: `GOAL_${id}` },
        { type: "Performance", id: "GOALS_LIST" },
        { type: "Performance", id: "DASHBOARD" },
      ],
    }),

    deleteGoal: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/performance/goals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Performance", id: "GOALS_LIST" }, { type: "Performance", id: "DASHBOARD" }],
    }),

    // ── 360 Feedback ──────────────────────────────────────────────
    listFeedback: builder.query<ApiResponse<PaginatedData<FeedbackItem>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/performance/feedback",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Performance" as const, id: `FEEDBACK_${id}` })),
              { type: "Performance" as const, id: "FEEDBACK_LIST" },
            ]
          : [{ type: "Performance" as const, id: "FEEDBACK_LIST" }],
    }),

    createFeedback: builder.mutation<ApiResponse<FeedbackItem>, FeedbackCreateInput>({
      query: (body) => ({
        url: "/api/v1/performance/feedback",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Performance", id: "FEEDBACK_LIST" }],
    }),

    updateFeedback: builder.mutation<ApiResponse<FeedbackItem>, { id: string; body: FeedbackUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/performance/feedback/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Performance", id: `FEEDBACK_${id}` },
        { type: "Performance", id: "FEEDBACK_LIST" },
      ],
    }),

    deleteFeedback: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/performance/feedback/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Performance", id: "FEEDBACK_LIST" }],
    }),

    // ── Competencies & Skills ──────────────────────────────────────
    listCompetencies: builder.query<ApiResponse<PaginatedData<CompetencyItem>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/performance/competencies",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Performance" as const, id: `COMPETENCY_${id}` })),
              { type: "Performance" as const, id: "COMPETENCIES_LIST" },
            ]
          : [{ type: "Performance" as const, id: "COMPETENCIES_LIST" }],
    }),

    createCompetency: builder.mutation<ApiResponse<CompetencyItem>, CompetencyCreateInput>({
      query: (body) => ({
        url: "/api/v1/performance/competencies",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Performance", id: "COMPETENCIES_LIST" }],
    }),

    updateCompetency: builder.mutation<ApiResponse<CompetencyItem>, { id: string; body: CompetencyUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/performance/competencies/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Performance", id: `COMPETENCY_${id}` },
        { type: "Performance", id: "COMPETENCIES_LIST" },
      ],
    }),

    deleteCompetency: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/performance/competencies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Performance", id: "COMPETENCIES_LIST" }],
    }),

    // ── Improvement Plans ──────────────────────────────────────────
    listImprovementPlans: builder.query<ApiResponse<PaginatedData<ImprovementPlanItem>>, ListParams | void>({
      query: (params) => ({
        url: "/api/v1/performance/improvement-plans",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Performance" as const, id: `PIP_${id}` })),
              { type: "Performance" as const, id: "PIPS_LIST" },
            ]
          : [{ type: "Performance" as const, id: "PIPS_LIST" }],
    }),

    createImprovementPlan: builder.mutation<ApiResponse<ImprovementPlanItem>, ImprovementPlanCreateInput>({
      query: (body) => ({
        url: "/api/v1/performance/improvement-plans",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Performance", id: "PIPS_LIST" }],
    }),

    updateImprovementPlan: builder.mutation<ApiResponse<ImprovementPlanItem>, { id: string; body: ImprovementPlanUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/performance/improvement-plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Performance", id: `PIP_${id}` },
        { type: "Performance", id: "PIPS_LIST" },
      ],
    }),

    deleteImprovementPlan: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/performance/improvement-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Performance", id: "PIPS_LIST" }],
    }),

    // ── Export ─────────────────────────────────────────────────────
    exportPerformanceReport: builder.mutation<Blob, { format: "csv" | "excel" | "pdf" }>({
      query: ({ format }) => ({
        url: "/api/v1/performance/export",
        params: { format },
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPerformanceDashboardQuery,
  useListReviewCyclesQuery,
  useGetReviewCycleQuery,
  useCreateReviewCycleMutation,
  useUpdateReviewCycleMutation,
  useDeleteReviewCycleMutation,
  useListReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useSubmitReviewMutation,
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
  useListGoalsQuery,
  useGetGoalQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useListFeedbackQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
  useListCompetenciesQuery,
  useCreateCompetencyMutation,
  useUpdateCompetencyMutation,
  useDeleteCompetencyMutation,
  useListImprovementPlansQuery,
  useCreateImprovementPlanMutation,
  useUpdateImprovementPlanMutation,
  useDeleteImprovementPlanMutation,
  useExportPerformanceReportMutation,
} = performanceApi;
