import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce")({
  head: () => ({
    meta: [{ title: "OFC HR · AI Autonomous Agents" }],
  }),
  component: () => <Outlet />,
});
