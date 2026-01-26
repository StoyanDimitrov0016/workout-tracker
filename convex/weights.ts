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
