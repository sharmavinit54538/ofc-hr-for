import { create } from "zustand";
import { store } from "@/app/store";
import { logoutAuth } from "@/features/auth/authSlice";
import { authApi } from "@/services/authApi";
import type { Role, Permission } from "@/lib/auth/types";
import { getPermissions } from "@/lib/auth/roles";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  permissions: Permission[];
  organizationId?: string;
  jobTitle?: string;
  department?: string;
  phone?: string;
  employeeId?: string;
  location?: string;
}

export interface Organization {
  id: string;
  name: string;
}

interface AuthStoreState {
  user: AuthUser | null;
  role: Role | null;
  permissions: Permission[];
  organization: Organization | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  signOut: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

function getStoredCompanyName(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("ofc_company_name");
    if (saved && saved.trim()) return saved.trim();
  }
  return "Northwind Industries";
}

function getDerivedState() {
  const reduxState = store.getState().auth;
  const rawUser = reduxState.user;

  const authUser: AuthUser | null = rawUser
    ? {
        id: rawUser.id,
        fullName: rawUser.full_name || rawUser.email,
        email: rawUser.email,
        role: rawUser.role,
        permissions: getPermissions(rawUser.role),
        organizationId: rawUser.organization_id,
      }
    : null;

  const companyName =
    (rawUser as any)?.company_name ||
    (rawUser as any)?.organization_name ||
    getStoredCompanyName();

  const organization: Organization | null = {
    id: rawUser?.organization_id || "default-org",
    name: companyName,
  };

  return {
    user: authUser,
    role: rawUser?.role || null,
    permissions: rawUser?.role ? getPermissions(rawUser.role) : [],
    organization,
    isAuthenticated: Boolean(reduxState.accessToken),
    isHydrated: !reduxState.isInitializing,
  };
}

export const useAuthStore = create<AuthStoreState>((set, get) => {
  store.subscribe(() => {
    set(getDerivedState());
  });

  if (typeof window !== "undefined") {
    window.addEventListener("ofc-company-name-updated", () => {
      set(getDerivedState());
    });
  }

  const initial = getDerivedState();

  return {
    ...initial,
    signOut: () => {
      store.dispatch(authApi.endpoints.logout.initiate());
      store.dispatch(logoutAuth());
    },
    hasRole: (roles: Role | Role[]) => {
      const current = get().role;
      if (!current) return false;
      return Array.isArray(roles) ? roles.includes(current) : current === roles;
    },
    hasPermission: (permission: Permission) => {
      return get().permissions.includes(permission);
    },
  };
});
