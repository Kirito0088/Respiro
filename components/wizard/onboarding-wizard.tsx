"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

export interface WizardData {
  name: string;
  city: string;
  baseAQI: number;
  dwellingType: string;
  vulnerabilities: string[];
  purifierSetup: string;
  commuteMode: string;
  roomVolumeM3: number;
}

interface OnboardingWizardProps {
  onComplete: (data: WizardData) => void;
  onCancel?: () => void;
}

const CITY_PRESETS = [
  { name: "Delhi-NCR (Anand Vihar)", aqi: 395 },
  { name: "Patna (Rajendra Nagar)", aqi: 360 },
  { name: "Lahore (Cantt Basin)", aqi: 425 },
  { name: "Gurgaon (Cyber City)", aqi: 310 },
  { name: "Mumbai (Bandra-Kurla)", aqi: 165 },
  { name: "Beijing (Chaoyang)", aqi: 220 },
];

export function OnboardingWizard({ onComplete, onCancel }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("My Household");
  const [city, setCity] = useState("Delhi-NCR (Anand Vihar)");
  const [baseAQI, setBaseAQI] = useState(395);
  const [dwellingType, setDwellingType] = useState("ground_floor_independent");
  const [vulnerabilities, setVulnerabilities] = useState<string[]>(["asthmatics_respiratory"]);
  const [purifierSetup, setPurifierSetup] = useState("diy_filters");
  const [commuteMode, setCommuteMode] = useState("two_wheeler_unprotected");
  const [roomVolumeM3, setRoomVolumeM3] = useState(65);

  const toggleVulnerability = (id: string) => {
    if (vulnerabilities.includes(id)) {
      setVulnerabilities(vulnerabilities.filter((v) => v !== id));
    } else {
      setVulnerabilities([...vulnerabilities, id]);
    }
  };

  const handleSubmit = () => {
    onComplete({
      name,
      city,
      baseAQI,
      dwellingType,
      vulnerabilities,
      purifierSetup,
      commuteMode,
      roomVolumeM3,
    });
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border/70 bg-card p-6 shadow-md space-y-6">
      {/* Wizard Step Progress Indicator */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Step {step} of 4</span>
          <h2 className="text-lg font-bold text-foreground">
            {step === 1 && "Location & Ambient Smog Baseline"}
            {step === 2 && "Dwelling & Ventilation Parameters"}
            {step === 3 && "Household Vulnerability Profile"}
            {step === 4 && "Air Infrastructure & Commute Mode"}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? "w-6 bg-primary" : s < step ? "w-2 bg-primary/60" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Location & AQI */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground">Household Label</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-9 text-sm"
              placeholder="e.g. Verma Family / Flat 301"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Select City / Micro-Zone Preset</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5 sm:grid-cols-3">
              {CITY_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setCity(preset.name);
                    setBaseAQI(preset.aqi);
                  }}
                  className={`rounded-lg border p-2 text-left text-xs transition-colors ${
                    city === preset.name
                      ? "border-primary bg-primary/10 font-bold text-foreground"
                      : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div className="font-semibold text-foreground">{preset.name}</div>
                  <div className="text-[11px] opacity-80">Baseline AQI: {preset.aqi}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">City or Locality Name</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Baseline Outdoor AQI</label>
              <Input
                type="number"
                min={10}
                max={999}
                value={baseAQI}
                onChange={(e) => setBaseAQI(Number(e.target.value))}
                className="mt-1 h-9 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Dwelling Type */}
      {step === 2 && (
        <div className="space-y-4">
          <label className="text-xs font-semibold text-foreground">Dwelling Containment Tier</label>
          <div className="grid gap-2.5">
            {[
              {
                id: "apartment_high_rise",
                title: "High-Rise Apartment (Floor 4+)",
                desc: "Elevated particulate drift; lower street-level traffic exhaust; sealed balconies.",
              },
              {
                id: "ground_floor_independent",
                title: "Ground Floor / Independent House",
                desc: "High street-level particulate infiltration; road dust and vehicular exhaust.",
              },
              {
                id: "ventilated_house",
                title: "Naturally Ventilated / Older Construction",
                desc: "High natural air changes per hour (ACH); drafty window sashes needing active sealing.",
              },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDwellingType(d.id)}
                className={`rounded-xl border p-3.5 text-left transition-all ${
                  dwellingType === d.id
                    ? "border-primary bg-primary/10 font-semibold shadow-xs"
                    : "border-border/60 hover:bg-muted/30"
                }`}
              >
                <div className="text-sm font-bold text-foreground">{d.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Primary Living Room Volume (m³)</label>
            <Input
              type="number"
              min={15}
              max={300}
              value={roomVolumeM3}
              onChange={(e) => setRoomVolumeM3(Number(e.target.value))}
              className="mt-1 h-9 text-sm"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Typical living room: 50–80 m³ (L × W × H).
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Vulnerabilities */}
      {step === 3 && (
        <div className="space-y-4">
          <label className="text-xs font-semibold text-foreground">
            Select Vulnerable Family Members Present in Household
          </label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {[
              {
                id: "infants",
                label: "Infants / Toddlers (<5 yrs)",
                desc: "Immature lung epithelium, rapid respiration.",
              },
              {
                id: "asthmatics_respiratory",
                label: "Asthmatics / Bronchitis",
                desc: "Bronchial hypersensitivity to PM2.5.",
              },
              {
                id: "elderly",
                label: "Elderly (>65 yrs)",
                desc: "Elevated cardiovascular and stroke hazard.",
              },
              {
                id: "cardiovascular",
                label: "Heart / Hypertension",
                desc: "Systemic microvascular inflammation risk.",
              },
              {
                id: "outdoor_commuters",
                label: "Daily Outdoor Commuters",
                desc: "Prolonged transit particulate inhalation.",
              },
              {
                id: "pets",
                label: "Household Pets",
                desc: "High floor-level dust and fur allergen exposure.",
              },
            ].map((v) => {
              const selected = vulnerabilities.includes(v.id);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => toggleVulnerability(v.id)}
                  className={`rounded-xl border p-3 text-left transition-all flex items-start justify-between ${
                    selected
                      ? "border-primary bg-primary/10 font-semibold"
                      : "border-border/60 hover:bg-muted/30"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-foreground">{v.label}</div>
                    <div className="text-[11px] text-muted-foreground">{v.desc}</div>
                  </div>
                  {selected && <Check className="size-4 text-primary shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Infrastructure & Commute */}
      {step === 4 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground">Current Clean Air Infrastructure</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {[
                { id: "none", label: "None / Ceiling Fans Only" },
                { id: "diy_filters", label: "DIY Box / HEPA Hacks" },
                { id: "single_room_hepa", label: "1 Commercial Purifier" },
                { id: "whole_home", label: "Whole-Home HEPA" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPurifierSetup(p.id)}
                  className={`rounded-lg border p-2.5 text-xs text-left ${
                    purifierSetup === p.id
                      ? "border-primary bg-primary/10 font-bold"
                      : "border-border/60 hover:bg-muted/30"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Daily Commute Mode</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5 sm:grid-cols-3">
              {[
                { id: "two_wheeler_unprotected", label: "Motorcycle / Scooter" },
                { id: "bus_public", label: "Public Bus" },
                { id: "car_sealed", label: "Car (Recirculating AC)" },
                { id: "metro_ev", label: "Electric Metro Rail" },
                { id: "walk_cycle", label: "Bicycle / Walking" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCommuteMode(c.id)}
                  className={`rounded-lg border p-2.5 text-xs text-left ${
                    commuteMode === c.id
                      ? "border-primary bg-primary/10 font-bold"
                      : "border-border/60 hover:bg-muted/30"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-border/40 pt-4">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStep(step - 1)}
            className="gap-1.5"
          >
            <ArrowLeft className="size-4" />
            <span>Previous</span>
          </Button>
        ) : onCancel ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <Button type="button" size="sm" onClick={() => setStep(step + 1)} className="gap-1.5 font-semibold">
            <span>Next Step</span>
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            className="gap-1.5 font-bold bg-primary text-primary-foreground shadow-sm"
          >
            <Sparkles className="size-4" />
            <span>Generate Clean-Air Strategy</span>
          </Button>
        )}
      </div>
    </div>
  );
}
