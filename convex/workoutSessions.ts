import { v } from "convex/values";

import { requireAuth } from "./auth";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import {
  buildCompletedSessionDetail,
  buildCompletedSessionSummary,
  buildNextPerformedSet,
  buildReopenedSessionDocument,
  buildSessionExercises,
  findExistingTrainingDaySession,
  getCurrentDateKey,
  getSessionTotals,
  getUpcomingTrainingDay,
  hasMeaningfulSessionProgress,
  updatePerformedSet,
} from "./workoutSessionDomain";

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

async function getExistingTrainingDaySession(
  ctx: MutationCtx | QueryCtx,
  userToken: string,
  weekday: number,
  trainingDateKey: string
) {
  const sessions = await ctx.db
    .query("workoutSessions")
    .withIndex("by_user", (q) => q.eq("userToken", userToken))
    .collect();

  return findExistingTrainingDaySession(sessions, weekday, trainingDateKey);
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

export const getUpcomingAvailability = query({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    const split = await ctx.db
      .query("splits")
      .withIndex("by_user", (q) => q.eq("userToken", userToken))
      .unique();

    if (!split) {
      return { status: "no_split" as const };
    }

    const upcomingDay = getUpcomingTrainingDay(split);
    if (!upcomingDay) {
      return { status: "no_training_day" as const };
    }

    const trainingDateKey = getCurrentDateKey();
    const existingSession = await getExistingTrainingDaySession(
      ctx,
      userToken,
      upcomingDay.weekday,
      trainingDateKey
    );

    if (existingSession?.status === "completed") {
      return {
        status: "completed_today" as const,
        sessionId: existingSession._id,
        day: upcomingDay,
      };
    }

    return {
      status: "available" as const,
      day: upcomingDay,
    };
  },
});

export const getStatisticsOverview = query({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_and_status", (q) => q.eq("userToken", userToken).eq("status", "completed"))
      .order("desc")
      .collect();

    const recentSessions = sessions.slice(0, 6).map(buildCompletedSessionSummary);

    const exerciseStatsMap = new Map<
      string,
      {
        exerciseId: Doc<"workoutSessions">["exercises"][number]["exerciseId"];
        exerciseName: string;
        sessions: number;
        totalSets: number;
        totalReps: number;
        totalVolumeKg: number;
        lastPerformedAt: number;
      }
    >();

    let totalSets = 0;
    let totalReps = 0;
    let totalVolumeKg = 0;
    let totalDurationMs = 0;
    let durationCount = 0;

    sessions.forEach((session) => {
      const totals = getSessionTotals(session);
      totalSets += totals.totalSets;
      totalReps += totals.totalReps;
      totalVolumeKg += totals.totalVolumeKg;

      if (session.completedAt !== undefined) {
        totalDurationMs += Math.max(session.completedAt - session.startedAt, 0);
        durationCount += 1;
      }

      session.exercises.forEach((exercise) => {
        const key = String(exercise.exerciseId);
        const current = exerciseStatsMap.get(key) ?? {
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          sessions: 0,
          totalSets: 0,
          totalReps: 0,
          totalVolumeKg: 0,
          lastPerformedAt: session.completedAt ?? session.startedAt,
        };

        current.sessions += 1;
        current.totalSets += exercise.performedSets.length;

        exercise.performedSets.forEach((set) => {
          if (set.reps !== null) {
            current.totalReps += set.reps;
          }
          if (set.reps !== null && set.weightKg !== null) {
            current.totalVolumeKg += set.reps * set.weightKg;
          }
        });

        current.lastPerformedAt = Math.max(
          current.lastPerformedAt,
          session.completedAt ?? session.startedAt
        );
        exerciseStatsMap.set(key, current);
      });
    });

    const topExercises = Array.from(exerciseStatsMap.values())
      .sort((a, b) => {
        if (b.sessions !== a.sessions) return b.sessions - a.sessions;
        if (b.totalSets !== a.totalSets) return b.totalSets - a.totalSets;
        return a.exerciseName.localeCompare(b.exerciseName);
      })
      .slice(0, 8);

    return {
      summary: {
        totalSessions: sessions.length,
        totalSets,
        totalReps,
        totalVolumeKg,
        averageSessionDurationMs: durationCount > 0 ? totalDurationMs / durationCount : null,
      },
      recentSessions,
      topExercises,
    };
  },
});

export const listCompleted = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_and_status", (q) => q.eq("userToken", userToken).eq("status", "completed"))
      .order("desc")
      .take(args.limit ?? 20);

    return sessions.map(buildCompletedSessionSummary);
  },
});

export const getLatestCompletedForWeekday = query({
  args: {
    weekday: v.number(),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_and_status", (q) => q.eq("userToken", userToken).eq("status", "completed"))
      .order("desc")
      .collect();

    const session = sessions.find((item) => item.weekday === args.weekday);
    if (!session) {
      return null;
    }

    return buildCompletedSessionSummary(session);
  },
});

export const getCompletedById = query({
  args: {
    sessionId: v.id("workoutSessions"),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const session = await ctx.db.get(args.sessionId);

    if (!session) return null;
    if (session.userToken !== userToken) throw new Error("Forbidden");
    if (session.status !== "completed") return null;

    return buildCompletedSessionDetail(session);
  },
});

export const startFromUpcomingDay = mutation({
  args: {},
  handler: async (ctx) => {
    const userToken = await requireAuth(ctx);
    const trainingDateKey = getCurrentDateKey();

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

    const existingSession = await getExistingTrainingDaySession(
      ctx,
      userToken,
      upcomingDay.weekday,
      trainingDateKey
    );

    if (existingSession?.status === "completed") {
      throw new Error("You already completed this planned workout today.");
    }

    return await ctx.db.insert("workoutSessions", {
      userToken,
      splitId: split._id,
      trainingDateKey,
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

    const nextSet = buildNextPerformedSet(exercise);

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
    if (!hasMeaningfulSessionProgress(session)) {
      throw new Error("Log at least one set or mark an exercise done before finishing.");
    }

    await ctx.db.patch(args.sessionId, {
      status: "completed",
      completedAt: Date.now(),
    });

    return args.sessionId;
  },
});

export const reopen = mutation({
  args: {
    sessionId: v.id("workoutSessions"),
  },
  handler: async (ctx, args) => {
    const userToken = await requireAuth(ctx);
    const session = await getOwnedSession(ctx, args.sessionId, userToken);

    const activeSession = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_and_status", (q) => q.eq("userToken", userToken).eq("status", "active"))
      .order("desc")
      .first();

    if (activeSession && activeSession._id !== session._id) {
      throw new Error("Finish or discard the active session before reopening another one.");
    }

    if (session.status === "active") {
      return session._id;
    }

    await ctx.db.replace(args.sessionId, buildReopenedSessionDocument(session));
    return args.sessionId;
  },
});
