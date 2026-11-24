import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwnedProfile, requireUserId } from "./lib/access";

export const get = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const { profile } = await requireOwnedProfile(ctx, args.profileId);
    return profile;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("profiles")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    city: v.string(),
    dwellingType: v.string(),
    vulnerabilities: v.array(v.string()),
    purifierSetup: v.string(),
    commuteMode: v.string(),
    baseAQI: v.number(),
    roomVolumeM3: v.number(),
    isDemo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const profileId = await ctx.db.insert("profiles", {
      ownerId: userId,
      name: args.name.trim(),
      city: args.city.trim(),
      dwellingType: args.dwellingType,
      vulnerabilities: args.vulnerabilities,
      purifierSetup: args.purifierSetup,
      commuteMode: args.commuteMode,
      baseAQI: Math.max(10, Math.min(999, Math.round(args.baseAQI))),
      roomVolumeM3: Math.max(10, Math.round(args.roomVolumeM3)),
      isDemo: args.isDemo ?? false,
      updatedAt: Date.now(),
    });
    return profileId;
  },
});

export const update = mutation({
  args: {
    id: v.id("profiles"),
    name: v.optional(v.string()),
    city: v.optional(v.string()),
    baseAQI: v.optional(v.number()),
    purifierSetup: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireOwnedProfile(ctx, args.id);
    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name.trim();
    if (args.city !== undefined) updates.city = args.city.trim();
    if (args.baseAQI !== undefined) updates.baseAQI = Math.max(10, Math.min(999, Math.round(args.baseAQI)));
    if (args.purifierSetup !== undefined) updates.purifierSetup = args.purifierSetup;

    await ctx.db.patch(profile._id, updates);
  },
});
