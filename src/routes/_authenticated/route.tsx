import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { store } from "@/app/store";
import { authApi } from "@/services/authApi";
import { setInitializing } from "@/features/auth/authSlice";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    let state = store.getState().auth;

    // 1. If JWT access token is not in memory and app is initializing, attempt session restoration
    if (!state.accessToken && state.isInitializing) {
      try {
        const storedRefreshToken =
          typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
        const refreshPromise = store.dispatch(
          authApi.endpoints.refresh.initiate(
            storedRefreshToken ? { refresh_token: storedRefreshToken } : undefined
          )
        );
        const refreshRes = await refreshPromise.unwrap();

        const newAccessToken =
          refreshRes?.data?.access_token || (refreshRes as any)?.access_token;

        if (newAccessToken) {
          const mePromise = store.dispatch(authApi.endpoints.getMe.initiate());
          await mePromise.unwrap();
          state = store.getState().auth;
        }
      } catch {
        // Refresh failed
      } finally {
        store.dispatch(setInitializing(false));
      }
    }


    // 2. Not authenticated → redirect to login
    if (!state.accessToken) {
      throw redirect({ to: "/auth/login", search: { redirect: location.href } });
    }

    // 3. HR Admin Onboarding Guard
    const user = state.user;
    if (user && user.role === "HR_ADMIN") {
      const isCompleted = Boolean(user.is_onboarding_completed);

      // Uncompleted HR Admin trying to access regular dashboard → redirect to onboarding
      if (!isCompleted && !location.pathname.startsWith("/auth/onboarding")) {
        throw redirect({ to: "/auth/onboarding" });
      }

      // Completed HR Admin trying to access onboarding -> redirect to dashboard
      if (isCompleted && location.pathname.startsWith("/auth/onboarding")) {
        throw redirect({ to: "/dashboard" });
      }
    }

    return { user: state.user };
  },
  component: () => <Outlet />,
});
