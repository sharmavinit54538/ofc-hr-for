import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { store } from "@/app/store";
import { authApi } from "@/services/authApi";
import { setInitializing } from "@/features/auth/authSlice";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    let state = store.getState().auth;
    let authStore = useAuthStore.getState();

    // 1. If JWT access token is not in memory and app is initializing, attempt session restoration
    if ((!state.accessToken && !authStore.isAuthenticated) && (state.isInitializing || authStore.isLoading)) {
      try {
        let user = await authStore.fetchMe();
        if (!user) {
          const success = await authStore.refresh();
          if (success) {
            await authStore.fetchMe();
          }
        }
        state = store.getState().auth;
        authStore = useAuthStore.getState();
      } catch {
        // Refresh failed
      } finally {
        store.dispatch(setInitializing(false));
      }
    }

    const hasAuth = Boolean(state.accessToken) || authStore.isAuthenticated;

    // 2. Not authenticated → redirect to login
    if (!hasAuth) {
      throw redirect({ to: "/auth/login", search: { redirect: location.href } });
    }

    // 3. HR Admin Onboarding Guard
    const user = authStore.user || state.user;
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

    return { user };
  },
  component: () => <Outlet />,
});
