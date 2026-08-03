import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectAccessToken,
  selectCurrentUser,
  selectUserRole,
  selectIsAuthenticated,
  selectIsInitializing,
} from "@/features/auth/authSlice";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} from "@/services/authApi";
import { getPermissions } from "@/lib/auth/roles";
import type { Permission, Role } from "@/lib/auth/types";

export function useAuth() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectUserRole) as Role | null;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitializing = useAppSelector(selectIsInitializing);

  // Fetch me query whenever authenticated and user isn't loaded
  const { isFetching: isFetchingMe } = useGetMeQuery(undefined, {
    skip: !isAuthenticated || Boolean(user),
  });

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const permissions = role ? getPermissions(role) : [];

  const hasRole = (targetRoles: Role | Role[]): boolean => {
    if (!role) return false;
    return Array.isArray(targetRoles) ? targetRoles.includes(role) : role === targetRoles;
  };

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  return {
    accessToken,
    user,
    role,
    permissions,
    isAuthenticated,
    isInitializing: isInitializing || isFetchingMe,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    hasRole,
    hasPermission,
  };
}
