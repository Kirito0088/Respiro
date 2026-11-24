import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwned, requireUserId } from "./lib/access";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("items")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("items", {
      ownerId: userId,
      title: args.title.trim(),
      description: args.description?.trim(),
      status: "active",
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, args) => {
    const { doc } = await requireOwned(ctx, "items", args.id);
    await ctx.db.delete(doc._id);
  },
});
