import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  head: () => ({
    meta: [{ title: "OFC HR · Platform Settings" }],
  }),
  component: () => <Outlet />,
});
