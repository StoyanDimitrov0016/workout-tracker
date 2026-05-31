import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./auth";
import {
  assertDailyUserWriteLimit,
  assertPositiveLimit,
  MAX_WEIGHT_AVERAGE_DAYS,
  MAX_WEIGHT_ENTRIES_PER_DAY,
  MAX_WEIGHT_QUERY_LIMIT,
} from "./usageLimits";

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
    assertPositiveLimit(limit, MAX_WEIGHT_QUERY_LIMIT, "Weight limit");
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
    assertPositiveLimit(days, MAX_WEIGHT_AVERAGE_DAYS, "Weight average days");
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

export const getTrend = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    assertPositiveLimit(limit, MAX_WEIGHT_QUERY_LIMIT, "Weight trend limit");
    const userToken = await requireAuth(ctx);
    const entries = await ctx.db
      .query("weights")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .order("desc")
      .take(limit);

    const orderedEntries = [...entries].reverse();
    const latest = entries[0] ?? null;
    const oldest = orderedEntries[0] ?? null;
    const deltaKg =
      latest && oldest && latest._id !== oldest._id ? latest.weightKg - oldest.weightKg : null;

    const minWeightKg =
      orderedEntries.length > 0
        ? orderedEntries.reduce(
            (min, entry) => Math.min(min, entry.weightKg),
            orderedEntries[0]!.weightKg
          )
        : null;
    const maxWeightKg =
      orderedEntries.length > 0
        ? orderedEntries.reduce(
            (max, entry) => Math.max(max, entry.weightKg),
            orderedEntries[0]!.weightKg
          )
        : null;

    return {
      entries: orderedEntries.map((entry) => ({
        _id: entry._id,
        createdAt: entry._creationTime,
        weightKg: entry.weightKg,
      })),
      latestWeightKg: latest?.weightKg ?? null,
      oldestWeightKg: oldest?.weightKg ?? null,
      deltaKg,
      minWeightKg,
      maxWeightKg,
    };
  },
});

export const create = mutation({
  args: {
    weightKg: v.number(),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    await assertDailyUserWriteLimit(
      ctx,
      "weights",
      userToken,
      MAX_WEIGHT_ENTRIES_PER_DAY,
      "weight entry"
    );
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
