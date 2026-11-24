"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HackItem } from "@/lib/ai/copilot-schema";
import { formatMoney } from "@/lib/money";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Droplets,
  Flame,
  Leaf,
  ShieldCheck,
  Wrench,
} from "lucide-react";

interface HackCardProps {
  hack: HackItem;
  isCompleted: boolean;
  onToggleComplete?: () => void;
}

export function HackCard({ hack, isCompleted, onToggleComplete }: HackCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getCategoryIcon = (category: HackItem["category"]) => {
    switch (category) {
      case "diy_filtration":
        return <Cpu className="size-3.5 text-primary" />;
      case "wet_mopping_cleaning":
        return <Droplets className="size-3.5 text-blue-500" />;
      case "airtight_sealing":
        return <ShieldCheck className="size-3.5 text-amber-500" />;
      case "kitchen_ventilation":
        return <Flame className="size-3.5 text-rose-500" />;
      case "botanical_flora":
        return <Leaf className="size-3.5 text-emerald-500" />;
      default:
        return <Wrench className="size-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 p-5 ${
        isCompleted
          ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm"
          : "border-border/70 bg-card hover:border-primary/40 shadow-xs"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              {getCategoryIcon(hack.category)}
              <span className="capitalize">{hack.category.replace(/_/g, " ")}</span>
            </Badge>
            <Badge
              variant={
                hack.difficulty === "easy"
                  ? "secondary"
                  : hack.difficulty === "moderate"
                    ? "outline"
                    : "destructive"
              }
              className="text-xs capitalize"
            >
              {hack.difficulty}
            </Badge>
            <span className="text-xs font-semibold text-foreground">
              Est. Cost:{" "}
              {hack.estimatedCostINR === 0 ? "Free (₹0)" : formatMoney(hack.estimatedCostINR, "INR")}
            </span>
          </div>

          <h3 className="text-base font-bold text-foreground leading-snug">{hack.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{hack.summary}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
          <Button
            size="sm"
            variant={isCompleted ? "default" : "outline"}
            className={isCompleted ? "bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5" : "gap-1.5"}
            onClick={onToggleComplete}
          >
            <CheckCircle className="size-4" />
            <span>{isCompleted ? "Implemented" : "Mark Done"}</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse steps" : "Expand steps"}
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Scientific Explanation */}
      <div className="mt-3 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground border border-border/30">
        <strong className="font-semibold text-foreground">Why It Works: </strong>
        {hack.whyItWorks}
      </div>

      {/* Collapsible Step-by-Step Instructions */}
      {expanded && (
        <div className="mt-4 space-y-3 pt-3 border-t border-border/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Step-by-Step Protocol ({hack.steps.length} Steps)
          </h4>
          <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside leading-relaxed">
            {hack.steps.map((step, idx) => (
              <li key={idx} className="pl-1">
                <span className="text-foreground">{step}</span>
              </li>
            ))}
          </ol>

          {hack.safetyWarning && (
            <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>
                <strong>Safety Note: </strong>
                {hack.safetyWarning}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
