import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  weightEntries: defineTable({
    userToken: v.string(),
    weightKg: v.number(),
  }).index("by_user_creationTime", ["userToken"]),
  circumferenceEntries: defineTable({
    userToken: v.string(),
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
  }).index("by_user_creationTime", ["userToken"]),
});
