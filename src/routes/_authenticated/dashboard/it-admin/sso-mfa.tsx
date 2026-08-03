import { createFileRoute } from "@tanstack/react-router";
import { Globe, CheckCircle2, Shield } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_SSO_PROVIDERS } from "@/lib/it-admin/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/sso-mfa")({
  component: ItAdminSsoMfaPage,
});

function ItAdminSsoMfaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Single Sign-On (SSO) & Multi-Factor Auth (MFA)"
        description="Configure SAML 2.0 / OIDC identity federation and WebAuthn/TOTP MFA enforcement policies."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "SSO & MFA" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="space-y-3">
        {MOCK_SSO_PROVIDERS.map((sso) => (
          <div key={sso.id} className="glass-tile rounded-2xl p-5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
                <Globe className="size-4" />
              </div>
              <div>
                <p className="font-bold text-foreground">{sso.name}</p>
                <p className="text-muted-foreground">{sso.protocol} · {sso.usersCount} Active Users · Last synced {sso.lastSync}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="size-3.5" /> {sso.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
