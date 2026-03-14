import { type Infer, v } from "convex/values";

import { requireAuth } from "./auth";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

const performedSetSchema = v.object({
  reps: v.union(v.number(), v.null()),
  weightKg: v.union(v.number(), v.null()),
  restSec: v.union(v.number(), v.null()),
});

const targetSetSchema = v.object({
  reps: v.number(),
  restSec: v.number(),
});

const sessionExerciseSchema = v.object({
  exerciseId: v.id("exercises"),
  exerciseName: v.string(),
  targetSets: v.array(targetSetSchema),
  performedSets: v.array(performedSetSchema),
  isDone: v.boolean(),
});

type SessionExercise = Infer<typeof sessionExerciseSchema>;
type PerformedSet = Infer<typeof performedSetSchema>;

function getUpcomingTrainingDay(split: Doc<"splits">) {
  const trainingDays = split.days.filter((day) => day.exercises.length > 0);
  if (trainingDays.length === 0) return null;

  const jsDay = new Date().getDay();
  const today = jsDay === 0 ? 7 : jsDay + 1;
  let candidate = trainingDays[0];
  let bestDelta = 7;

  trainingDays.forEach((day) => {
    const delta = (day.weekday - today + 7) % 7;
    if (delta < bestDelta) {
      candidate = day;
      bestDelta = delta;
    }
  });

  return candidate;
}

function buildPerformedSets(targetSets: SessionExercise["targetSets"]) {
  const safeTargetSets = targetSets.length > 0 ? targetSets : [{ reps: 0, restSec: 120 }];
  return safeTargetSets.map((target) => ({
    reps: target.reps,
    weightKg: null,
    restSec: target.restSec,
  }));
}

function buildSessionExercises(
  exercises: Doc<"splits">["days"][number]["exercises"]
): SessionExercise[] {
  return exercises.map((exercise) => ({
    exerciseId: exercise.exerciseId,
    exerciseName: exercise.exerciseName,
    targetSets: exercise.setTargets,
    performedSets: buildPerformedSets(exercise.setTargets),
    isDone: false,
  }));
}

async function getOwnedSession(
  ctx: MutationCtx,
  sessionId: Doc<"workoutSessions">["_id"],
  userToken: string
) {
  const session = await ctx.db.get(sessionId);
  if (!session) throw new Error("Session not found.");
  if (session.userToken !== userToken) throw new Error("Forbidden");
  return session;
}

function updatePerformedSet(
  performedSet: PerformedSet,
  next: {
    reps?: number | null;
    weightKg?: number | null;
    restSec?: number | null;
  }
) {
  return {
    reps: next.reps === undefined ? performedSet.reps : next.reps,
    weightKg: next.weightKg === undefined ? performedSet.weightKg : next.weightKg,
    restSec: next.restSec === undefined ? performedSet.restSec : next.restSec,
  };
}

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    return await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_and_status", (q) => q.eq("userToken", userToken).eq("status", "active"))
      .order("desc")
      .first();
  },
});

export const startFromUpcomingDay = mutation({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);

    const activeSession = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_and_status", (q) => q.eq("userToken", userToken).eq("status", "active"))
      .order("desc")
      .first();

    if (activeSession) {
      return activeSession._id;
    }

    const split = await ctx.db
      .query("splits")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .unique();

    if (!split) {
      throw new Error("Create a split before starting a session.");
    }

    const upcomingDay = getUpcomingTrainingDay(split);
    if (!upcomingDay) {
      throw new Error("Add exercises to your split before starting a session.");
    }

    return await ctx.db.insert("workoutSessions", {
      userToken,
      splitId: split._id,
      weekday: upcomingDay.weekday,
      title: upcomingDay.title.trim() || "Training",
      status: "active",
      startedAt: Date.now(),
      exercises: buildSessionExercises(upcomingDay.exercises),
    });
  },
});

export const updateExerciseSet = mutation({
  args: {
    sessionId: v.id("workoutSessions"),
    exerciseIndex: v.number(),
    setIndex: v.number(),
    reps: v.optional(v.union(v.number(), v.null())),
    weightKg: v.optional(v.union(v.number(), v.null())),
    restSec: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const session = await getOwnedSession(ctx, args.sessionId, userToken);

    if (session.status !== "active") throw new Error("Completed sessions cannot be edited.");

    const exercise = session.exercises[args.exerciseIndex];
    if (!exercise) throw new Error("Exercise not found.");
    const performedSet = exercise.performedSets[args.setIndex];
    if (!performedSet) throw new Error("Set not found.");

    const exercises = session.exercises.map((item, exerciseIndex) => {
      if (exerciseIndex !== args.exerciseIndex) return item;

      return {
        ...item,
        performedSets: item.performedSets.map((set, setIndex) =>
          setIndex === args.setIndex
            ? updatePerformedSet(set, {
                reps: args.reps,
                weightKg: args.weightKg,
                restSec: args.restSec,
              })
            : set
        ),
      };
    });

    await ctx.db.patch(args.sessionId, { exercises });
    return args.sessionId;
  },
});

export const addExerciseSet = mutation({
  args: {
    sessionId: v.id("workoutSessions"),
    exerciseIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const session = await getOwnedSession(ctx, args.sessionId, userToken);

    if (session.status !== "active") throw new Error("Completed sessions cannot be edited.");

    const exercise = session.exercises[args.exerciseIndex];
    if (!exercise) throw new Error("Exercise not found.");

    const nextTarget = exercise.targetSets[exercise.performedSets.length];
    const nextSet = nextTarget
      ? {
          reps: nextTarget.reps,
          weightKg: null,
          restSec: nextTarget.restSec,
        }
      : {
          reps: null,
          weightKg: null,
          restSec: null,
        };

    const exercises = session.exercises.map((item, exerciseIndex) =>
      exerciseIndex === args.exerciseIndex
        ? { ...item, performedSets: [...item.performedSets, nextSet] }
        : item
    );

    await ctx.db.patch(args.sessionId, { exercises });
    return args.sessionId;
  },
});

export const toggleExerciseDone = mutation({
  args: {
    sessionId: v.id("workoutSessions"),
    exerciseIndex: v.number(),
    isDone: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const session = await getOwnedSession(ctx, args.sessionId, userToken);

    if (session.status !== "active") throw new Error("Completed sessions cannot be edited.");
    if (!session.exercises[args.exerciseIndex]) throw new Error("Exercise not found.");

    const exercises = session.exercises.map((item, exerciseIndex) =>
      exerciseIndex === args.exerciseIndex ? { ...item, isDone: args.isDone } : item
    );

    await ctx.db.patch(args.sessionId, { exercises });
    return args.sessionId;
  },
});

export const finish = mutation({
  args: {
    sessionId: v.id("workoutSessions"),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const session = await getOwnedSession(ctx, args.sessionId, userToken);

    if (session.status !== "active") return args.sessionId;

    await ctx.db.patch(args.sessionId, {
      status: "completed",
      completedAt: Date.now(),
    });

    return args.sessionId;
  },
});
