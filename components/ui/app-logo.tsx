import { cn } from "cn";

/** Application brand logo and mark. */
export function AppLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground font-semibold", className)}>
      <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7 shrink-0 text-primary">
        <circle cx="11" cy="15" r="8" fill="currentColor" fillOpacity="0.2" />
        <circle cx="18" cy="11" r="6.5" fill="currentColor" fillOpacity="0.4" />
        <circle cx="18.5" cy="19.5" r="3" fill="currentColor" fillOpacity="0.8" />
      </svg>
      {!compact && <span className="text-xl font-bold tracking-tight">Challenge 6</span>}
      <span className="sr-only">PromptWars Challenge 6</span>
    </span>
  );
}

export const FestaLogo = AppLogo;
