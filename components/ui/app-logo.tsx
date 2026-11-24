import { cn } from "cn";

/** Application brand logo and mark for Respiro. */
export function AppLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5 text-foreground font-semibold select-none", className)}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 shrink-0 text-primary">
        <defs>
          <linearGradient id="respiro-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--sage-strong, #56694f)" stopOpacity="0.75" />
          </linearGradient>
        </defs>
        {/* Soft protective breath orb */}
        <circle cx="16" cy="16" r="14" fill="currentColor" fillOpacity="0.12" />
        {/* Respiro dual-wave flow representing clean air and vitality */}
        <path
          d="M9 17.5C11 14 14 13.5 16 16C18 18.5 21 18 23 14.5"
          stroke="url(#respiro-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M11 21C13 18.5 15.5 18 17 20C18.5 22 21 21.5 22.5 18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.5"
          fill="none"
        />
        <circle cx="23" cy="11" r="2.5" fill="var(--marigold, #e6a23c)" />
      </svg>
      {!compact && <span className="text-xl font-bold tracking-tight">Respiro</span>}
      <span className="sr-only">Respiro</span>
    </span>
  );
}

export const FestaLogo = AppLogo;
