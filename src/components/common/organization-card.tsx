import { Building2, Globe, MapPin, Users2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Organization } from "@/lib/auth/types";

export function OrganizationCard({
  organization,
  className,
  compact = false,
}: {
  organization: Organization;
  className?: string;
  compact?: boolean;
}) {
  const rows = [
    { icon: Users2, label: "Company size", value: organization.size },
    { icon: Globe, label: "Website", value: organization.website },
    {
      icon: MapPin,
      label: "Headquarters",
      value: [organization.city, organization.state, organization.country]
        .filter(Boolean)
        .join(", "),
    },
    { icon: Clock, label: "Timezone", value: organization.timezone },
  ];

  return (
    <div className={cn("glass-soft rounded-2xl p-5", className)}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
          {organization.logoUrl ? (
            <img
              src={organization.logoUrl}
              alt={`${organization.name} logo`}
              className="size-full object-cover"
            />
          ) : (
            <Building2 className="size-5" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-bold">{organization.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {organization.industry} · {organization.plan} plan
          </p>
        </div>
      </div>

      {!compact && (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-2">
              <row.icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="truncate text-xs font-medium">{row.value || "—"}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
