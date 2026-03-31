import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./auth";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    const [exercises, preferences, muscles] = await Promise.all([
      ctx.db.query("exercises").withIndex("by_name").collect(),
      ctx.db
        .query("exercisePreferences")
        .withIndex("by_user", (q) => q.eq("userToken", userToken))
        .collect(),
      ctx.db.query("muscles").collect(),
    ]);

    const muscleNameById = new Map<Id<"muscles">, string>(
      muscles.map((muscle) => [muscle._id, muscle.name])
    );
    const preferenceByExerciseId = new Map(
      preferences.map((preference) => [preference.exerciseId, preference])
    );

    return exercises.map((exercise) => {
      const preference = preferenceByExerciseId.get(exercise._id);

      return {
        exerciseId: exercise._id,
        exerciseName: exercise.name,
        muscleName: muscleNameById.get(exercise.muscleId) ?? "Unknown muscle",
        referenceUrl: preference?.referenceUrl ?? "",
        notes: preference?.notes ?? "",
        hasPreference: Boolean(preference?.referenceUrl || preference?.notes),
      };
    });
  },
});

export const saveMine = mutation({
  args: {
    exerciseId: v.id("exercises"),
    referenceUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const exercise = await ctx.db.get(args.exerciseId);

    if (!exercise) {
      throw new Error("Exercise not found.");
    }

    const referenceUrl = args?.referenceUrl?.trim();
    const notes = args?.notes?.trim();

    const existingPreference = await ctx.db
      .query("exercisePreferences")
      .withIndex("by_user_and_exercise", (q) =>
        q.eq("userToken", userToken).eq("exerciseId", args.exerciseId)
      )
      .unique();

    if (!referenceUrl && !notes) {
      if (existingPreference) {
        await ctx.db.delete(existingPreference._id);
      }

      return null;
    }

    if (existingPreference) {
      await ctx.db.patch(existingPreference._id, {
        referenceUrl,
        notes,
      });
      return existingPreference._id;
    }

    return await ctx.db.insert("exercisePreferences", {
      userToken,
      exerciseId: args.exerciseId,
      referenceUrl,
      notes,
    });
  },
});
