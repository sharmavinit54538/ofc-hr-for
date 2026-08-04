import { baseApi } from "@/services/api";
import { setAccessToken, setUser, logoutAuth } from "@/features/auth/authSlice";
import type {
  OnboardingWorkflowItem,
  OnboardingWorkflowCreateInput,
  NewHireItem,
  NewHireCreateInput,
  NewHireUpdateInput,
  OnboardingDocumentItem,
  OnboardingDocumentCreateInput,
  OnboardingDocumentUpdateInput,
} from "@/types/onboarding";

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  organization_name: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserMeResponse {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: "HR_ADMIN" | "IT_ADMIN" | "EXECUTIVE" | "MANAGER" | "EMPLOYEE";
  is_email_verified?: boolean;
  sso_provider?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginData {
  access_token: string;
  token_type: string;
  expires_in: number;
  role: string;
  user_id: string;
  org_id: string;
}

export interface OnboardingDataResponse {
  current_step: number;
  completed: boolean;
  completed_at?: string;
  companyName?: string;
  logo?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  country?: string;
  timezone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  gstNumber?: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  termsAccepted?: boolean;
  dpaAccepted?: boolean;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<UserMeResponse>, RegisterRequest>({
      query: (body) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<ApiResponse<LoginData>, LoginRequest>({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.data?.access_token || (data as unknown as LoginData).access_token;
          const refreshToken = (data.data as any)?.refresh_token || (data as any)?.refresh_token;
          if (token) {
            dispatch(setAccessToken(token));
          }
          if (refreshToken && typeof window !== "undefined") {
            localStorage.setItem("refresh_token", refreshToken);
          }
        } catch {
          // Handled in component
        }
      },
    }),

    refresh: builder.mutation<ApiResponse<{ access_token: string; refresh_token?: string }>, { refresh_token?: string } | void>({
      query: (body) => {
        const fallbackToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
        const payload = body?.refresh_token ? body : fallbackToken ? { refresh_token: fallbackToken } : {};
        return {
          url: "/api/v1/auth/refresh",
          method: "POST",
          body: payload,
        };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.data?.access_token || (data as unknown as { access_token: string }).access_token;
          const newRefreshToken = data.data?.refresh_token || (data as unknown as { refresh_token?: string }).refresh_token;
          if (token) {
            dispatch(setAccessToken(token));
          }
          if (newRefreshToken && typeof window !== "undefined") {
            localStorage.setItem("refresh_token", newRefreshToken);
          }
        } catch {
          dispatch(logoutAuth());
          if (typeof window !== "undefined") {
            localStorage.removeItem("refresh_token");
          }
        }
      },
    }),

    logout: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logoutAuth());
          if (typeof window !== "undefined") {
            localStorage.removeItem("refresh_token");
          }
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),


    getMe: builder.query<ApiResponse<UserMeResponse>, void>({
      query: () => "/api/v1/users/me",
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(setUser(data.data));
          }
        } catch {
          // Handled elsewhere
        }
      },
    }),

    listOrganizationUsers: builder.query<
      ApiResponse<UserMeResponse[]>,
      { skip?: number; limit?: number } | void
    >({
      query: (params) => {
        if (params && (params.skip !== undefined || params.limit !== undefined)) {
          return {
            url: "/api/v1/users",
            params: { skip: params.skip ?? 0, limit: params.limit ?? 100 },
          };
        }
        return "/api/v1/users";
      },
      providesTags: ["User"],
    }),

    forgotPassword: builder.mutation<ApiResponse<{ message: string; reset_token?: string }>, { email: string }>({
      query: (body) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<ApiResponse<{ message: string }>, { token: string; password: string }>({
      query: (body) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    getOnboardingStatus: builder.query<
      ApiResponse<{ completed: boolean; current_step: number; total_steps: number }>,
      void
    >({
      query: () => "/api/v1/hr-admin/onboarding/status",
      providesTags: ["User"],
    }),

    getOnboardingData: builder.query<ApiResponse<OnboardingDataResponse>, void>({
      query: () => "/api/v1/hr-admin/onboarding",
      providesTags: ["User"],
    }),

    saveOnboardingStep: builder.mutation<
      ApiResponse<OnboardingDataResponse>,
      { step: number; data: Record<string, any> }
    >({
      query: ({ step, data }) => ({
        url: `/api/v1/hr-admin/onboarding/step/${step}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    completeOnboarding: builder.mutation<ApiResponse<OnboardingDataResponse>, void>({
      query: () => ({
        url: "/api/v1/hr-admin/onboarding/complete",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),



    createOrganizationUser: builder.mutation<
      ApiResponse<UserMeResponse>,
      { email: string; password: string; full_name: string; role?: string }
    >({
      query: (body) => ({
        url: "/api/v1/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // ── Onboarding Workflows ────────────────────────────────────────────────
    listOnboardingWorkflows: builder.query<ApiResponse<OnboardingWorkflowItem[]>, void>({
      query: () => "/api/v1/hr-admin/onboarding/workflows",
      providesTags: [{ type: "Onboarding" as const, id: "WORKFLOWS_LIST" }],
    }),

    createOnboardingWorkflow: builder.mutation<ApiResponse<OnboardingWorkflowItem>, OnboardingWorkflowCreateInput>({
      query: (body) => ({
        url: "/api/v1/hr-admin/onboarding/workflows",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Onboarding" as const, id: "WORKFLOWS_LIST" }],
    }),

    deleteOnboardingWorkflow: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/hr-admin/onboarding/workflows/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Onboarding" as const, id: "WORKFLOWS_LIST" }],
    }),

    // ── Incoming New Hires ──────────────────────────────────────────────────
    listNewHires: builder.query<ApiResponse<NewHireItem[]>, { search?: string } | void>({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params && params["search"]) queryParams["search"] = params["search"];
        return {
          url: "/api/v1/hr-admin/onboarding/new-hires",
          params: queryParams,
        };
      },
      providesTags: [{ type: "Onboarding" as const, id: "NEW_HIRES_LIST" }],
    }),

    createNewHire: builder.mutation<ApiResponse<NewHireItem>, NewHireCreateInput>({
      query: (body) => ({
        url: "/api/v1/hr-admin/onboarding/new-hires",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Onboarding" as const, id: "NEW_HIRES_LIST" }],
    }),

    updateNewHireStatus: builder.mutation<ApiResponse<NewHireItem>, { id: string; body: NewHireUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/hr-admin/onboarding/new-hires/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Onboarding" as const, id: "NEW_HIRES_LIST" }],
    }),

    deleteNewHire: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/hr-admin/onboarding/new-hires/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Onboarding" as const, id: "NEW_HIRES_LIST" }],
    }),

    // ── Document Verification Vault ─────────────────────────────────────────
    listOnboardingDocuments: builder.query<ApiResponse<OnboardingDocumentItem[]>, { status?: string; search?: string } | void>({
      query: (params) => {
        const queryParams: Record<string, any> = {};
        if (params && params["status"]) queryParams["status"] = params["status"];
        if (params && params["search"]) queryParams["search"] = params["search"];
        return {
          url: "/api/v1/hr-admin/onboarding/documents",
          params: queryParams,
        };
      },
      providesTags: [{ type: "Onboarding" as const, id: "DOCUMENTS_LIST" }],
    }),

    createOnboardingDocument: builder.mutation<ApiResponse<OnboardingDocumentItem>, OnboardingDocumentCreateInput>({
      query: (body) => ({
        url: "/api/v1/hr-admin/onboarding/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Onboarding" as const, id: "DOCUMENTS_LIST" }],
    }),

    updateOnboardingDocumentStatus: builder.mutation<ApiResponse<OnboardingDocumentItem>, { id: string; body: OnboardingDocumentUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/api/v1/hr-admin/onboarding/documents/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Onboarding" as const, id: "DOCUMENTS_LIST" }],
    }),

    deleteOnboardingDocument: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/api/v1/hr-admin/onboarding/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Onboarding" as const, id: "DOCUMENTS_LIST" }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useListOrganizationUsersQuery,
  useCreateOrganizationUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetOnboardingStatusQuery,
  useLazyGetOnboardingStatusQuery,
  useGetOnboardingDataQuery,
  useLazyGetOnboardingDataQuery,
  useSaveOnboardingStepMutation,
  useCompleteOnboardingMutation,
  useListOnboardingWorkflowsQuery,
  useCreateOnboardingWorkflowMutation,
  useDeleteOnboardingWorkflowMutation,
  useListNewHiresQuery,
  useCreateNewHireMutation,
  useUpdateNewHireStatusMutation,
  useDeleteNewHireMutation,
  useListOnboardingDocumentsQuery,
  useCreateOnboardingDocumentMutation,
  useUpdateOnboardingDocumentStatusMutation,
  useDeleteOnboardingDocumentMutation,
} = authApi;
