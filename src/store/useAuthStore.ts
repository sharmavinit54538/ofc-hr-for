import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { normalizeRole, getPermissions } from "@/lib/auth/roles";
import type { Role, Permission } from "@/lib/auth/types";
import { store } from "@/app/store";
import { setAccessToken as reduxSetAccessToken, setUser as reduxSetUser, logoutAuth as reduxLogout } from "@/features/auth/authSlice";

export interface UserProfile {
  id: string;
  organization_id?: string;
  email: string;
  full_name: string;
  company_name?: string;
  role: Role;
  raw_role?: string;
  is_verified?: boolean;
  is_onboarding_completed?: boolean;
  sso_provider?: string;
  created_at?: string;
}

export interface AuthStoreState {
  user: UserProfile | null;
  company: string | null;
  role: Role | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  fetchMe: () => Promise<UserProfile | null>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  company: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

  setUser: (user) => {
    if (!user) {
      set({
        user: null,
        company: null,
        role: null,
        permissions: [],
        isAuthenticated: false,
      });
      store.dispatch(reduxSetUser(null));
      return;
    }

    const safeRole = normalizeRole(user.role || (user as any).raw_role);
    const perms = getPermissions(safeRole);
    const companyName = user.company_name || (user as any).organization_name || null;

    const normalizedUser: UserProfile = {
      ...user,
      role: safeRole,
      company_name: companyName || undefined,
    };

    set({
      user: normalizedUser,
      company: companyName,
      role: safeRole,
      permissions: perms,
      isAuthenticated: true,
    });

    store.dispatch(
      reduxSetUser({
        id: normalizedUser.id,
        organization_id: normalizedUser.organization_id || "",
        email: normalizedUser.email,
        full_name: normalizedUser.full_name,
        role: safeRole,
        is_verified: normalizedUser.is_verified ?? false,
        is_onboarding_completed: normalizedUser.is_onboarding_completed ?? false,
      })
    );
  },

  setAccessToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        (window as any).__ACCESS_TOKEN__ = token;
      } else {
        delete (window as any).__ACCESS_TOKEN__;
      }
    }
    store.dispatch(reduxSetAccessToken(token));
  },

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/api/v1/auth/login", { email, password });
      const payload = response.data?.data || response.data;
      const token = payload?.access_token || payload?.tokens?.access_token;
      const refreshToken = payload?.refresh_token || payload?.tokens?.refresh_token;

      if (token) {
        get().setAccessToken(token);
      }
      if (refreshToken && typeof window !== "undefined") {
        localStorage.setItem("refresh_token", refreshToken);
      }

      // Fetch full user profile
      const userProfile = await get().fetchMe();
      if (!userProfile) {
        throw new Error("Failed to load user profile after login");
      }

      set({ isLoading: false });
      return userProfile;
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Login failed";
      set({ error: msg, isLoading: false, isAuthenticated: false });
      throw err;
    }
  },

  fetchMe: async () => {
    try {
      let res;
      try {
        res = await axiosInstance.get("/api/v1/auth/me");
      } catch (err: any) {
        if (err?.response?.status === 404) {
          res = await axiosInstance.get("/api/v1/users/me");
        } else {
          throw err;
        }
      }
      const rawUser = res.data?.data || res.data;

      if (rawUser) {
        const safeRole = normalizeRole(rawUser.role);
        const userProfile: UserProfile = {
          id: rawUser.id || rawUser.user_id,
          organization_id: rawUser.organization_id || rawUser.org_id,
          email: rawUser.email,
          full_name: rawUser.full_name || `${rawUser.first_name || ""} ${rawUser.last_name || ""}`.trim() || rawUser.email,
          company_name: rawUser.company_name || rawUser.organization_name,
          role: safeRole,
          raw_role: rawUser.role,
          is_verified: rawUser.is_verified ?? true,
          is_onboarding_completed: rawUser.is_onboarding_completed ?? rawUser.onboarding_completed ?? false,
        };

        get().setUser(userProfile);
        set({ isLoading: false });
        return userProfile;
      }
      set({ isLoading: false });
      return null;
    } catch (err) {
      set({ isLoading: false });
      return null;
    }
  },

  refresh: async () => {
    try {
      const storedRefreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

      const res = await axiosInstance.post("/api/v1/auth/refresh", {
        refresh_token: storedRefreshToken || undefined,
      });

      const payload = res.data?.data || res.data;
      const newToken = payload?.access_token;
      const newRefreshToken = payload?.refresh_token;

      if (newToken) {
        get().setAccessToken(newToken);
        if (newRefreshToken && typeof window !== "undefined") {
          localStorage.setItem("refresh_token", newRefreshToken);
        }
        await get().fetchMe();
        return true;
      }
      return false;
    } catch {
      await get().logout();
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const storedRefreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

      await axiosInstance.post("/api/v1/auth/logout", {
        refresh_token: storedRefreshToken || undefined,
      });
    } catch {
      // Ignore logout errors
    } finally {
      get().setAccessToken(null);
      get().setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token");
        delete (window as any).__ACCESS_TOKEN__;
      }
      store.dispatch(reduxLogout());
      set({ isLoading: false, isAuthenticated: false, user: null, company: null, role: null, permissions: [] });
    }
  },
}));
