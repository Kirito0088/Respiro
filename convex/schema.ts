import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex database schema for PromptWars Challenge 6.
 * All tables enforce owner-based multi-tenancy and indexation.
 */
export default defineSchema({
  ...authTables,

  items: defineTable({
    ownerId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("archived")),
    updatedAt: v.number(),
  }).index("by_ownerId", ["ownerId"]),
});
