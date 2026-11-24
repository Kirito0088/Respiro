import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex database schema for Respiro.
 * Every user-owned table stores both `ownerId` and associated parent IDs.
 * Server functions check `ownerId` against the authenticated session before reading or writing.
 */
export default defineSchema({
  ...authTables,

  profiles: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    city: v.string(),
    dwellingType: v.string(),
    vulnerabilities: v.array(v.string()),
    purifierSetup: v.string(),
    commuteMode: v.string(),
    baseAQI: v.number(),
    roomVolumeM3: v.number(),
    isDemo: v.boolean(),
    updatedAt: v.number(),
  }).index("by_ownerId", ["ownerId"]),

  plans: defineTable({
    profileId: v.id("profiles"),
    ownerId: v.id("users"),
    source: v.union(v.literal("ai"), v.literal("offline_rules"), v.literal("sample")),
    model: v.optional(v.string()),
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
    updatedAt: v.number(),
  }).index("by_profileId", ["profileId"]),

  hackCompletions: defineTable({
    profileId: v.id("profiles"),
    ownerId: v.id("users"),
    hackId: v.string(),
    notes: v.string(),
    completedAt: v.number(),
  }).index("by_profileId", ["profileId"]),

  communityPledges: defineTable({
    ownerId: v.id("users"),
    neighborhoodZone: v.string(),
    pledgeType: v.string(),
    pledgeTitle: v.string(),
    userName: v.string(),
    createdAt: v.number(),
  }).index("by_neighborhoodZone", ["neighborhoodZone"]),

  smogAlerts: defineTable({
    city: v.string(),
    aqi: v.number(),
    inversionStage: v.string(),
    headline: v.string(),
    actionTip: v.string(),
    timestamp: v.number(),
  }).index("by_city", ["city"]),
});
