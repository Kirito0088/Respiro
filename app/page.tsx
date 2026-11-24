import { AppLogo } from "@/components/ui/app-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ShieldAlert, Sparkles, Wind } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between p-6 sm:p-12 md:p-24 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      {/* Header */}
      <header className="z-10 flex w-full max-w-5xl items-center justify-between">
        <AppLogo />
        <Badge variant="outline" className="gap-1.5 px-3 py-1">
          <Sparkles className="size-3.5 text-primary" />
          <span>PromptWars Challenge 6</span>
        </Badge>
      </header>

      {/* Hero */}
      <main id="main" className="z-10 my-auto flex max-w-3xl flex-col items-center text-center">
        <Badge variant="secondary" className="mb-4 gap-1.5 py-1 px-3">
          <Wind className="size-3.5 text-primary" />
          <span>Winter Smog & Clean Air Copilot</span>
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Breathe cleaner. <span className="text-primary italic">Live lighter.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Respiro empowers families and neighborhoods to conquer severe winter smog with science-backed
          diurnal routines, low-cost indoor air quality hacks, sustainable lifestyle alternatives, and
          quantified lung protection metrics.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="gap-2">
            <span>Explore Demo Household</span>
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <ShieldAlert className="size-4" />
            <span>Diurnal Smog Clock</span>
          </Button>
          <Button variant="ghost" size="lg" className="gap-2">
            <Leaf className="size-4" />
            <span>IAQ Hack Lab</span>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 w-full max-w-5xl border-t border-border/40 pt-6 text-center text-sm text-muted-foreground sm:flex sm:justify-between sm:text-left">
        <p>© 2026 Respiro · PromptWars Virtual Challenge 6</p>
        <p>Built with Google Antigravity 2.0</p>
      </footer>
    </div>
  );
}
