import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuthStore } from "@/hooks/useAuthStore";

export const Route = createFileRoute("/_authenticated/dashboard/manager")({
  head: () => ({
    meta: [
      { title: "OFC HR · Manager Portal" },
      {
        name: "description",
        content: "OFC HR People Manager control plane — team management, approvals, performance & reports.",
      },
    ],
  }),
  component: ManagerRouteWrapper,
});

function ManagerRouteWrapper() {
  const role = useAuthStore((s) => s.role);

  // Role guard: redirect employees to employee portal if they try to access manager routes directly
  if (role && role === "EMPLOYEE") {
    return <Navigate to="/dashboard/employee" replace />;
  }

  return <Outlet />;
}
