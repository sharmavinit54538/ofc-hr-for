import { memo, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const PageHeader = memo(function PageHeader({
  title,
  description,
  breadcrumbs,
  backHref,
  backLabel,
  actions,
  badge,
}: {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div className="mb-6 space-y-3.5 md:mb-8">
      {/* ── Breadcrumbs & Back link ───────────────────────────────── */}
      {(breadcrumbs?.length || backHref) ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/dashboard" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Dashboard
              </Link>
              {breadcrumbs.map((crumb) => (
                <span key={crumb.label} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3 text-muted-foreground/60" aria-hidden="true" />
                  {crumb.href ? (
                    <Link to={crumb.href} className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-foreground">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {backHref && (
            <Link
              to={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {backLabel ?? "Back"}
            </Link>
          )}
        </div>
      ) : null}

      {/* ── Main Title Row ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl leading-snug py-1">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
});
