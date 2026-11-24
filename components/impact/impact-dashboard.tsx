"use client";

import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  calculateAirProtectionScore,
  calculateCarbonSavingsKg,
  calculateCigarettesAvoided,
  calculatePM25AvoidedUg,
  type CommuteMode,
} from "@/lib/impact";
import { Activity, Cigarette, Leaf, ShieldCheck, Sparkles, Wind } from "lucide-react";

interface ImpactDashboardProps {
  baseAQI: number;
  hasPurifier: boolean;
  completedHackCount: number;
}

export function ImpactDashboard({ baseAQI, hasPurifier, completedHackCount }: ImpactDashboardProps) {
  const [outdoorAQI, setOutdoorAQI] = useState<number>(baseAQI || 350);
  const [hoursIndoors, setHoursIndoors] = useState<number>(14);
  const [commuteDistanceKm, setCommuteDistanceKm] = useState<number>(24);
  const [adoptedCommuteMode, setAdoptedCommuteMode] = useState<CommuteMode>("metro_rail");
  const aqiInputId = useId();
  const hoursInputId = useId();
  const distanceInputId = useId();

  // Effective indoor PM2.5 calculation based on mitigations
  // A clean household with active filtration achieves ~35-45 ug/m3 even at 350+ outdoor AQI
  const effectiveIndoorPM25 = hasPurifier || completedHackCount >= 1 ? 40 : 180;

  const pm25AvoidedUg = calculatePM25AvoidedUg({
    outdoorPM25: outdoorAQI,
    indoorPM25: effectiveIndoorPM25,
    hoursIndoors,
    activityLevel: "resting",
  });

  const cigarettesAvoided = calculateCigarettesAvoided(pm25AvoidedUg);
  const carbonSavingsKg = calculateCarbonSavingsKg(commuteDistanceKm, "solo_car_ice", adoptedCommuteMode);

  const protectionScore = calculateAirProtectionScore({
    hasAirPurifierOrCRBox: hasPurifier || completedHackCount >= 1,
    hasPositivePressureOrSealedWindows: completedHackCount >= 2,
    wearsN95DuringCommute: true,
    usesWetMopping: completedHackCount >= 1,
    followsDiurnalVentilationHours: true,
    hasAirPurifyingPlants: completedHackCount >= 3,
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Direct Health & Environmental Impact</h2>
              <Badge variant="outline" className="gap-1 border-primary/30 text-xs">
                <Sparkles className="size-3 text-primary" />
                <span>Deterministic Science Model</span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Every action is quantified in code (ADR 1). See how your routine and IAQ hacks protect your
              lungs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ProgressRing
              value={protectionScore / 100}
              size={54}
              stroke={5}
              label={`Air Protection Score: ${protectionScore}%`}
              tone={protectionScore >= 80 ? "sage" : "default"}
            >
              <span className="text-xs font-bold">{protectionScore}%</span>
            </ProgressRing>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-medium">Protection Score</div>
              <div className="text-sm font-bold text-foreground">
                {protectionScore >= 80
                  ? "Fortified Shield"
                  : protectionScore >= 50
                    ? "Moderate Defense"
                    : "Basic Defense"}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          {/* Card 1: PM2.5 Inhaled Mass Avoided */}
          <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Lung PM2.5 Prevented</span>
              <Wind className="size-4 text-primary" />
            </div>
            <div className="text-2xl font-black text-foreground tracking-tight">
              {pm25AvoidedUg.toLocaleString()}{" "}
              <span className="text-sm font-medium text-muted-foreground">µg</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Micrograms of toxic particulate stopped from reaching deep alveolar lung sacs today.
            </p>
          </div>

          {/* Card 2: Cigarette Equivalents Avoided */}
          <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Cigarettes Avoided</span>
              <Cigarette className="size-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              {cigarettesAvoided} <span className="text-sm font-medium text-muted-foreground">cigs/day</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Berkeley Earth epidemiological equivalence (22 µg/m³ 24h exposure ≈ 1 cigarette).
            </p>
          </div>

          {/* Card 3: Carbon Emissions Saved */}
          <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">CO₂ Footprint Saved</span>
              <Leaf className="size-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {carbonSavingsKg} <span className="text-sm font-medium text-muted-foreground">kg CO₂</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Tailpipe emissions avoided by switching commute to {adoptedCommuteMode.replace(/_/g, " ")}.
            </p>
          </div>

          {/* Card 4: Indoor Clean Air Quality Ratio */}
          <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Indoor vs Outdoor</span>
              <ShieldCheck className="size-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
              {effectiveIndoorPM25}{" "}
              <span className="text-sm font-medium text-muted-foreground">vs {outdoorAQI} µg</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              {Math.round(((outdoorAQI - effectiveIndoorPM25) / outdoorAQI) * 100)}% particulate barrier
              achieved indoors.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Activity className="size-4 text-primary" />
          <span>Interactive Exposure & Commute Simulator</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Adjust the variables to observe direct impact on lung particulate deposition and carbon savings in
          real time:
        </p>

        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
              <span>Outdoor AQI</span>
              <span className="font-bold text-foreground">{outdoorAQI}</span>
            </div>
            <label htmlFor={aqiInputId} className="sr-only">
              Outdoor AQI
            </label>
            <input
              id={aqiInputId}
              type="range"
              min={100}
              max={650}
              value={outdoorAQI}
              onChange={(e) => setOutdoorAQI(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
              <span>Hours Protected Indoors</span>
              <span className="font-bold text-foreground">{hoursIndoors} hrs</span>
            </div>
            <label htmlFor={hoursInputId} className="sr-only">
              Hours Spent Protected Indoors
            </label>
            <input
              id={hoursInputId}
              type="range"
              min={4}
              max={24}
              value={hoursIndoors}
              onChange={(e) => setHoursIndoors(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
              <span>Daily Commute</span>
              <span className="font-bold text-foreground">{commuteDistanceKm} km</span>
            </div>
            <label htmlFor={distanceInputId} className="sr-only">
              Daily Commute Distance
            </label>
            <input
              id={distanceInputId}
              type="range"
              min={2}
              max={80}
              value={commuteDistanceKm}
              onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
              <span>Alternative Transit</span>
            </div>
            <select
              value={adoptedCommuteMode}
              onChange={(e) => setAdoptedCommuteMode(e.target.value as CommuteMode)}
              className="w-full h-8 rounded-md border border-input bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="metro_rail">Electric Metro Rail</option>
              <option value="ev_transit">Shared EV Shuttle</option>
              <option value="carpool_ice">Carpool (3+ Riders)</option>
              <option value="bicycle_walk">Bicycle / Walking</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
