import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/integrations/sso")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/integrations/sso"
      parentHref="/dashboard/integrations"
      parentLabel="Integrations"
      title="Identity Providers & Single Sign-On (SSO)"
      description="Okta Workforce Identity, Microsoft Entra ID (Azure AD), Google Workspace, and SAML 2.0 / OIDC integrations."
      items={[
        { id: "1", title: "Microsoft Entra ID (Azure AD)", subtitle: "SAML 2.0 Enterprise Application Connection", status: "Connected & Synced", date: "Last sync: 2 min ago", metric: "SCIM Provisioning" },
        { id: "2", title: "Okta Universal Directory", subtitle: "OIDC Single Sign-On Gateway", status: "Active Backup", date: "Last sync: 1 hour ago", metric: "SAML 2.0" },
      ]}
    />
  ),
});
