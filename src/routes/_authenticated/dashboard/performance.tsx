import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/performance")({
  head: () => ({
    meta: [{ title: "OFC HR · Performance & Goals" }],
  }),
  component: () => <Outlet />,
});
