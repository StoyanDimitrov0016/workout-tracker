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
  }).index("by_slug", ["slug"]),

  exercises: defineTable({
    name: v.string(),
    muscleId: v.id("muscles"),
  })
    .index("by_name", ["name"])
    .searchIndex("search_name", { searchField: "name" }),

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
            sets: v.number(),
            reps: v.number(),
            restSec: v.number(),
          })
        ),
      })
    ),
  }).index("by_user", ["userToken"]),
});
