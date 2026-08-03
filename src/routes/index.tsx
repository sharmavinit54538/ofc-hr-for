import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, ShieldCheck, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OFC HR · Enterprise AI Workforce Platform" },
      {
        name: "description",
        content:
          "OFC HR unifies people operations, workforce planning and AI agents in one enterprise workspace.",
      },
      { property: "og:title", content: "OFC HR · Enterprise AI Workforce Platform" },
      {
        property: "og:description",
        content: "One intelligent workspace for consolidated enterprise people operations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold">
            OFC
          </div>
          <span className="font-display text-lg font-semibold">HR</span>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link to="/auth/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/auth/register">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
            <ShieldCheck className="size-3.5" />
            Enterprise ready
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
            One workspace for every people function.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            OFC HR consolidates HR, IT, finance, facilities and compliance into a single,
            AI-assisted platform built for modern enterprises.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link to="/auth/register">
                Create your workspace
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth/login">Sign in to an existing workspace</Link>
            </Button>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <Users2 className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">People operations</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Unified employee records, org chart and lifecycle management.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <Building2 className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">Workforce planning</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Headcount, skills and capacity planning across departments.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <ShieldCheck className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">Compliance first</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Enterprise security, audit logs and role-based access control.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
