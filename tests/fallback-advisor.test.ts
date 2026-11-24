import { describe, expect, it } from "vitest";
import { CopilotPlanSchema } from "@/lib/ai/copilot-schema";
import { generateDeterministicPlan, STANDARD_HACKS } from "@/lib/ai/fallback-advisor";

describe("generateDeterministicPlan", () => {
  it("generates a complete plan matching CopilotPlanSchema", () => {
    const plan = generateDeterministicPlan({
      city: "Delhi-NCR",
      baseAQI: 380,
      dwellingType: "apartment_high_rise",
      vulnerabilities: ["infants", "asthmatics_respiratory"],
      commuteMode: "two_wheeler_unprotected",
      hasPurifier: true,
    });

    const parsed = CopilotPlanSchema.safeParse(plan);
    expect(parsed.success).toBe(true);
    expect(plan.headline).toContain("Delhi-NCR");
    expect(plan.primaryVulnerabilityAlert).toBeDefined();
    expect(plan.dailyRoutines.length).toBeGreaterThanOrEqual(4);
    expect(plan.topHacks.length).toBeGreaterThanOrEqual(2);
    expect(plan.sustainableAlternatives.length).toBeGreaterThanOrEqual(2);
  });

  it("adjusts advice for households without vulnerable members", () => {
    const plan = generateDeterministicPlan({
      city: "Mumbai",
      baseAQI: 160,
      dwellingType: "ventilated_house",
      vulnerabilities: [],
      commuteMode: "metro_ev",
      hasPurifier: false,
    });

    expect(plan.primaryVulnerabilityAlert).toBeUndefined();
    expect(plan.headline).toContain("Mumbai");
  });

  it("contains valid standard hacks with actionable step-by-step guidance", () => {
    for (const hack of STANDARD_HACKS) {
      expect(hack.steps.length).toBeGreaterThanOrEqual(2);
      expect(hack.estimatedCostINR).toBeGreaterThanOrEqual(0);
      expect(hack.whyItWorks.length).toBeGreaterThan(20);
    }
  });
});
