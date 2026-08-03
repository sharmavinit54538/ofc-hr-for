import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Save,
  Smartphone,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/settings/security")({
  component: SecuritySettingsPage,
});

function SecuritySettingsPage() {
  const [securityState, setSecurityState] = useState({
    mfaEnforced: true,
    mfaMethods: "TOTP Authenticator Apps (Google/Authy)",
    passwordPolicy: "Strict (Min 12 chars, numbers, symbols)",
    sessionTimeoutMinutes: "60",
    ipWhitelisting: "Active (2 Allowed IP Subnets)",
    singleSignOn: "SAML 2.0 / Okta Active",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security Policies Updated", {
      description: "MFA enforcement, SSO parameters, and session policies saved.",
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Security & MFA Policies"
        description="Enforce multi-factor authentication, IP whitelisting, session timeouts, and password parameters."
        breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }, { label: "Security & MFA" }]}
        backHref="/dashboard/settings"
        backLabel="Back to Settings"
        actions={
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Save className="size-4" /> Save Security Policies
          </button>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── MFA & Authentication Section ──────────────────────── */}
        <div className="glass-tile rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Multi-Factor Authentication (MFA)
              </h3>
              <p className="text-xs text-muted-foreground">
                Mandatory 2FA enforcement for all workforce members and admin roles.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/60 p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="size-5 text-primary" />
              <div>
                <h4 className="font-bold text-xs text-foreground">Enforce Mandatory 2FA / MFA</h4>
                <p className="text-[11px] text-muted-foreground">
                  Require all employees to configure TOTP / SMS 2FA upon first login.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setSecurityState({ ...securityState, mfaEnforced: !securityState.mfaEnforced })
              }
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition-colors ${
                securityState.mfaEnforced
                  ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {securityState.mfaEnforced ? "Strictly Enforced" : "Optional"}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Session Inactivity Timeout (Minutes)
              </label>
              <select
                value={securityState.sessionTimeoutMinutes}
                onChange={(e) => setSecurityState({ ...securityState, sessionTimeoutMinutes: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none cursor-pointer"
              >
                <option value="15" className="bg-card text-foreground">15 Minutes</option>
                <option value="30" className="bg-card text-foreground">30 Minutes</option>
                <option value="60" className="bg-card text-foreground">60 Minutes (Recommended)</option>
                <option value="120" className="bg-card text-foreground">120 Minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Single Sign-On (SSO) Protocol
              </label>
              <input
                type="text"
                value={securityState.singleSignOn}
                onChange={(e) => setSecurityState({ ...securityState, singleSignOn: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring"
              />
            </div>
          </div>
        </div>

        {/* ── Save Button ────────────────────────────────────────── */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Save className="size-4" /> Save Security Policies
          </button>
        </div>
      </form>
    </div>
  );
}
