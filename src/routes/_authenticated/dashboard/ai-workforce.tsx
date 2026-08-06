import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AiWorkforceNav } from "@/components/ai-workforce/ai-workforce-nav";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce")({
  head: () => ({
    meta: [{ title: "OFC HR · AI Autonomous Agents" }],
  }),
  component: () => (
    <div className="flex flex-col min-h-full">
      <AiWorkforceNav />
      <Outlet />
    </div>
  ),
});
