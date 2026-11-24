"use client";

import { Badge } from "@/components/ui/badge";
import type { RoutineTimeSlot } from "@/lib/ai/copilot-schema";
import { AlertCircle, CheckCircle2, Clock, ShieldAlert, Sparkles, Wind } from "lucide-react";

interface RoutineViewProps {
  routines: RoutineTimeSlot[];
  headline?: string;
  summary?: string;
  vulnerabilityAlert?: string;
}

export function RoutineView({
  routines,
  headline = "Daily Adaptive Smog Routine",
  summary = "Synchronizing daily activities with diurnal thermal boundary layer movements to minimize toxic inhalation.",
  vulnerabilityAlert,
}: RoutineViewProps) {
  const getSafetyBadge = (tier: RoutineTimeSlot["airSafetyTier"]) => {
    switch (tier) {
      case "safe":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs"
          >
            <CheckCircle2 className="size-3" />
            <span>Optimal Window</span>
          </Badge>
        );
      case "caution":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-xs"
          >
            <Wind className="size-3" />
            <span>Caution</span>
          </Badge>
        );
      case "hazardous":
        return (
          <Badge variant="destructive" className="gap-1 text-xs">
            <ShieldAlert className="size-3" />
            <span>Hazardous Inversion</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">{headline}</h2>
          <Badge variant="outline" className="gap-1 text-xs">
            <Sparkles className="size-3 text-primary" />
            <span>Personalized Daily Schedule</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>

        {vulnerabilityAlert && (
          <div className="flex items-start gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-xs text-destructive border border-destructive/20 mt-3">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{vulnerabilityAlert}</div>
          </div>
        )}
      </div>

      {/* Routine Cards Grid */}
      <div className="grid gap-3">
        {routines.map((slot, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border/60 bg-card p-4 space-y-2 hover:border-primary/40 transition-colors shadow-xs"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                  <Clock className="size-3.5 text-primary" />
                  <span>{slot.timeSlot}</span>
                </span>
                <span className="text-sm font-semibold text-foreground">— {slot.activity}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {getSafetyBadge(slot.airSafetyTier)}
                <Badge variant="secondary" className="text-xs">
                  Purifier: {slot.indoorPurifierSetting.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline" className="text-xs font-semibold">
                  Mask: {slot.maskRecommendation === "none" ? "None" : slot.maskRecommendation.toUpperCase()}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pl-5 border-l-2 border-primary/20">
              {slot.actionTip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
