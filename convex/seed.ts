import { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";

const MUSCLES = [
  { slug: "chest", name: "Chest", sortOrder: 10 },
  { slug: "back", name: "Back", sortOrder: 20 },
  { slug: "shoulders", name: "Shoulders", sortOrder: 30 },
  { slug: "biceps", name: "Biceps", sortOrder: 40 },
  { slug: "triceps", name: "Triceps", sortOrder: 50 },
  { slug: "legs", name: "Legs", sortOrder: 60 },
  { slug: "glutes", name: "Glutes", sortOrder: 70 },
  { slug: "core", name: "Core", sortOrder: 80 },
] as const;

const EXERCISES = [
  { name: "Bench Press", muscleSlug: "chest" },
  { name: "Incline Dumbbell Press", muscleSlug: "chest" },
  { name: "Pull-up", muscleSlug: "back" },
  { name: "Barbell Row", muscleSlug: "back" },
  { name: "Overhead Press", muscleSlug: "shoulders" },
  { name: "Lateral Raise", muscleSlug: "shoulders" },
  { name: "Barbell Curl", muscleSlug: "biceps" },
  { name: "Triceps Pushdown", muscleSlug: "triceps" },
  { name: "Back Squat", muscleSlug: "legs" },
  { name: "Romanian Deadlift", muscleSlug: "legs" },
  { name: "Hip Thrust", muscleSlug: "glutes" },
  { name: "Plank", muscleSlug: "core" },
] as const;

export const musclesAndExercises = internalMutation(async (ctx) => {
  const muscleIdBySlug = new Map<string, Id<"muscles">>();

  for (const muscle of MUSCLES) {
    const existing = await ctx.db
      .query("muscles")
      .withIndex("by_slug", (q) => q.eq("slug", muscle.slug))
      .first();

    const muscleId = existing?._id ?? (await ctx.db.insert("muscles", muscle));
    muscleIdBySlug.set(muscle.slug, muscleId);
  }

  for (const exercise of EXERCISES) {
    const muscleId = muscleIdBySlug.get(exercise.muscleSlug);
    if (!muscleId) throw new Error(`Unknown muscle slug: ${exercise.muscleSlug}`);

    const existing = await ctx.db
      .query("exercises")
      .withIndex("by_name", (q) => q.eq("name", exercise.name))
      .first();

    if (!existing) {
      await ctx.db.insert("exercises", { name: exercise.name, muscleId });
    }
  }

  return { muscles: MUSCLES.length, exercises: EXERCISES.length };
});
