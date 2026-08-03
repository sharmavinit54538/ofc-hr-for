import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/helpdesk")({
  head: () => ({
    meta: [
      { title: "OFC HR · Enterprise Helpdesk" },
      {
        name: "description",
        content: "OFC HR enterprise support & service desk management.",
      },
    ],
  }),
  component: () => <Outlet />,
});
