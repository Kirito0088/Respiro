"use client";

import { useState } from "react";
import { AppLogo } from "@/components/ui/app-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmogClock } from "@/components/smog-clock/smog-clock";
import { HackLab } from "@/components/hack-lab/hack-lab";
import { ImpactDashboard } from "@/components/impact/impact-dashboard";
import { CommunityShield } from "@/components/community/community-shield";
import { RoutineView } from "@/components/routine/routine-view";
import { generateDeterministicPlan } from "@/lib/ai/fallback-advisor";
import type { WizardData } from "@/components/wizard/onboarding-wizard";
import { Activity, Clock, RotateCcw, ShieldAlert, Users, Wind, Wrench } from "lucide-react";
import { toast } from "sonner";

interface DashboardViewProps {
  initialData?: WizardData;
  onReset?: () => void;
}

export function DashboardView({ initialData, onReset }: DashboardViewProps) {
  const [data] = useState<WizardData>(
    initialData || {
      name: "Sharma Family Household",
      city: "East Delhi (Anand Vihar Sector)",
      baseAQI: 395,
      dwellingType: "ground_floor_independent",
      vulnerabilities: ["infants", "asthmatics_respiratory"],
      purifierSetup: "diy_filters",
      commuteMode: "two_wheeler_unprotected",
      roomVolumeM3: 65,
    },
  );

  const [completedHackIds, setCompletedHackIds] = useState<string[]>([
    "corsi_rosenthal_box",
    "wet_microfiber_mopping",
  ]);

  const toggleHack = (id: string) => {
    if (completedHackIds.includes(id)) {
      setCompletedHackIds(completedHackIds.filter((h) => h !== id));
      toast.info("Hack unchecked from your active implementations.");
    } else {
      setCompletedHackIds([...completedHackIds, id]);
      toast.success("Hack marked as active! Your protection score increased.");
    }
  };

  // Generate deterministic plan based on current state
  const plan = generateDeterministicPlan({
    city: data.city,
    baseAQI: data.baseAQI,
    dwellingType: data.dwellingType,
    vulnerabilities: data.vulnerabilities,
    commuteMode: data.commuteMode,
    hasPurifier: data.purifierSetup !== "none" || completedHackIds.length > 0,
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <AppLogo />
            <Badge variant="outline" className="hidden sm:inline-flex gap-1 text-xs">
              <Wind className="size-3 text-primary" />
              <span>{data.city}</span>
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive border border-destructive/20">
              <ShieldAlert className="size-3.5" />
              <span>Base AQI: {data.baseAQI}</span>
            </div>

            {onReset && (
              <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs gap-1">
                <RotateCcw className="size-3" />
                <span className="hidden sm:inline">Change Household</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8">
        <Tabs defaultValue="clock" className="space-y-6">
          {/* Accessible Tabs Navigation */}
          <div className="border-b border-border/50 pb-2">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto h-auto gap-1 p-1 bg-muted/40">
              <TabsTrigger value="clock" className="gap-2 text-xs py-2">
                <Clock className="size-3.5" />
                <span>Smog Clock & Routines</span>
              </TabsTrigger>
              <TabsTrigger value="hacks" className="gap-2 text-xs py-2">
                <Wrench className="size-3.5" />
                <span>IAQ Hack Lab</span>
              </TabsTrigger>
              <TabsTrigger value="impact" className="gap-2 text-xs py-2">
                <Activity className="size-3.5" />
                <span>Direct Impact & Lungs</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="gap-2 text-xs py-2">
                <Users className="size-3.5" />
                <span>Community Shield</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Smog Clock & Daily Routine */}
          <TabsContent value="clock" className="space-y-6 focus-visible:outline-none">
            <SmogClock baseAQI={data.baseAQI} city={data.city} />
            <RoutineView
              routines={plan.dailyRoutines}
              headline={plan.headline}
              summary={plan.summary}
              vulnerabilityAlert={plan.primaryVulnerabilityAlert}
            />
          </TabsContent>

          {/* Tab 2: IAQ Hack Lab */}
          <TabsContent value="hacks" className="space-y-6 focus-visible:outline-none">
            <HackLab completedHackIds={completedHackIds} onToggleHack={toggleHack} />
          </TabsContent>

          {/* Tab 3: Direct Impact Dashboard */}
          <TabsContent value="impact" className="space-y-6 focus-visible:outline-none">
            <ImpactDashboard
              baseAQI={data.baseAQI}
              hasPurifier={data.purifierSetup !== "none" || completedHackIds.length > 0}
              completedHackCount={completedHackIds.length}
            />
          </TabsContent>

          {/* Tab 4: Community Smog Shield */}
          <TabsContent value="community" className="space-y-6 focus-visible:outline-none">
            <CommunityShield neighborhoodZone={data.city} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Respiro · PromptWars Virtual Challenge 6</p>
          <p>Engineered with Google Antigravity 2.0</p>
        </div>
      </footer>
    </div>
  );
}
