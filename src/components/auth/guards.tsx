import { Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LoadingOverlay } from "@/components/common/loading-overlay";
import type { Permission, Role } from "@/lib/auth/types";
import { getLandingRoute, normalizeRole, getPermissions } from "@/lib/auth/roles";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppSelector } from "@/app/hooks";
import { selectAccessToken, selectIsInitializing } from "@/features/auth/authSlice";

export function LoadingGuard({
  children,
  label = "Verifying session authentication",
}: {
  children: ReactNode;
  label?: string;
}) {
  const reduxInitializing = useAppSelector(selectIsInitializing);
  const zustandLoading = useAuthStore((state) => state.isLoading);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || reduxInitializing || zustandLoading) {
    return <LoadingOverlay label={label} />;
  }
  return <>{children}</>;
}

export function UnauthorizedRedirect({ reason }: { reason?: string }) {
  return <Navigate to="/auth/unauthorized" replace />;
}

export function AuthGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const reduxToken = useAppSelector(selectAccessToken);
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return <LoadingOverlay label="Verifying server user claims..." />;
  }

  if (!isAuthenticated && !reduxToken && !user) {
    return <>{fallback ?? <Navigate to="/auth/login" replace />}</>;
  }

  return <>{children}</>;
}

export function RoleGuard({
  allow,
  children,
  fallback,
}: {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const storeRole = useAuthStore((state) => state.role);
  const storeUser = useAuthStore((state) => state.user);
  const role = normalizeRole(storeRole || storeUser?.role);

  if (!role) return <Navigate to="/auth/login" replace />;
  if (!allow.includes(role)) return <>{fallback ?? <UnauthorizedRedirect reason="role" />}</>;
  return <>{children}</>;
}

export function PermissionGuard({
  require: required,
  mode = "all",
  children,
  fallback,
}: {
  require: Permission[];
  mode?: "all" | "any";
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const storeRole = useAuthStore((state) => state.role);
  const storeUser = useAuthStore((state) => state.user);
  const role = normalizeRole(storeRole || storeUser?.role);
  const userPermissions = getPermissions(role);

  const granted =
    mode === "all"
      ? required.every((p) => userPermissions.includes(p))
      : required.some((p) => userPermissions.includes(p));

  if (!granted) return <>{fallback ?? <UnauthorizedRedirect reason="permission" />}</>;
  return <>{children}</>;
}

export function GuestGuard({ children }: { children: ReactNode }) {
  const reduxToken = useAppSelector(selectAccessToken);
  const { isAuthenticated, isLoading, role } = useAuthStore();

  if (isLoading) {
    return <LoadingGuard><div>{children}</div></LoadingGuard>;
  }

  if (isAuthenticated || Boolean(reduxToken)) {
    const landingRoute = getLandingRoute(role || undefined);
    return <Navigate to={landingRoute} replace />;
  }

  return <>{children}</>;
}

export function ProtectedRoute({
  children,
  roles,
  permissions,
  permissionMode = "all",
}: {
  children: ReactNode;
  roles?: Role[];
  permissions?: Permission[];
  permissionMode?: "all" | "any";
}) {
  return (
    <LoadingGuard>
      <AuthGuard>
        {roles ? (
          <RoleGuard allow={roles}>
            {permissions ? (
              <PermissionGuard require={permissions} mode={permissionMode}>
                {children}
              </PermissionGuard>
            ) : (
              children
            )}
          </RoleGuard>
        ) : permissions ? (
          <PermissionGuard require={permissions} mode={permissionMode}>
            {children}
          </PermissionGuard>
        ) : (
          children
        )}
      </AuthGuard>
    </LoadingGuard>
  );
}
