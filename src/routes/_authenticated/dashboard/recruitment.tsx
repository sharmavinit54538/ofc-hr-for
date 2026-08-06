import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment")({
  head: () => ({
    meta: [{ title: "OFC HR · Talent Acquisition & ATS" }],
  }),
  component: () => <Outlet />,
});
