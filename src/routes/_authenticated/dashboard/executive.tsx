import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuthStore } from "@/hooks/useAuthStore";

export const Route = createFileRoute("/_authenticated/dashboard/executive")({
  head: () => ({
    meta: [
      { title: "OFC HR · Executive Suite" },
      {
        name: "description",
        content: "OFC HR Executive Control Plane — strategic workforce intelligence, financial analytics & C-level telemetry.",
      },
    ],
  }),
  component: ExecutiveRouteWrapper,
});

function ExecutiveRouteWrapper() {
  const role = useAuthStore((s) => s.role);

  // Role guard: redirect employees to employee portal if they try to access executive routes directly
  if (role && role === "EMPLOYEE") {
    return <Navigate to="/dashboard/employee" replace />;
  }

  return <Outlet />;
}
