import { Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LoadingOverlay } from "@/components/common/loading-overlay";
import type { Permission, Role } from "@/lib/auth/types";
import { getLandingRoute } from "@/lib/auth/roles";
import { useAppSelector } from "@/app/hooks";
import { selectAccessToken, selectIsInitializing } from "@/features/auth/authSlice";
import { useGetMeQuery } from "@/services/authApi";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  HR_ADMIN: [
    "org:manage",
    "org:view",
    "people:manage",
    "people:view",
    "payroll:view",
    "security:view",
    "analytics:view",
    "team:manage",
    "self:view",
  ],
  IT_ADMIN: [
    "org:view",
    "people:view",
    "security:manage",
    "security:view",
    "devices:manage",
    "analytics:view",
    "self:view",
  ],
  EXECUTIVE: ["org:view", "people:view", "analytics:view", "self:view"],
  MANAGER: ["people:view", "team:manage", "self:view"],
  EMPLOYEE: ["self:view"],
};

export function LoadingGuard({
  children,
  label = "Verifying session authentication",
}: {
  children: ReactNode;
  label?: string;
}) {
  const isInitializing = useAppSelector(selectIsInitializing);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || isInitializing) return <LoadingOverlay label={label} />;
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
  const accessToken = useAppSelector(selectAccessToken);
  const { data: meData, isLoading, isError } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });

  if (!accessToken || isError) {
    return <>{fallback ?? <Navigate to="/auth/login" replace />}</>;
  }

  if (isLoading || !meData?.data) {
    return <LoadingOverlay label="Verifying server user claims..." />;
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
  const { data: meData } = useGetMeQuery();
  const role = meData?.data?.role;

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
  const { data: meData } = useGetMeQuery();
  const role = meData?.data?.role ?? "EMPLOYEE";
  const userPermissions = ROLE_PERMISSIONS[role] || [];

  const granted =
    mode === "all"
      ? required.every((p) => userPermissions.includes(p))
      : required.some((p) => userPermissions.includes(p));

  if (!granted) return <>{fallback ?? <UnauthorizedRedirect reason="permission" />}</>;
  return <>{children}</>;
}

export function GuestGuard({ children }: { children: ReactNode }) {
  const accessToken = useAppSelector(selectAccessToken);
  const { data: meData } = useGetMeQuery(undefined, { skip: !accessToken });
  const role = meData?.data?.role;

  return (
    <LoadingGuard>
      {accessToken && role ? (
        <Navigate to={getLandingRoute(role)} replace />
      ) : (
        children
      )}
    </LoadingGuard>
  );
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
