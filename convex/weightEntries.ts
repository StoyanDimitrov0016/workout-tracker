import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./auth";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;

export const add = mutation({
  args: {
    weightKg: v.number(),
  },
  handler: async (ctx, { weightKg }) => {
    const userToken = await requireAuth(ctx);
    return await ctx.db.insert("weightEntries", {
      userToken,
      weightKg,
    });
  },
});

export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    const userToken = await requireAuth(ctx);
    const normalizedLimit = Math.min(Math.max(limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);

    return await ctx.db
      .query("weightEntries")
      .withIndex("by_user_creationTime", (q) => q.eq("userToken", userToken))
      .order("desc")
      .take(normalizedLimit);
  },
});

export const removeLatest = mutation({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    const latestEntry = await ctx.db
      .query("weightEntries")
      .withIndex("by_user_creationTime", (q) => q.eq("userToken", userToken))
      .order("desc")
      .first();

    if (!latestEntry) return null;

    await ctx.db.delete(latestEntry._id);
    return latestEntry._id;
  },
});
