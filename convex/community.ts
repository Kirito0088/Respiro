import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/access";

export const listPledges = query({
  args: { neighborhoodZone: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("communityPledges")
      .withIndex("by_neighborhoodZone", (q) => q.eq("neighborhoodZone", args.neighborhoodZone))
      .order("desc")
      .take(50);
  },
});

export const createPledge = mutation({
  args: {
    neighborhoodZone: v.string(),
    pledgeType: v.string(),
    pledgeTitle: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("communityPledges", {
      ownerId: userId,
      neighborhoodZone: args.neighborhoodZone.trim(),
      pledgeType: args.pledgeType,
      pledgeTitle: args.pledgeTitle.trim(),
      userName: args.userName.trim() || "Anonymous Neighbor",
      createdAt: Date.now(),
    });
  },
});

export const getCommunityStats = query({
  args: { neighborhoodZone: v.string() },
  handler: async (ctx, args) => {
    const pledges = await ctx.db
      .query("communityPledges")
      .withIndex("by_neighborhoodZone", (q) => q.eq("neighborhoodZone", args.neighborhoodZone))
      .collect();

    return {
      totalPledges: pledges.length,
      carpoolCount: pledges.filter((p) => p.pledgeType === "carpool").length,
      cleanHeatCount: pledges.filter((p) => p.pledgeType === "clean_heat").length,
      zeroBurnCount: pledges.filter((p) => p.pledgeType === "zero_burn").length,
      bulkFilterCount: pledges.filter((p) => p.pledgeType === "bulk_filter").length,
    };
  },
});
