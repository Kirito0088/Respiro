import { z } from "zod";

export const HackCategorySchema = z.enum([
  "diy_filtration",
  "airtight_sealing",
  "wet_mopping_cleaning",
  "kitchen_ventilation",
  "botanical_flora",
  "commute_protection",
]);

export type HackCategory = z.infer<typeof HackCategorySchema>;

export const HackItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: HackCategorySchema,
  difficulty: z.enum(["easy", "moderate", "advanced"]),
  estimatedCostINR: z.number().int().nonnegative(),
  summary: z.string(),
  whyItWorks: z.string(),
  steps: z.array(z.string()).min(2),
  safetyWarning: z.string().optional(),
});

export type HackItem = z.infer<typeof HackItemSchema>;

export const RoutineTimeSlotSchema = z.object({
  timeSlot: z.string(),
  activity: z.string(),
  airSafetyTier: z.enum(["safe", "caution", "hazardous"]),
  indoorPurifierSetting: z.enum(["off", "eco_silent", "boost_clean"]),
  maskRecommendation: z.enum(["none", "surgical_dust", "n95_ffp2"]),
  actionTip: z.string(),
});

export type RoutineTimeSlot = z.infer<typeof RoutineTimeSlotSchema>;

export const SustainableAlternativeSchema = z.object({
  title: z.string(),
  category: z.enum(["transport", "heating_cooking", "waste_management"]),
  description: z.string(),
  directImpactNote: z.string(),
});

export type SustainableAlternative = z.infer<typeof SustainableAlternativeSchema>;

export const CopilotPlanSchema = z.object({
  headline: z.string(),
  summary: z.string(),
  primaryVulnerabilityAlert: z.string().optional(),
  dailyRoutines: z.array(RoutineTimeSlotSchema).min(3),
  topHacks: z.array(HackItemSchema).min(2),
  sustainableAlternatives: z.array(SustainableAlternativeSchema).min(2),
});

export type CopilotPlan = z.infer<typeof CopilotPlanSchema>;
