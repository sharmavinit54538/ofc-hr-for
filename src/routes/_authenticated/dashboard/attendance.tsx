import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/attendance")({
  head: () => ({
    meta: [{ title: "OFC HR · Time & Attendance Management" }],
  }),
  component: () => <Outlet />,
});
