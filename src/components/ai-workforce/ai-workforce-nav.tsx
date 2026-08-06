import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, Bot, Zap, Brain, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    title: "Hub Overview",
    href: "/dashboard/ai-workforce",
    exact: true,
    icon: Sparkles,
    badge: "10 Domains",
  },
  {
    title: "AI Agents",
    href: "/dashboard/ai-workforce/agents",
    exact: false,
    icon: Bot,
    badge: "32 Modes",
  },
  {
    title: "Workflows",
    href: "/dashboard/ai-workforce/workflows",
    exact: false,
    icon: Zap,
    badge: "Active",
  },
  {
    title: "People Analytics AI",
    href: "/dashboard/ai-workforce/analytics",
    exact: false,
    icon: Brain,
    badge: "Predictive",
  },
  {
    title: "Smart Co-Pilots",
    href: "/dashboard/ai-workforce/copilots",
    exact: false,
    icon: Cpu,
    badge: "Interactive",
  },
];

export function AiWorkforceNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="border-b border-border/40 bg-card/40 backdrop-blur-md sticky top-0 z-20 mb-6 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8 py-2">
      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1" aria-label="AI Workforce Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href || pathname === `${item.href}/`
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 shrink-0",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("size-4 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{item.title}</span>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
