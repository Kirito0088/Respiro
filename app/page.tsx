"use client";

import { useState } from "react";
import { AppLogo } from "@/components/ui/app-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { OnboardingWizard, type WizardData } from "@/components/wizard/onboarding-wizard";
import { ArrowRight, Leaf, ShieldAlert, Sparkles, Users, Wind, Wrench } from "lucide-react";

export default function Home() {
  const [viewState, setViewState] = useState<"landing" | "wizard" | "dashboard">("landing");
  const [activeProfile, setActiveProfile] = useState<WizardData | undefined>();

  const handleStartDemo = () => {
    setActiveProfile({
      name: "Sharma Family Household",
      city: "East Delhi (Anand Vihar)",
      baseAQI: 395,
      dwellingType: "ground_floor_independent",
      vulnerabilities: ["infants", "asthmatics_respiratory"],
      purifierSetup: "diy_filters",
      commuteMode: "two_wheeler_unprotected",
      roomVolumeM3: 65,
    });
    setViewState("dashboard");
  };

  const handleWizardComplete = (data: WizardData) => {
    setActiveProfile(data);
    setViewState("dashboard");
  };

  if (viewState === "wizard") {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-12 flex flex-col justify-center">
        <div className="mb-6 mx-auto w-full max-w-2xl flex items-center justify-between">
          <AppLogo />
          <Badge variant="outline" className="text-xs">
            Assessment Wizard
          </Badge>
        </div>
        <OnboardingWizard onComplete={handleWizardComplete} onCancel={() => setViewState("landing")} />
      </div>
    );
  }

  if (viewState === "dashboard") {
    return <DashboardView initialData={activeProfile} onReset={() => setViewState("wizard")} />;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between p-6 sm:p-12 md:p-24 overflow-hidden bg-background text-foreground">
      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      {/* Header */}
      <header className="z-10 flex w-full max-w-5xl items-center justify-between">
        <AppLogo />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs">
            <Sparkles className="size-3.5 text-primary" />
            <span>PromptWars Challenge 6</span>
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main" className="z-10 my-auto flex max-w-3xl flex-col items-center text-center">
        <Badge variant="secondary" className="mb-4 gap-1.5 py-1 px-3 text-xs font-semibold">
          <Wind className="size-3.5 text-primary" />
          <span>Winter Smog & Urban Clean Air Copilot</span>
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Breathe cleaner. <span className="text-primary italic">Live lighter.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
          Respiro helps families and communities navigate severe winter smog and urban air pollution with
          science-backed diurnal routines, low-cost indoor air hacks, and transparently quantified lung
          protection metrics.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="gap-2 font-bold shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleStartDemo}
          >
            <span>Explore Demo Household</span>
            <ArrowRight className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="gap-2 font-semibold"
            onClick={() => setViewState("wizard")}
          >
            <Sparkles className="size-4 text-primary" />
            <span>Assess My Household</span>
          </Button>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-12 w-full text-left">
          <div className="rounded-xl border border-border/50 bg-card/60 p-3.5 space-y-1">
            <ShieldAlert className="size-4 text-destructive" />
            <div className="text-xs font-bold text-foreground">Diurnal Smog Clock</div>
            <div className="text-[11px] text-muted-foreground">
              Times safe windows with thermal inversion lifts.
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-3.5 space-y-1">
            <Wrench className="size-4 text-primary" />
            <div className="text-xs font-bold text-foreground">IAQ Hack Lab</div>
            <div className="text-[11px] text-muted-foreground">
              DIY Corsi-Rosenthal boxes, wet mopping & CADR math.
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-3.5 space-y-1">
            <Leaf className="size-4 text-emerald-500" />
            <div className="text-xs font-bold text-foreground">Direct Impact</div>
            <div className="text-[11px] text-muted-foreground">
              Quantifies µg of PM2.5 and CO2 saved in code.
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-3.5 space-y-1">
            <Users className="size-4 text-blue-500" />
            <div className="text-xs font-bold text-foreground">Community Shield</div>
            <div className="text-[11px] text-muted-foreground">
              Neighborhood pledges & bulk filter purchasing.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 w-full max-w-5xl border-t border-border/40 pt-6 text-center text-xs text-muted-foreground sm:flex sm:justify-between sm:text-left">
        <p>© 2026 Respiro · PromptWars Virtual Challenge 6</p>
        <p>Built with Google Antigravity 2.0</p>
      </footer>
    </div>
  );
}
