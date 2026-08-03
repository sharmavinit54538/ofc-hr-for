import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { SubModuleItem } from "@/lib/admin-navigation";

export const ModuleCard = memo(function ModuleCard({ module }: { module: SubModuleItem }) {
  const Icon = module.icon;

  return (
    <Link
      to={module.href}
      className="glass-tile group relative flex h-full flex-col justify-between rounded-2xl p-4 sm:p-4.5 transition-all duration-300 hover-lift hover:border-primary/40 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
    >
      <div>
        {/* Top Header: Icon & Stats badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow transition-transform duration-300 group-hover:scale-105">
            <Icon className="size-5" />
          </div>
          {module.stats && (
            <span className="max-w-[130px] truncate inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              {module.stats}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="mt-3.5 space-y-1">
          <h3 className="font-display text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            {module.title}
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {module.description}
          </p>
        </div>
      </div>

      {/* Footer Action Link */}
      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs font-semibold text-primary">
        <span>Open Module</span>
        <div className="grid size-6 place-items-center rounded-lg bg-primary/10 transition-transform duration-200 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="size-3.5" />
        </div>
      </div>
    </Link>
  );
});
