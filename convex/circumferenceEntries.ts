import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

export const add = mutation({
  args: {
    neckCm: v.number(),
    chestCm: v.number(),
    waistCm: v.number(),
    hipsCm: v.number(),
    upperArmLeftCm: v.number(),
    upperArmRightCm: v.number(),
    thighLeftCm: v.number(),
    thighRightCm: v.number(),
    calfLeftCm: v.number(),
    calfRightCm: v.number(),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    return await ctx.db.insert("circumferenceEntries", {
      userToken,
      ...args,
    });
  },
});

export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    return await ctx.db
      .query("circumferenceEntries")
      .withIndex("by_user_creationTime", (q) => q.eq("userToken", userToken))
      .order("desc")
      .first();
  },
});
