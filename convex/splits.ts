import { type Infer, v } from "convex/values";

import { requireAuth } from "./auth";
import type { Id } from "./_generated/dataModel";
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

export const getMineWithDailyMuscleVolume = query({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    const split = await ctx.db
      .query("splits")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .unique();

    if (!split) return null;

    const muscles = await ctx.db.query("muscles").collect();
    const exercises = await ctx.db.query("exercises").collect();

    const muscleById = new Map<Id<"muscles">, { name: string; sortOrder: number }>(
      muscles.map((muscle) => [muscle._id, { name: muscle.name, sortOrder: muscle.sortOrder }])
    );
    const exerciseToMuscle = new Map<Id<"exercises">, Id<"muscles">>(
      exercises.map((exercise) => [exercise._id, exercise.muscleId])
    );

    const days = split.days.map((day) => {
      let totalSets = 0;
      const setsByMuscle = new Map<
        Id<"muscles">,
        { muscleId: Id<"muscles">; muscleName: string; sets: number }
      >();

      day.exercises.forEach((exercise) => {
        totalSets += exercise.sets;
        const muscleId = exerciseToMuscle.get(exercise.exerciseId);
        if (!muscleId) return;
        const muscleInfo = muscleById.get(muscleId);
        if (!muscleInfo) return;
        const existing = setsByMuscle.get(muscleId) ?? {
          muscleId,
          muscleName: muscleInfo.name,
          sets: 0,
        };
        existing.sets += exercise.sets;
        setsByMuscle.set(muscleId, existing);
      });

      const setsByMuscleArray = Array.from(setsByMuscle.values()).sort((a, b) => {
        const sortA = muscleById.get(a.muscleId)?.sortOrder ?? 0;
        const sortB = muscleById.get(b.muscleId)?.sortOrder ?? 0;
        if (sortA !== sortB) return sortA - sortB;
        return a.muscleName.localeCompare(b.muscleName);
      });

      return {
        weekday: day.weekday,
        title: day.title,
        exercises: day.exercises,
        totalSets,
        setsByMuscle: setsByMuscleArray,
      };
    });

    return {
      _id: split._id,
      name: split.name,
      days,
    };
  },
});
