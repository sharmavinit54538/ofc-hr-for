import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/compliance")({
  head: () => ({
    meta: [{ title: "OFC HR · Enterprise Compliance & Audit" }],
  }),
  component: () => <Outlet />,
});
