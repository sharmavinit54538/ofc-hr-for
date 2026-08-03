import { useState } from "react";
import { Building2, Check, MapPin, ShieldCheck, User } from "lucide-react";
import { LoadingButton } from "@/components/auth/loading-button";
import { RememberMe } from "@/components/auth/remember-me";
import { ValidationMessage } from "@/components/auth/validation-message";
import { RoleBadge } from "@/components/common/role-badge";
import type { RegistrationDraft } from "@/lib/auth/registration";

function Row({ label, value }: { label: string; value?: string | undefined }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 max-w-[60%] truncate text-right text-xs font-medium">
        {value && value.length > 0 ? value : "—"}
      </dd>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Building2;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-soft rounded-2xl p-4">
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
        <Icon className="size-3.5 text-primary" aria-hidden="true" />
        {title}
      </h3>
      <dl className="mt-2 divide-y divide-border/60">{children}</dl>
    </section>
  );
}

export function ReviewStep({
  draft,
  submitting,
  onSubmit,
  onBack,
}: {
  draft: RegistrationDraft;
  submitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [terms, setTerms] = useState(Boolean(draft.terms));
  const [dpa, setDpa] = useState(Boolean(draft.dataProcessing));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!terms || !dpa) {
      setError("Accept the enterprise terms and the data processing agreement to continue.");
      return;
    }
    setError(null);
    onSubmit();
  };

  return (
    <div className="space-y-5">
      <Section title="Organization" icon={Building2}>
        <Row label="Company" value={draft.companyName} />
        <Row label="Industry" value={draft.industry} />
        <Row label="Size" value={draft.companySize} />
        <Row label="Website" value={draft.website} />
        <Row label="Country" value={draft.country} />
        <Row label="Timezone" value={draft.timezone} />
      </Section>

      <Section title="Registered address" icon={MapPin}>
        <Row label="Address" value={draft.address} />
        <Row label="City" value={draft.city} />
        <Row label="State" value={draft.state} />
        <Row label="Zip code" value={draft.zipCode} />
        <Row label="GST number" value={draft.gstNumber} />
      </Section>

      <Section title="First HR administrator" icon={User}>
        <Row label="Full name" value={draft.fullName} />
        <Row label="Email" value={draft.email} />
        <Row label="Phone" value={draft.phone} />
        <div className="flex items-center justify-between gap-4 py-2">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Assigned role
          </dt>
          <dd>
            <RoleBadge role="HR_ADMIN" size="sm" />
          </dd>
        </div>
      </Section>

      <div className="glass-soft space-y-3 rounded-2xl p-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
          Agreements
        </p>
        <RememberMe
          checked={terms}
          onCheckedChange={setTerms}
          label="I accept the OFC HR enterprise terms of service"
        />
        <RememberMe
          checked={dpa}
          onCheckedChange={setDpa}
          label="I confirm the data processing agreement for our tenant"
        />
        <ValidationMessage message={error} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <LoadingButton type="button" variant="ghost" onClick={onBack} disabled={submitting}>
          Back
        </LoadingButton>
        <LoadingButton type="button" loading={submitting} onClick={handleSubmit}>
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" aria-hidden="true" /> Create workspace
          </span>
        </LoadingButton>
      </div>
    </div>
  );
}
