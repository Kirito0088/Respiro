import { mutation } from "./_generated/server";
import { requireUserId } from "./lib/access";
import { generateDeterministicPlan } from "../lib/ai/fallback-advisor";

export const seedDemoProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    // Check if demo profile already exists for this user
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", userId))
      .filter((q) => q.eq(q.field("isDemo"), true))
      .first();

    if (existing) {
      return existing._id;
    }

    // Seed realistic Delhi-NCR smog scenario
    const profileId = await ctx.db.insert("profiles", {
      ownerId: userId,
      name: "Sharma Family Household",
      city: "East Delhi (Anand Vihar Sector)",
      dwellingType: "ground_floor_independent",
      vulnerabilities: ["infants", "asthmatics_respiratory", "elderly"],
      purifierSetup: "diy_filters",
      commuteMode: "two_wheeler_unprotected",
      baseAQI: 395,
      roomVolumeM3: 65,
      isDemo: true,
      updatedAt: Date.now(),
    });

    const plan = generateDeterministicPlan({
      city: "East Delhi (Anand Vihar Sector)",
      baseAQI: 395,
      dwellingType: "ground_floor_independent",
      vulnerabilities: ["infants", "asthmatics_respiratory", "elderly"],
      commuteMode: "two_wheeler_unprotected",
      hasPurifier: true,
    });

    await ctx.db.insert("plans", {
      profileId,
      ownerId: userId,
      source: "sample",
      model: "respiro-sample-v1",
      headline: plan.headline,
      summary: plan.summary,
      primaryVulnerabilityAlert: plan.primaryVulnerabilityAlert,
      dailyRoutines: plan.dailyRoutines,
      topHacks: plan.topHacks,
      sustainableAlternatives: plan.sustainableAlternatives,
      updatedAt: Date.now(),
    });

    // Seed 2 sample hack completions
    await ctx.db.insert("hackCompletions", {
      profileId,
      ownerId: userId,
      hackId: "corsi_rosenthal_box",
      notes: "Assembled with 4 MERV-13 filters and 20-inch fan in living room.",
      completedAt: Date.now() - 86400000,
    });

    await ctx.db.insert("hackCompletions", {
      profileId,
      ownerId: userId,
      hackId: "wet_microfiber_mopping",
      notes: "Switched daily cleaning routine to damp microfiber.",
      completedAt: Date.now() - 43200000,
    });

    // Seed sample community pledge
    await ctx.db.insert("communityPledges", {
      ownerId: userId,
      neighborhoodZone: "East Delhi (Anand Vihar)",
      pledgeType: "carpool",
      pledgeTitle: "Shared EV School Run & Metro Switch",
      userName: "Sharma Family",
      createdAt: Date.now(),
    });

    return profileId;
  },
});
