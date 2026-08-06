import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/payroll")({
  head: () => ({
    meta: [{ title: "OFC HR · Global Payroll & Compensation" }],
  }),
  component: () => <Outlet />,
});
