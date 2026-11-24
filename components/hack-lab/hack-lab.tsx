"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateRequiredCADR } from "@/lib/air-quality";
import { STANDARD_HACKS } from "@/lib/ai/fallback-advisor";
import type { HackCategory } from "@/lib/ai/copilot-schema";
import { Calculator, CheckCircle2, Filter, Wrench } from "lucide-react";
import { HackCard } from "./hack-card";

interface HackLabProps {
  completedHackIds: string[];
  onToggleHack?: (hackId: string) => void;
}

export function HackLab({ completedHackIds, onToggleHack }: HackLabProps) {
  const [selectedCategory, setSelectedCategory] = useState<HackCategory | "all">("all");
  const [roomLength, setRoomLength] = useState<number>(5);
  const [roomWidth, setRoomWidth] = useState<number>(4);
  const [roomHeight, setRoomHeight] = useState<number>(2.8);

  const roomVolumeM3 = Math.round(roomLength * roomWidth * roomHeight);
  const requiredCADR = calculateRequiredCADR(roomVolumeM3, 4.5);

  const filteredHacks =
    selectedCategory === "all"
      ? STANDARD_HACKS
      : STANDARD_HACKS.filter((h) => h.category === selectedCategory);

  const completedCount = completedHackIds.length;
  const totalCount = STANDARD_HACKS.length;

  return (
    <div className="space-y-6">
      {/* CADR Calculator & Hero Banner */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Indoor Air Quality (IAQ) Hack Lab</h2>
              <Badge variant="outline" className="gap-1 border-primary/30 text-xs">
                <Wrench className="size-3 text-primary" />
                <span>Science-Backed DIY</span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Low-cost, high-impact mechanical hacks to eliminate particulate smog from living spaces.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 border border-border/40">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="text-xs font-semibold">
              {completedCount} of {totalCount} Implemented
            </span>
          </div>
        </div>

        {/* Room CADR Sizing Tool */}
        <div className="rounded-xl border border-border/50 bg-background/60 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calculator className="size-4 text-primary" />
            <span>Room Clean Air Delivery Rate (CADR) Calculator</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Severe winter smog requires at least 4.5 Air Changes per Hour (ACH). Calculate the CADR needed for
            your room:
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 items-end">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Length (m)</label>
              <Input
                type="number"
                min={1}
                max={25}
                value={roomLength}
                onChange={(e) => setRoomLength(Number(e.target.value))}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Width (m)</label>
              <Input
                type="number"
                min={1}
                max={25}
                value={roomWidth}
                onChange={(e) => setRoomWidth(Number(e.target.value))}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Height (m)</label>
              <Input
                type="number"
                step="0.1"
                min={1}
                max={6}
                value={roomHeight}
                onChange={(e) => setRoomHeight(Number(e.target.value))}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-2 text-center">
              <div className="text-[10px] text-muted-foreground uppercase font-medium">Target CADR</div>
              <div className="text-base font-extrabold text-primary">{requiredCADR} m³/h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-3.5 text-muted-foreground mr-1" />
        <Button
          size="sm"
          variant={selectedCategory === "all" ? "default" : "outline"}
          className="h-8 text-xs rounded-full"
          onClick={() => setSelectedCategory("all")}
        >
          All Hacks ({STANDARD_HACKS.length})
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "diy_filtration" ? "default" : "outline"}
          className="h-8 text-xs rounded-full"
          onClick={() => setSelectedCategory("diy_filtration")}
        >
          DIY Filtration
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "wet_mopping_cleaning" ? "default" : "outline"}
          className="h-8 text-xs rounded-full"
          onClick={() => setSelectedCategory("wet_mopping_cleaning")}
        >
          Wet Mopping
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "airtight_sealing" ? "default" : "outline"}
          className="h-8 text-xs rounded-full"
          onClick={() => setSelectedCategory("airtight_sealing")}
        >
          Draft Sealing
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "kitchen_ventilation" ? "default" : "outline"}
          className="h-8 text-xs rounded-full"
          onClick={() => setSelectedCategory("kitchen_ventilation")}
        >
          Kitchen Exhaust
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "botanical_flora" ? "default" : "outline"}
          className="h-8 text-xs rounded-full"
          onClick={() => setSelectedCategory("botanical_flora")}
        >
          Botanical Flora
        </Button>
      </div>

      {/* Hack Cards List */}
      <div className="grid gap-4">
        {filteredHacks.map((hack) => (
          <HackCard
            key={hack.id}
            hack={hack}
            isCompleted={completedHackIds.includes(hack.id)}
            onToggleComplete={() => onToggleHack?.(hack.id)}
          />
        ))}
      </div>
    </div>
  );
}
