import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/documents")({
  head: () => ({
    meta: [
      { title: "OFC HR · Enterprise Document Vault" },
      {
        name: "description",
        content: "Enterprise document management, offer letters, contracts, policies, certificates, and e-signatures.",
      },
    ],
  }),
  component: () => <Outlet />,
});
