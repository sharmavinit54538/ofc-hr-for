import {
  createApi,
  fetchBaseQuery,
  retry,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { setAccessToken, logoutAuth } from "@/features/auth/authSlice";

export const API_BASE_URL = (
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include", // required for httpOnly refresh-token cookies
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }
    return headers;
  },
});

/** Skips the JSON content-type header for multipart uploads. */
const baseQueryWithUploads: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => rawBaseQuery(args, api, extraOptions);

// Single-flight refresh: concurrent 401s wait for one refresh round-trip.
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQueryWithUploads(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const url = typeof args === "string" ? args : args.url;

    if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
      api.dispatch(logoutAuth());
      return result;
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResult = await rawBaseQuery(
          { url: "/api/v1/auth/refresh", method: "POST" },
          api,
          extraOptions,
        );

        const payload = refreshResult.data as
          | { data?: { access_token?: string }; access_token?: string }
          | undefined;
        const newAccessToken = payload?.data?.access_token ?? payload?.access_token ?? null;

        if (newAccessToken) {
          api.dispatch(setAccessToken(newAccessToken));
          onRefreshed(newAccessToken);
          result = await baseQueryWithUploads(args, api, extraOptions);
        } else {
          api.dispatch(logoutAuth());
          api.dispatch(baseApi.util.resetApiState());
          onRefreshed(null);
        }
      } finally {
        isRefreshing = false;
      }
    } else {
      const newToken = await new Promise<string | null>((resolve) => {
        subscribeTokenRefresh(resolve);
      });
      if (newToken) {
        result = await baseQueryWithUploads(args, api, extraOptions);
      }
    }
  }

  return result;
};

/** Network/5xx failures are retried; auth and validation errors are not. */
const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 2 });

export const API_TAGS = [
  "Auth",
  "User",
  "Profile",
  "Role",
  "Permission",
  "Company",
  "Workspace",
  "Department",
  "Employee",
  "Manager",
  "Executive",
  "Attendance",
  "Shift",
  "Overtime",
  "Geofence",
  "Leave",
  "Payroll",
  "Payslip",
  "Recruitment",
  "Job",
  "Candidate",
  "Interview",
  "Offer",
  "Performance",
  "Training",
  "Notification",
  "Setting",
  "Document",
  "Policy",
  "Asset",
  "AssetCategory",
  "AssetRequest",
  "AssetMaintenance",
  "AssetAudit",
  "Vendor",
  "Approval",
  "Report",
  "Analytics",
  "Communication",
  "Announcement",
  "Survey",
  "Engagement",
  "Helpdesk",
  "Compliance",
  "AuditLog",
  "ItAdmin",
  "Integration",
  "Backup",
  "Calendar",
  "Onboarding",
  "AiWorkforce",
] as const;

export type ApiTag = (typeof API_TAGS)[number];

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: API_TAGS,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 30,
  endpoints: () => ({}),
});
