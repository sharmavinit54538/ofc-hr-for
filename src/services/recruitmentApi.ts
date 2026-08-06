import type { ApiResponse, ListParams, PaginatedData } from "@/types/api";
import { toQueryParams } from "@/types/api";
import { baseApi } from "@/services/api";
import type {
  Candidate,
  CandidateCreateInput,
  CandidateStage,
  CandidateUpdateInput,
  Interview,
  InterviewCreateInput,
  InterviewUpdateInput,
  Job,
  JobCreateInput,
  JobUpdateInput,
  Offer,
  OfferCreateInput,
  OfferStatus,
  OfferUpdateInput,
  RecruitmentReport,
} from "@/types/recruitment";

export interface RecruitmentListParams extends ListParams {
  search?: string | undefined;
  status?: string | undefined;
  department?: string | undefined;
  job_id?: string | undefined;
  candidate_id?: string | undefined;
}

export const recruitmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Jobs Endpoints ────────────────────────────────────────────────────────
    listJobs: builder.query<ApiResponse<PaginatedData<Job>>, RecruitmentListParams | void>({
      query: (params) => ({
        url: "/api/v1/recruitment/jobs",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Job" as const, id })),
              { type: "Job" as const, id: "LIST" },
            ]
          : [{ type: "Job" as const, id: "LIST" }],
    }),

    getJob: builder.query<ApiResponse<Job>, string>({
      query: (id) => `/api/v1/recruitment/jobs/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Job", id }],
    }),

    createJob: builder.mutation<ApiResponse<Job>, JobCreateInput>({
      query: (body) => ({ url: "/api/v1/recruitment/jobs", method: "POST", body }),
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),

    updateJob: builder.mutation<
      ApiResponse<Job>,
      { id: string; body: JobUpdateInput }
    >({
      query: ({ id, body }) => ({ url: `/api/v1/recruitment/jobs/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Job", id },
        { type: "Job", id: "LIST" },
      ],
    }),

    deleteJob: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({ url: `/api/v1/recruitment/jobs/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),

    archiveJob: builder.mutation<ApiResponse<Job>, string>({
      query: (id) => ({
        url: `/api/v1/recruitment/jobs/${id}`,
        method: "PATCH",
        body: { status: "Archived" },
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Job", id },
        { type: "Job", id: "LIST" },
      ],
    }),

    // ── Candidate Endpoints ───────────────────────────────────────────────────
    listCandidates: builder.query<ApiResponse<PaginatedData<Candidate>>, RecruitmentListParams | void>({
      query: (params) => ({
        url: "/api/v1/recruitment/candidates",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Candidate" as const, id })),
              { type: "Candidate" as const, id: "LIST" },
            ]
          : [{ type: "Candidate" as const, id: "LIST" }],
    }),

    getCandidate: builder.query<ApiResponse<Candidate>, string>({
      query: (id) => `/api/v1/recruitment/candidates/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Candidate", id }],
    }),

    createCandidate: builder.mutation<ApiResponse<Candidate>, CandidateCreateInput>({
      query: (body) => ({ url: "/api/v1/recruitment/candidates", method: "POST", body }),
      invalidatesTags: [{ type: "Candidate", id: "LIST" }],
    }),

    updateCandidate: builder.mutation<
      ApiResponse<Candidate>,
      { id: string; body: CandidateUpdateInput }
    >({
      query: ({ id, body }) => ({ url: `/api/v1/recruitment/candidates/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Candidate", id },
        { type: "Candidate", id: "LIST" },
      ],
    }),

    updateCandidateStage: builder.mutation<
      ApiResponse<Candidate>,
      { id: string; stage: CandidateStage }
    >({
      query: ({ id, stage }) => ({
        url: `/api/v1/recruitment/candidates/${id}`,
        method: "PATCH",
        body: { stage },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Candidate", id },
        { type: "Candidate", id: "LIST" },
      ],
    }),

    deleteCandidate: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({ url: `/api/v1/recruitment/candidates/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Candidate", id: "LIST" }],
    }),

    // ── Interview Endpoints ───────────────────────────────────────────────────
    listInterviews: builder.query<ApiResponse<PaginatedData<Interview>>, RecruitmentListParams | void>({
      query: (params) => ({
        url: "/api/v1/recruitment/interviews",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Interview" as const, id })),
              { type: "Interview" as const, id: "LIST" },
            ]
          : [{ type: "Interview" as const, id: "LIST" }],
    }),

    getInterview: builder.query<ApiResponse<Interview>, string>({
      query: (id) => `/api/v1/recruitment/interviews/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Interview", id }],
    }),

    createInterview: builder.mutation<ApiResponse<Interview>, InterviewCreateInput>({
      query: (body) => ({ url: "/api/v1/recruitment/interviews", method: "POST", body }),
      invalidatesTags: [{ type: "Interview", id: "LIST" }],
    }),

    updateInterview: builder.mutation<
      ApiResponse<Interview>,
      { id: string; body: InterviewUpdateInput }
    >({
      query: ({ id, body }) => ({ url: `/api/v1/recruitment/interviews/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Interview", id },
        { type: "Interview", id: "LIST" },
      ],
    }),

    deleteInterview: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({ url: `/api/v1/recruitment/interviews/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Interview", id: "LIST" }],
    }),

    // ── Offer Endpoints ───────────────────────────────────────────────────────
    listOffers: builder.query<ApiResponse<PaginatedData<Offer>>, RecruitmentListParams | void>({
      query: (params) => ({
        url: "/api/v1/recruitment/offers",
        params: toQueryParams(params ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Offer" as const, id })),
              { type: "Offer" as const, id: "LIST" },
            ]
          : [{ type: "Offer" as const, id: "LIST" }],
    }),

    getOffer: builder.query<ApiResponse<Offer>, string>({
      query: (id) => `/api/v1/recruitment/offers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Offer", id }],
    }),

    createOffer: builder.mutation<ApiResponse<Offer>, OfferCreateInput>({
      query: (body) => ({ url: "/api/v1/recruitment/offers", method: "POST", body }),
      invalidatesTags: [{ type: "Offer", id: "LIST" }],
    }),

    updateOffer: builder.mutation<
      ApiResponse<Offer>,
      { id: string; body: OfferUpdateInput }
    >({
      query: ({ id, body }) => ({ url: `/api/v1/recruitment/offers/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Offer", id },
        { type: "Offer", id: "LIST" },
      ],
    }),

    updateOfferStatus: builder.mutation<
      ApiResponse<Offer>,
      { id: string; status: OfferStatus }
    >({
      query: ({ id, status }) => ({
        url: `/api/v1/recruitment/offers/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Offer", id },
        { type: "Offer", id: "LIST" },
      ],
    }),

    deleteOffer: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({ url: `/api/v1/recruitment/offers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Offer", id: "LIST" }],
    }),

    // ── Export Endpoint ───────────────────────────────────────────────────────
    exportRecruitmentReport: builder.mutation<Blob, { format: "csv" | "excel" | "pdf" }>({
      query: ({ format }) => ({
        url: `/api/v1/recruitment/export`,
        params: { format },
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),

    // ── AI Job Description & Autofill Endpoints ──────────────────────────────
    generateJobDescription: builder.mutation<
      ApiResponse<string>,
      {
        title: string;
        department?: string | undefined;
        employment_type?: string | undefined;
        location?: string | undefined;
        skills?: string[] | undefined;
        experience?: string | undefined;
      }
    >({
      query: (body) => ({
        url: "/api/v1/recruitment/jobs/generate-description",
        method: "POST",
        body: {
          title: body.title,
          department: body.department || "Engineering",
          employment_type: body.employment_type || "Full-time",
          location: body.location || "Remote",
          skills: body.skills || [],
          experience: body.experience || undefined,
        },
      }),
    }),

    aiAutofillJob: builder.mutation<
      ApiResponse<{
        department: string;
        employment_type: string;
        location: string;
        work_mode: string;
        vacancies: number;
        skills: string[];
        description: string;
        responsibilities: string[];
        requirements: string[];
        benefits: string[];
      }>,
      {
        title: string;
        experience?: string | undefined;
        salary_min?: number | undefined;
        salary_max?: number | undefined;
        currency?: string | undefined;
      }
    >({
      query: (body) => ({
        url: "/api/v1/recruitment/jobs/ai-autofill",
        method: "POST",
        body,
      }),
    }),

    // ── Report / Dashboard Metrics Endpoint ───────────────────────────────────
    getRecruitmentReport: builder.query<ApiResponse<RecruitmentReport>, void>({
      query: () => "/api/v1/recruitment/dashboard",
      providesTags: [{ type: "Recruitment", id: "REPORT" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListJobsQuery,
  useGetJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useArchiveJobMutation,
  useListCandidatesQuery,
  useGetCandidateQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useUpdateCandidateStageMutation,
  useDeleteCandidateMutation,
  useListInterviewsQuery,
  useGetInterviewQuery,
  useCreateInterviewMutation,
  useUpdateInterviewMutation,
  useDeleteInterviewMutation,
  useListOffersQuery,
  useGetOfferQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useUpdateOfferStatusMutation,
  useDeleteOfferMutation,
  useExportRecruitmentReportMutation,
  useGenerateJobDescriptionMutation,
  useAiAutofillJobMutation,
  useGetRecruitmentReportQuery,
} = recruitmentApi;

// Hook aliases for backward compatibility with existing sub-module pages
export const useListJobOpeningsQuery = useListJobsQuery;
export const useCreateJobOpeningMutation = useCreateJobMutation;
export const useUpdateJobOpeningMutation = useUpdateJobMutation;
export const useDeleteJobOpeningMutation = useDeleteJobMutation;
export const useGetRecruitmentDashboardQuery = useGetRecruitmentReportQuery;
