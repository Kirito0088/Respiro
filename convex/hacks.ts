import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwnedProfile } from "./lib/access";
import { STANDARD_HACKS } from "../lib/ai/fallback-advisor";

export const listStandardHacks = query({
  args: {},
  handler: async () => {
    return STANDARD_HACKS;
  },
});

export const listCompletions = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    await requireOwnedProfile(ctx, args.profileId);
    return await ctx.db
      .query("hackCompletions")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .collect();
  },
});

export const toggleCompletion = mutation({
  args: {
    profileId: v.id("profiles"),
    hackId: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireOwnedProfile(ctx, args.profileId);
    const existing = await ctx.db
      .query("hackCompletions")
      .withIndex("by_profileId", (q) => q.eq("profileId", args.profileId))
      .filter((q) => q.eq(q.field("hackId"), args.hackId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { completed: false };
    }

    await ctx.db.insert("hackCompletions", {
      profileId: args.profileId,
      ownerId: userId,
      hackId: args.hackId,
      notes: args.notes?.trim() ?? "",
      completedAt: Date.now(),
    });
    return { completed: true };
  },
});
