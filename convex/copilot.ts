import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation, query } from "./_generated/server";
import { requireOwnedProfile, requireUserId } from "./lib/access";
import { CopilotPlanSchema, type CopilotPlan } from "../lib/ai/copilot-schema";
import { generateDeterministicPlan } from "../lib/ai/fallback-advisor";
import { requestStructured, type ChatMessage } from "../lib/ai/groq";
import { toStrictJsonSchema } from "../lib/ai/json-schema";

export const getPlan = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    await requireOwnedProfile(ctx, args.profileId);
    return await ctx.db
      .query("plans")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .first();
  },
});

export const savePlan = internalMutation({
  args: {
    profileId: v.id("profiles"),
    ownerId: v.id("users"),
    source: v.union(v.literal("ai"), v.literal("offline_rules"), v.literal("sample")),
    model: v.optional(v.string()),
    plan: v.object({
      headline: v.string(),
      summary: v.string(),
      primaryVulnerabilityAlert: v.optional(v.string()),
      dailyRoutines: v.array(
        v.object({
          timeSlot: v.string(),
          activity: v.string(),
          airSafetyTier: v.string(),
          indoorPurifierSetting: v.string(),
          maskRecommendation: v.string(),
          actionTip: v.string(),
        }),
      ),
      topHacks: v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          category: v.string(),
          difficulty: v.string(),
          estimatedCostINR: v.number(),
          summary: v.string(),
          whyItWorks: v.string(),
          steps: v.array(v.string()),
          safetyWarning: v.optional(v.string()),
        }),
      ),
      sustainableAlternatives: v.array(
        v.object({
          title: v.string(),
          category: v.string(),
          description: v.string(),
          directImpactNote: v.string(),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("plans")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        source: args.source,
        model: args.model,
        headline: args.plan.headline,
        summary: args.plan.summary,
        primaryVulnerabilityAlert: args.plan.primaryVulnerabilityAlert,
        dailyRoutines: args.plan.dailyRoutines,
        topHacks: args.plan.topHacks,
        sustainableAlternatives: args.plan.sustainableAlternatives,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("plans", {
      profileId: args.profileId,
      ownerId: args.ownerId,
      source: args.source,
      model: args.model,
      headline: args.plan.headline,
      summary: args.plan.summary,
      primaryVulnerabilityAlert: args.plan.primaryVulnerabilityAlert,
      dailyRoutines: args.plan.dailyRoutines,
      topHacks: args.plan.topHacks,
      sustainableAlternatives: args.plan.sustainableAlternatives,
      updatedAt: Date.now(),
    });
  },
});

export const generatePlan = action({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args): Promise<{ source: "ai" | "offline_rules"; plan: CopilotPlan }> => {
    const profile = await ctx.runQuery(api.profiles.get, { profileId: args.profileId });
    const userId = await requireUserId(ctx);

    const advisorContext = {
      city: profile.city,
      baseAQI: profile.baseAQI,
      dwellingType: profile.dwellingType,
      vulnerabilities: profile.vulnerabilities,
      commuteMode: profile.commuteMode,
      hasPurifier: profile.purifierSetup !== "none",
    };

    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      try {
        const jsonSchema = toStrictJsonSchema(CopilotPlanSchema);
        const messages: ChatMessage[] = [
          {
            role: "system",
            content: `You are Respiro's expert AI Smog Defense Advisor.
Your objective is to produce a customized winter smog protection plan for a household facing severe urban air pollution.
Adhere strictly to physical thermal inversion science:
- Morning (06:00-09:30) has peak ground-level inversion trapping (hazardous outdoor exposure; zero natural ventilation).
- Midday (12:00-15:30) is the solar boundary expansion window suitable for rapid 10-15 minute cross-ventilation flushes.
- Evening (18:00-22:00) sees secondary traffic compression.
Respond ONLY with valid JSON matching the schema.`,
          },
          {
            role: "user",
            content: `Household Context:
- City: ${profile.city}
- Baseline Outdoor AQI: ${profile.baseAQI}
- Dwelling Type: ${profile.dwellingType}
- Vulnerabilities: ${profile.vulnerabilities.join(", ") || "None"}
- Existing Purifier Setup: ${profile.purifierSetup}
- Commute Mode: ${profile.commuteMode}
- Room Volume: ${profile.roomVolumeM3} m³`,
          },
        ];

        const result = await requestStructured<CopilotPlan>({
          apiKey,
          models: ["openai/gpt-oss-120b", "openai/gpt-oss-20b"],
          messages,
          schemaName: "CopilotPlan",
          jsonSchema,
          parse: (text) => CopilotPlanSchema.parse(JSON.parse(text)),
          maxCompletionTokens: 2500,
          temperature: 0.2,
          timeoutMs: 15000,
        });

        if (result.ok) {
          await ctx.runMutation(internal.copilot.savePlan, {
            profileId: args.profileId,
            ownerId: userId,
            source: "ai",
            model: result.model,
            plan: result.data,
          });
          return { source: "ai", plan: result.data };
        }
      } catch (err) {
        // Fall through to deterministic advisor on any AI error
        console.warn("AI generation failed, engaging deterministic fallback advisor:", err);
      }
    }

    // High availability fallback per ADR 2
    const deterministicPlan = generateDeterministicPlan(advisorContext);
    await ctx.runMutation(internal.copilot.savePlan, {
      profileId: args.profileId,
      ownerId: userId,
      source: "offline_rules",
      model: "respiro-offline-v1",
      plan: deterministicPlan,
    });

    return { source: "offline_rules", plan: deterministicPlan };
  },
});
