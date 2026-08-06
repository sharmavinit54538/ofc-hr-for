import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding")({
  head: () => ({
    meta: [{ title: "OFC HR · Employee Onboarding" }],
  }),
  component: () => <Outlet />,
});
