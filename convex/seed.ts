import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";

const musclesSeed = [
  { slug: "chest", name: "Chest", sortOrder: 10 },
  { slug: "back", name: "Back", sortOrder: 20 },
  { slug: "shoulders", name: "Shoulders", sortOrder: 30 },
  { slug: "biceps", name: "Biceps", sortOrder: 40 },
  { slug: "triceps", name: "Triceps", sortOrder: 50 },
  { slug: "hamstrings", name: "Hamstrings", sortOrder: 60 },
  { slug: "quads", name: "Quads", sortOrder: 70 },
  { slug: "core", name: "Core", sortOrder: 80 },
];

const exercisesSeed = [
  { name: "Pull-Up", muscleSlug: "back" },
  { name: "Assisted Pull-Up (Machine)", muscleSlug: "back" },
  { name: "Lat Pulldown", muscleSlug: "back" },
  { name: "Seated Cable Row", muscleSlug: "back" },
  { name: "Chest-Supported Row (Machine)", muscleSlug: "back" },
  { name: "Bench Press", muscleSlug: "chest" },
  { name: "Seated Chest Press (Machine)", muscleSlug: "chest" },
  { name: "Pec Deck (Chest Fly)", muscleSlug: "chest" },
  { name: "Incline Chest Press (Machine)", muscleSlug: "chest" },
  { name: "Cable Lateral Raise", muscleSlug: "shoulders" },
  { name: "Overhead Press (Machine)", muscleSlug: "shoulders" },
  { name: "Rear Delt Fly (Machine)", muscleSlug: "shoulders" },
  { name: "Triceps Pressdown (Cable)", muscleSlug: "triceps" },
  { name: "Overhead Triceps Extension (Cable)", muscleSlug: "triceps" },
  { name: "Dumbbell Curl", muscleSlug: "biceps" },
  { name: "Cable Curl", muscleSlug: "biceps" },
  { name: "Hamstring Curl (Machine)", muscleSlug: "hamstrings" },
  { name: "Plank", muscleSlug: "core" },
];

export const musclesAndExercises = internalMutation({
  args: {
    reset: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.reset) {
      const existingExercises = await ctx.db.query("exercises").collect();
      for (const exercise of existingExercises) {
        await ctx.db.delete(exercise._id);
      }

      const existingMuscles = await ctx.db.query("muscles").collect();
      for (const muscle of existingMuscles) {
        await ctx.db.delete(muscle._id);
      }
    }

    const muscleIds = new Map<string, Id<"muscles">>();
    let musclesCount = 0;
    let exercisesCount = 0;

    for (const muscle of musclesSeed) {
      const existing = await ctx.db
        .query("muscles")
        .withIndex("by_slug", (q) => q.eq("slug", muscle.slug))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          name: muscle.name,
          sortOrder: muscle.sortOrder,
        });
        muscleIds.set(muscle.slug, existing._id);
      } else {
        const id = await ctx.db.insert("muscles", muscle);
        muscleIds.set(muscle.slug, id);
      }
      musclesCount += 1;
    }

    for (const exercise of exercisesSeed) {
      const muscleId = muscleIds.get(exercise.muscleSlug);
      if (!muscleId) continue;

      const existing = await ctx.db
        .query("exercises")
        .withIndex("by_name", (q) => q.eq("name", exercise.name))
        .unique();

      if (existing) {
        if (existing.muscleId !== muscleId) {
          await ctx.db.patch(existing._id, { muscleId });
        }
      } else {
        await ctx.db.insert("exercises", {
          name: exercise.name,
          muscleId,
        });
      }
      exercisesCount += 1;
    }

    return { muscles: musclesCount, exercises: exercisesCount };
  },
});
