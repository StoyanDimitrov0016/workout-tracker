import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  weights: defineTable({
    userToken: v.string(),
    weightKg: v.number(),
  }).index("by_user", ["userToken"]),

  circumferences: defineTable({
    userToken: v.string(),
    neckCm: v.number(),
    chestCm: v.number(),
    waistCm: v.number(),
    hipsCm: v.number(),
    upperArmLeftCm: v.number(),
    upperArmRightCm: v.number(),
    forearmLeftCm: v.number(),
    forearmRightCm: v.number(),
    thighLeftCm: v.number(),
    thighRightCm: v.number(),
    calfLeftCm: v.number(),
    calfRightCm: v.number(),
  }).index("by_user", ["userToken"]),

  muscles: defineTable({
    slug: v.string(),
    name: v.string(),
    sortOrder: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_sortOrder", ["sortOrder"]),

  exercises: defineTable({
    name: v.string(),
    muscleId: v.id("muscles"),
  })
    .index("by_name", ["name"])
    .searchIndex("search_name", { searchField: "name" }),

  exercisePreferences: defineTable({
    userToken: v.string(),
    exerciseId: v.id("exercises"),
    referenceUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userToken"])
    .index("by_user_and_exercise", ["userToken", "exerciseId"]),

  splits: defineTable({
    userToken: v.string(),
    name: v.string(),
    days: v.array(
      v.object({
        weekday: v.number(),
        title: v.string(),
        exercises: v.array(
          v.object({
            exerciseId: v.id("exercises"),
            exerciseName: v.string(),
            setTargets: v.array(
              v.object({
                reps: v.number(),
                weightKg: v.number(),
                restSec: v.number(),
              })
            ),
          })
        ),
      })
    ),
  }).index("by_user", ["userToken"]),

  workoutSessions: defineTable({
    userToken: v.string(),
    splitId: v.optional(v.id("splits")),
    trainingDateKey: v.optional(v.string()),
    weekday: v.number(),
    title: v.string(),
    status: v.union(v.literal("active"), v.literal("completed")),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    exercises: v.array(
      v.object({
        exerciseId: v.id("exercises"),
        exerciseName: v.string(),
        targetSets: v.array(
          v.object({
            reps: v.number(),
            weightKg: v.number(),
            restSec: v.number(),
          })
        ),
        performedSets: v.array(
          v.object({
            reps: v.union(v.number(), v.null()),
            weightKg: v.union(v.number(), v.null()),
            restSec: v.union(v.number(), v.null()),
          })
        ),
        isDone: v.boolean(),
      })
    ),
  })
    .index("by_user", ["userToken"])
    .index("by_user_and_status", ["userToken", "status"])
    .index("by_user_and_startedAt", ["userToken", "startedAt"])
    .index("by_user_status_weekday_startedAt", ["userToken", "status", "weekday", "startedAt"]),
});
