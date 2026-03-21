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
  { slug: "glutes", name: "Glutes", sortOrder: 80 },
  { slug: "calves", name: "Calves", sortOrder: 90 },
  { slug: "core", name: "Core", sortOrder: 100 },
];

const exercisesSeed = [
  { name: "Barbell Row", muscleSlug: "back" },
  { name: "Cable Row (Close Grip)", muscleSlug: "back" },
  { name: "Chest-Supported Row (Machine)", muscleSlug: "back" },
  { name: "Lat Pulldown", muscleSlug: "back" },
  { name: "Machine High Row", muscleSlug: "back" },
  { name: "One-Arm Dumbbell Row", muscleSlug: "back" },
  { name: "Pull-Up", muscleSlug: "back" },
  { name: "Assisted Pull-Up (Machine)", muscleSlug: "back" },
  { name: "Seated Cable Row", muscleSlug: "back" },
  { name: "Straight-Arm Pulldown", muscleSlug: "back" },
  { name: "T-Bar Row", muscleSlug: "back" },
  { name: "Bench Press", muscleSlug: "chest" },
  { name: "Cable Fly", muscleSlug: "chest" },
  { name: "Chest Dip", muscleSlug: "chest" },
  { name: "Flat Dumbbell Press", muscleSlug: "chest" },
  { name: "Incline Barbell Press", muscleSlug: "chest" },
  { name: "Incline Chest Press (Machine)", muscleSlug: "chest" },
  { name: "Incline Dumbbell Press", muscleSlug: "chest" },
  { name: "Pec Deck (Chest Fly)", muscleSlug: "chest" },
  { name: "Push-Up", muscleSlug: "chest" },
  { name: "Seated Chest Press (Machine)", muscleSlug: "chest" },
  { name: "Smith Machine Bench Press", muscleSlug: "chest" },
  { name: "Arnold Press", muscleSlug: "shoulders" },
  { name: "Cable Lateral Raise", muscleSlug: "shoulders" },
  { name: "Dumbbell Lateral Raise", muscleSlug: "shoulders" },
  { name: "Dumbbell Shoulder Press", muscleSlug: "shoulders" },
  { name: "Face Pull", muscleSlug: "shoulders" },
  { name: "Machine Lateral Raise", muscleSlug: "shoulders" },
  { name: "Overhead Press (Machine)", muscleSlug: "shoulders" },
  { name: "Rear Delt Fly (Machine)", muscleSlug: "shoulders" },
  { name: "Seated Dumbbell Shoulder Press", muscleSlug: "shoulders" },
  { name: "Barbell Curl", muscleSlug: "biceps" },
  { name: "Cable Curl", muscleSlug: "biceps" },
  { name: "Dumbbell Curl", muscleSlug: "biceps" },
  { name: "EZ-Bar Curl", muscleSlug: "biceps" },
  { name: "Hammer Curl", muscleSlug: "biceps" },
  { name: "Incline Dumbbell Curl", muscleSlug: "biceps" },
  { name: "Preacher Curl (Machine)", muscleSlug: "biceps" },
  { name: "Triceps Pressdown (Cable)", muscleSlug: "triceps" },
  { name: "Close-Grip Bench Press", muscleSlug: "triceps" },
  { name: "Dip (Machine)", muscleSlug: "triceps" },
  { name: "Overhead Triceps Extension (Cable)", muscleSlug: "triceps" },
  { name: "Overhead Triceps Extension (Dumbbell)", muscleSlug: "triceps" },
  { name: "Skull Crusher", muscleSlug: "triceps" },
  { name: "Rope Pressdown", muscleSlug: "triceps" },
  { name: "Hamstring Curl (Machine)", muscleSlug: "hamstrings" },
  { name: "Romanian Deadlift", muscleSlug: "hamstrings" },
  { name: "Seated Leg Curl", muscleSlug: "hamstrings" },
  { name: "Stiff-Leg Deadlift", muscleSlug: "hamstrings" },
  { name: "Bulgarian Split Squat", muscleSlug: "quads" },
  { name: "Hack Squat", muscleSlug: "quads" },
  { name: "Leg Extension", muscleSlug: "quads" },
  { name: "Leg Press", muscleSlug: "quads" },
  { name: "Smith Machine Squat", muscleSlug: "quads" },
  { name: "Barbell Squat", muscleSlug: "quads" },
  { name: "Walking Lunge", muscleSlug: "quads" },
  { name: "Cable Kickback", muscleSlug: "glutes" },
  { name: "Glute Bridge", muscleSlug: "glutes" },
  { name: "Hip Thrust", muscleSlug: "glutes" },
  { name: "Leg Press Calf Raise", muscleSlug: "calves" },
  { name: "Seated Calf Raise", muscleSlug: "calves" },
  { name: "Standing Calf Raise", muscleSlug: "calves" },
  { name: "Ab Wheel Rollout", muscleSlug: "core" },
  { name: "Cable Crunch", muscleSlug: "core" },
  { name: "Dead Bug", muscleSlug: "core" },
  { name: "Hanging Knee Raise", muscleSlug: "core" },
  { name: "Plank", muscleSlug: "core" },
  { name: "Russian Twist", muscleSlug: "core" },
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
