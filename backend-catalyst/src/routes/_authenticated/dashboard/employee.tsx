import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuthStore } from "@/hooks/useAuthStore";

export const Route = createFileRoute("/_authenticated/dashboard/employee")({
  head: () => ({
    meta: [
      { title: "OFC HR · Employee Portal" },
      {
        name: "description",
        content: "OFC HR employee self-service portal — attendance, leave, payroll, documents and helpdesk.",
      },
    ],
  }),
  component: EmployeeRouteWrapper,
});

function EmployeeRouteWrapper() {
  const role = useAuthStore((s) => s.role);

  // Role guard: redirect non-employees to HR admin dashboard if they try to access employee routes directly
  if (role && role !== "EMPLOYEE") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
