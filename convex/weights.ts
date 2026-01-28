import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./auth";

export const mostRecent = query({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    return await ctx.db
      .query("weights")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .order("desc")
      .first();
  },
});

export const listRecent = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    const userToken = await requireAuth(ctx);
    return await ctx.db
      .query("weights")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .order("desc")
      .take(limit);
  },
});

export const getLatestAndAverage = query({
  args: { days: v.number() },
  handler: async (ctx, { days }) => {
    const userToken = await requireAuth(ctx);
    const latest = await ctx.db
      .query("weights")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .order("desc")
      .first();

    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const recent = await ctx.db
      .query("weights")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .filter((q) => q.gte(q.field("_creationTime"), cutoff))
      .collect();

    const recentAverageKg =
      recent.length > 0
        ? recent.reduce((total, entry) => total + entry.weightKg, 0) / recent.length
        : null;

    return {
      days,
      latestWeightKg: latest?.weightKg ?? null,
      latestCreatedAt: latest?._creationTime ?? null,
      recentAverageKg,
      recentCount: recent.length,
    };
  },
});

export const create = mutation({
  args: {
    weightKg: v.number(),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    return await ctx.db.insert("weights", { userToken, ...args });
  },
});

export const remove = mutation({
  args: { id: v.id("weights") },
  handler: async (ctx, { id }) => {
    const userToken = await requireAuth(ctx);

    const doc = await ctx.db.get(id);
    if (!doc) return null;
    if (doc.userToken !== userToken) throw new Error("Forbidden");

    await ctx.db.delete(id);
    return id;
  },
});
