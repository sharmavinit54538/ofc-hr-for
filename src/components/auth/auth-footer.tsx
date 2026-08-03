export function AuthFooter() {
  return (
    <footer className="space-y-1 px-5 py-4 text-center">
      <nav
        aria-label="Legal"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] text-muted-foreground"
      >
        <span className="cursor-pointer transition-colors duration-200 hover:text-primary">
          Privacy
        </span>
        <span className="cursor-pointer transition-colors duration-200 hover:text-primary">
          Terms
        </span>
        <span className="cursor-pointer transition-colors duration-200 hover:text-primary">
          Security
        </span>
        <span className="cursor-pointer transition-colors duration-200 hover:text-primary">
          Status
        </span>
      </nav>
      <p className="text-[11px] leading-relaxed text-muted-foreground/80">
        © 2026 EquinoxSphere. All rights reserved.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground/70">
        Powered by OFC HR – Office Function Consolidator.
      </p>
    </footer>
  );
}
