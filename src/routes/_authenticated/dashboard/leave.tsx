import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/leave")({
  head: () => ({
    meta: [{ title: "OFC HR · Leave & Absence Management" }],
  }),
  component: () => <Outlet />,
});
