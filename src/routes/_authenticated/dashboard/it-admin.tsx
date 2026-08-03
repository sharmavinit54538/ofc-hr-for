import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuthStore } from "@/hooks/useAuthStore";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin")({
  head: () => ({
    meta: [
      { title: "OFC HR · IT Admin Suite" },
      {
        name: "description",
        content: "OFC HR IT Control Plane — identity directory, security operations, SSO/MFA, API keys & system health.",
      },
    ],
  }),
  component: ItAdminRouteWrapper,
});

function ItAdminRouteWrapper() {
  const role = useAuthStore((s) => s.role);

  // Role guard: redirect employees to employee portal if they try to access IT admin routes directly
  if (role && role === "EMPLOYEE") {
    return <Navigate to="/dashboard/employee" replace />;
  }

  return <Outlet />;
}
