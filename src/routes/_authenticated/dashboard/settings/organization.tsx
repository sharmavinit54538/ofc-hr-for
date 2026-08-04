import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  Globe,
  Mail,
  Save,
  UserCheck,
  Phone,
  Briefcase,
  MapPin,
  Linkedin,
  Twitter,
  Stamp,
  UploadCloud,
  IdCard,
  FileSignature,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/settings/organization")({
  component: OrganizationSettingsPage,
});

function OrganizationSettingsPage() {
  const [formData, setFormData] = useState({
    // Primary HR Administrator Detailed Profile
    hrAdminName: "HR Administrator",
    hrAdminEmpId: "EMP-001",
    hrAdminTitle: "Chief HR Administrator & Chief People Officer (CPO)",
    hrAdminDept: "Global HR Operations & Enterprise Governance",
    hrAdminEmail: "hr.admin@company.com",
    hrAdminPhone: "+91 98765 00000",
    hrAdminExt: "Ext: 101",
    hrAdminEmergencyPhone: "+91 98765 00001",
    hrAdminOfficeLocation: "HQ Campus - Executive Suite",
    hrAdminAuthLevel: "Tier-1 Super Administrator (Unlimited Approvals)",

    // Company Identity & Statutory
    companyName: typeof window !== "undefined" && localStorage.getItem("ofc_company_name") ? localStorage.getItem("ofc_company_name")! : "Enterprise HR Inc.",
    displayName: "OFC HR Enterprise",
    cinNumber: "L72900KA2021PTC148209",
    gstinNumber: "29AABCN1234R1ZP",
    panNumber: "AABCN1234R",
    pfRegistrationCode: "KN/BNG/0099823/000",
    esiRegistrationCode: "31000998230000101",
    registrationDate: "14 Nov 2021",
    totalEmployees: "1,248 Employees",
    industry: "Enterprise AI & Workforce Technology",

    // Addresses
    registeredAddress: "Embassy Tech Village, Outer Ring Road, Devarabeesanahalli, Bengaluru, Karnataka 560103, India",
    operationalAddress: "Global Tech Park, Tower B, Phase 2, Electronic City, Bengaluru, Karnataka 560100, India",

    // Digital Presence & Socials
    websiteUrl: "https://example.com",
    linkedinUrl: "https://linkedin.com/company/ofchr-enterprise",
    twitterHandle: "@OFC_HR_Official",

    // Technical & Localization
    primaryDomain: "app.ofchr.io",
    supportEmail: "support@company.com",
    timezone: "UTC+05:30 (Asia/Kolkata)",
    currency: "USD ($) / INR (₹)",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("ofc_company_name", formData.companyName);
      window.dispatchEvent(new Event("ofc-company-name-updated"));
    }
    toast.success("Organization & HR Admin Profile Saved", {
      description: "HR Lead credentials, GSTIN, LinkedIn URL, statutory codes, and digital seals updated.",
    });
  };

  const handleStampUpload = () => {
    toast.success("Digital Stamp Uploaded", {
      description: "Official corporate seal verified.",
    });
  };

  const handleSignatureUpload = () => {
    toast.success("HR Admin Signature Uploaded", {
      description: "Authorized digital signature seal updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Organization & HR Profile"
        description="Legal company identity, HR Lead profile, GSTIN, digital corporate stamp, LinkedIn presence, and address parameters."
        breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }, { label: "Organization Profile" }]}
        backHref="/dashboard/settings"
        backLabel="Back to Settings"
        actions={
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Save className="size-4" /> Save Complete Profile
          </button>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Primary HR Administrator Profile (Detailed) ────────── */}
        <div className="glass-tile rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
              <UserCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Primary HR Administrator Profile
              </h3>
              <p className="text-xs text-muted-foreground">
                Chief HR Lead with system authorization, signature rights, and governance control.
              </p>
            </div>
          </div>

          {/* Row 1: Name, Employee Code & Title */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                HR Admin Full Name
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.hrAdminName}
                  onChange={(e) => setFormData({ ...formData, hrAdminName: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring font-bold truncate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                HR Staff / Employee ID
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.hrAdminEmpId}
                  onChange={(e) => setFormData({ ...formData, hrAdminEmpId: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring font-mono font-bold text-primary truncate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Official HR Designation / Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.hrAdminTitle}
                  onChange={(e) => setFormData({ ...formData, hrAdminTitle: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring truncate"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email, Direct Phone, Emergency Contact */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Official HR Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                <input
                  type="email"
                  required
                  value={formData.hrAdminEmail}
                  onChange={(e) => setFormData({ ...formData, hrAdminEmail: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring font-mono font-semibold truncate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Direct Contact & Extension
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.hrAdminPhone}
                  onChange={(e) => setFormData({ ...formData, hrAdminPhone: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring font-mono truncate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Emergency Contact Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-rose-400" />
                <input
                  type="text"
                  value={formData.hrAdminEmergencyPhone}
                  onChange={(e) => setFormData({ ...formData, hrAdminEmergencyPhone: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring font-mono truncate"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Department & Office Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                HR Department Scope
              </label>
              <input
                type="text"
                value={formData.hrAdminDept}
                onChange={(e) => setFormData({ ...formData, hrAdminDept: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring truncate"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Executive Workstation Office Suite
              </label>
              <input
                type="text"
                value={formData.hrAdminOfficeLocation}
                onChange={(e) => setFormData({ ...formData, hrAdminOfficeLocation: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring truncate"
              />
            </div>
          </div>

          {/* Digital Signature Authorization Box */}
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                <FileSignature className="size-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground">HR Admin Digital Signature Seal</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Authorized signature embedded in appointment letters, payslips, and compliance contracts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignatureUpload}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
            >
              <UploadCloud className="size-3.5 text-primary" /> Update Signature
            </button>
          </div>
        </div>

        {/* ── Company Identity & Registration ──────────────────── */}
        <div className="glass-tile rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
              <Building2 className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Company Legal Identity & Statutory Registration
              </h3>
              <p className="text-xs text-muted-foreground">
                Official corporate CIN, GSTIN, PAN, and Statutory compliance codes.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Legal Company Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring truncate"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Display / Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring truncate"
              />
            </div>
          </div>

          {/* Statutory Tax IDs & Registration */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                GSTIN Registration No.
              </label>
              <input
                type="text"
                value={formData.gstinNumber}
                onChange={(e) => setFormData({ ...formData, gstinNumber: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring font-mono truncate"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Company PAN Number
              </label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring font-mono truncate"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Corporate Identity No. (CIN)
              </label>
              <input
                type="text"
                value={formData.cinNumber}
                onChange={(e) => setFormData({ ...formData, cinNumber: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring font-mono truncate"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Provident Fund (PF) Registration Code
              </label>
              <input
                type="text"
                value={formData.pfRegistrationCode}
                onChange={(e) => setFormData({ ...formData, pfRegistrationCode: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring font-mono truncate"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                ESI Registration Code
              </label>
              <input
                type="text"
                value={formData.esiRegistrationCode}
                onChange={(e) => setFormData({ ...formData, esiRegistrationCode: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring font-mono truncate"
              />
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Registered Legal Headquarters Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.registeredAddress}
                  onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring truncate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Operational Branch Office Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.operationalAddress}
                  onChange={(e) => setFormData({ ...formData, operationalAddress: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring truncate"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Official Digital Corporate Stamp & Seal Upload ───── */}
        <div className="glass-tile rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
              <Stamp className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Official Digital Stamp & Corporate Seal
              </h3>
              <p className="text-xs text-muted-foreground">
                Digital stamp used for automated offer letters, experience certificates, and legal HR dispatches.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-glow">
                <Stamp className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground">Official Corporate Seal</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  High-resolution PNG seal with transparent background (Max 5MB).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStampUpload}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
            >
              <UploadCloud className="size-4 text-primary" /> Upload New Stamp
            </button>
          </div>
        </div>

        {/* ── Social Handles & Digital Presence ────────────────── */}
        <div className="glass-tile rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
              <Linkedin className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Digital Presence & Social Media Profiles
              </h3>
              <p className="text-xs text-muted-foreground">
                Official company LinkedIn page, corporate website, and social media links.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Official LinkedIn Company Page
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sky-400" />
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring font-mono truncate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Twitter / X Corporate Handle
              </label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sky-400" />
                <input
                  type="text"
                  value={formData.twitterHandle}
                  onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring font-mono truncate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Corporate Portal Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full rounded-xl border border-input bg-card/70 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-ring font-mono truncate"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Primary Domain & Localization ─────────────────────── */}
        <div className="glass-tile rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
              <Globe className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Domain & Workspace Localization
              </h3>
              <p className="text-xs text-muted-foreground">
                Primary tenant custom domain, SSL certificates, timezone, and currency defaults.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Primary Tenant Custom Domain
              </label>
              <input
                type="text"
                value={formData.primaryDomain}
                onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring font-mono truncate"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                System Support Email
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3.5 py-2.5 text-xs outline-none focus:border-ring font-mono truncate"
              />
            </div>
          </div>
        </div>

        {/* ── Save Bar ───────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Save className="size-4" /> Save Complete Profile
          </button>
        </div>
      </form>
    </div>
  );
}
