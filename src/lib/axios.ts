import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "@/services/api";

export const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Send and receive HttpOnly cookies
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Single-flight refresh token queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token?: string | null) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/** Helper to extract cookie by name if CSRF is needed */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Request Interceptor: Attach Bearer token and CSRF token if available
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach CSRF Token if present in cookies
    const csrfToken = getCookie("csrftoken") || getCookie("XSRF-TOKEN");
    if (csrfToken && config.headers) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // Attach in-memory Access Token if stored in localStorage / session
    if (typeof window !== "undefined" && config.headers) {
      const memoryToken = (window as any).__ACCESS_TOKEN__ || localStorage.getItem("access_token");
      if (memoryToken && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${memoryToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Single-flight 401 refresh token rotation
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/register");

    // Intercept 401 Unauthorized errors (excluding login/refresh endpoints)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken =
          typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

        const refreshResponse = await axiosInstance.post("/api/v1/auth/refresh", {
          refresh_token: storedRefreshToken || undefined,
        });

        const data = refreshResponse.data?.data || refreshResponse.data;
        const newAccessToken = data?.access_token;
        const newRefreshToken = data?.refresh_token;

        if (newAccessToken && typeof window !== "undefined") {
          (window as any).__ACCESS_TOKEN__ = newAccessToken;
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }
        }

        processQueue(null, newAccessToken);

        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);

        // Clear local credentials on refresh failure
        if (typeof window !== "undefined") {
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("access_token");
          delete (window as any).__ACCESS_TOKEN__;
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
