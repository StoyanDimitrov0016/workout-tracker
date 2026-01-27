import { type Infer, v } from "convex/values";

import { requireAuth } from "./auth";
import { mutation, query } from "./_generated/server";

const splitExerciseSchema = v.object({
  exerciseId: v.id("exercises"),
  exerciseName: v.string(),
  sets: v.number(),
  reps: v.number(),
  restSec: v.number(),
});

const daySchema = v.object({
  weekday: v.number(),
  title: v.string(),
  exercises: v.array(splitExerciseSchema),
});

function normalizeDays(days: Array<Infer<typeof daySchema>>) {
  const seen = new Set<number>();

  for (const day of days) {
    if (!Number.isInteger(day.weekday) || day.weekday < 1 || day.weekday > 7) {
      throw new Error("Weekday must be an integer from 1 to 7.");
    }
    if (seen.has(day.weekday)) {
      throw new Error("Weekdays must be unique.");
    }
    seen.add(day.weekday);
  }

  return [...days].sort((a, b) => a.weekday - b.weekday);
}

export const getMine = query({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    return await ctx.db
      .query("splits")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .unique();
  },
});

export const saveMine = mutation({
  args: {
    name: v.string(),
    days: v.array(daySchema),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const normalizedDays = normalizeDays(args.days);

    const existing = await ctx.db
      .query("splits")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        days: normalizedDays,
      });
      return existing._id;
    }

    return await ctx.db.insert("splits", {
      userToken,
      name: args.name,
      days: normalizedDays,
    });
  },
});
