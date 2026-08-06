import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/workforce")({
  head: () => ({
    meta: [{ title: "OFC HR · Workforce Directory" }],
  }),
  component: () => <Outlet />,
});
