import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { Doc, Id, TableNames } from "../_generated/dataModel";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Authorization helpers. Every public function calls one of these before it
 * touches data. Missing and foreign records produce the same "not found"
 * error so IDs cannot be probed.
 */

export function notFound(what = "That item"): ConvexError<{ code: string; message: string }> {
  return new ConvexError({ code: "NOT_FOUND", message: `${what} could not be found.` });
}

export async function requireUserId(ctx: QueryCtx | MutationCtx | ActionCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Please sign in to continue." });
  }
  return userId;
}

export async function requireOwned<TableName extends TableNames>(
  ctx: QueryCtx | MutationCtx,
  table: TableName,
  id: Id<TableName>,
): Promise<{ userId: Id<"users">; doc: Doc<TableName> }> {
  const userId = await requireUserId(ctx);
  const doc = await ctx.db.get(table, id);
  if (!doc || (doc as Record<string, unknown>).ownerId !== userId) {
    throw notFound();
  }
  return { userId, doc };
}
