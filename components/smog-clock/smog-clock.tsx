"use client";

import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AQI_TIER_TABLE,
  calculateHourlyAQI,
  diurnalInversionFactor,
  getAQITier,
  getSafeVentilationWindows,
} from "@/lib/air-quality";
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, Sparkles, Wind } from "lucide-react";

interface SmogClockProps {
  baseAQI: number;
  city: string;
}

export function SmogClock({ baseAQI, city }: SmogClockProps) {
  const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
  const sliderId = useId();

  const hourlyAQI = calculateHourlyAQI(baseAQI, selectedHour);
  const tier = getAQITier(hourlyAQI);
  const tierInfo = AQI_TIER_TABLE[tier];
  const factor = diurnalInversionFactor(selectedHour);
  const ventilationWindows = getSafeVentilationWindows(baseAQI);
  const currentWindow = ventilationWindows.find(
    (w) => selectedHour >= w.hourStart && selectedHour < w.hourEnd,
  );

  const formatHour = (h: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}:00 ${period}`;
  };

  return (
    <div className="space-y-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Diurnal Smog Clock</h2>
            <Badge variant="outline" className="gap-1 border-primary/30 text-xs">
              <Sparkles className="size-3 text-primary" />
              <span>Thermal Inversion Model</span>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Atmospheric boundary layer compression for{" "}
            <span className="font-semibold text-foreground">{city}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase font-medium">Selected Hour</div>
            <div className="text-lg font-bold text-foreground">{formatHour(selectedHour)}</div>
          </div>
          <div
            className="flex h-12 w-16 flex-col items-center justify-center rounded-xl font-bold text-white shadow-sm"
            style={{ backgroundColor: tierInfo.color }}
          >
            <span className="text-xs opacity-90 leading-none">AQI</span>
            <span className="text-lg leading-tight">{hourlyAQI}</span>
          </div>
        </div>
      </div>

      {/* Interactive 24-Hour Timeline Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>00:00 (Midnight)</span>
          <span className="text-destructive font-semibold">07:00 (Peak Inversion Trap)</span>
          <span className="text-success font-semibold">13:00 (Solar Clearing Window)</span>
          <span>23:00</span>
        </div>

        <div className="grid grid-cols-24 gap-1 h-8 rounded-lg bg-muted/40 p-1">
          {Array.from({ length: 24 }).map((_, h) => {
            const aqi = calculateHourlyAQI(baseAQI, h);
            const t = getAQITier(aqi);
            const isSelected = selectedHour === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setSelectedHour(h)}
                className={`relative h-full w-full rounded transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  isSelected ? "ring-2 ring-primary scale-110 z-10 shadow-md" : "hover:opacity-90"
                }`}
                style={{ backgroundColor: AQI_TIER_TABLE[t].color }}
                title={`${formatHour(h)}: AQI ${aqi} (${AQI_TIER_TABLE[t].label})`}
              >
                <span className="sr-only">
                  {formatHour(h)}: AQI {aqi}
                </span>
              </button>
            );
          })}
        </div>

        {/* Hour Slider Control */}
        <div className="pt-2">
          <label htmlFor={sliderId} className="sr-only">
            Select hour of day
          </label>
          <input
            id={sliderId}
            type="range"
            min="0"
            max="23"
            value={selectedHour}
            onChange={(e) => setSelectedHour(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
      </div>

      {/* Atmospheric State Diagnosis */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-background/50 p-4 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            {factor >= 1.3 ? (
              <AlertTriangle className="size-4 text-destructive shrink-0" />
            ) : factor <= 0.8 ? (
              <CheckCircle2 className="size-4 text-success shrink-0" />
            ) : (
              <Wind className="size-4 text-warning shrink-0" />
            )}
            <span>Thermal Inversion Status ({factor}x baseline)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {factor >= 1.3
              ? "Severe ground-level cooling traps high particulate concentration in the human breathing zone. Outdoor exercise strictly discouraged."
              : factor <= 0.8
                ? "Solar radiation lifts the planetary boundary layer. Maximum atmospheric particulate dispersion of the day."
                : "Standard diurnal dispersion. Secondary traffic compression active during evening rush hours."}
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/50 p-4 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Clock className="size-4 text-primary shrink-0" />
            <span>Ventilation Window Guidance</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {currentWindow
              ? currentWindow.guidance
              : "Apertures should remain closed. Maintain indoor mechanical air filtration."}
          </p>
        </div>
      </div>

      {/* Quick Time Window Jumper Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
        <span className="text-xs text-muted-foreground font-medium">Quick Jumps:</span>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setSelectedHour(7)}>
          <ShieldAlert className="size-3 text-destructive mr-1" />
          Morning Inversion (07:00)
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setSelectedHour(13)}>
          <CheckCircle2 className="size-3 text-success mr-1" />
          Midday Clearing (13:00)
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setSelectedHour(20)}>
          <Wind className="size-3 text-warning mr-1" />
          Evening Compression (20:00)
        </Button>
      </div>
    </div>
  );
}
