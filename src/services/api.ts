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

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env["VITE_API_BASE_URL"] as string | undefined;
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    const currentHost = window.location.hostname;
    if (envUrl && (envUrl.includes("127.0.0.1") || envUrl.includes("localhost"))) {
      return envUrl.replace(/localhost|127\.0\.0\.1/, currentHost).replace(/\/$/, "");
    }
    if (!envUrl) {
      return `http://${currentHost}:8000`;
    }
  }
  return (envUrl || "http://127.0.0.1:8000").replace(/\/$/, "");
};

export const API_BASE_URL = getApiBaseUrl();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include", // required for httpOnly refresh-token cookies
  prepareHeaders: (headers, { getState, endpoint }) => {
    const reduxToken = (getState() as RootState).auth.accessToken;
    const windowToken =
      typeof window !== "undefined"
        ? (window as any).__ACCESS_TOKEN__ || localStorage.getItem("access_token")
        : null;
    const token = reduxToken || windowToken;

    // DO NOT send expired Bearer token on refresh or login endpoints
    if (token && endpoint !== "refresh" && endpoint !== "login") {
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("refresh_token");
      }
      return result;
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const storedRefreshToken =
          typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

        const refreshResult = await rawBaseQuery(
          {
            url: "/api/v1/auth/refresh",
            method: "POST",
            body: storedRefreshToken ? { refresh_token: storedRefreshToken } : {},
          },
          api,
          extraOptions,
        );

        const payload = refreshResult.data as
          | {
              data?: { access_token?: string; refresh_token?: string };
              access_token?: string;
              refresh_token?: string;
            }
          | undefined;
        const newAccessToken = payload?.data?.access_token ?? payload?.access_token ?? null;
        const newRefreshToken = payload?.data?.refresh_token ?? payload?.refresh_token ?? null;

        if (newAccessToken) {
          api.dispatch(setAccessToken(newAccessToken));
          if (newRefreshToken && typeof window !== "undefined") {
            localStorage.setItem("refresh_token", newRefreshToken);
          }
          onRefreshed(newAccessToken);
          result = await baseQueryWithUploads(args, api, extraOptions);
        } else {
          api.dispatch(logoutAuth());
          if (typeof window !== "undefined") {
            localStorage.removeItem("refresh_token");
          }
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
