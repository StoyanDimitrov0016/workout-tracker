import type { Doc } from "./_generated/dataModel";

type WorkoutSessionDoc = Doc<"workoutSessions">;
type SplitDoc = Doc<"splits">;
type SessionExercise = WorkoutSessionDoc["exercises"][number];
type PerformedSet = SessionExercise["performedSets"][number];
type TargetSet = SessionExercise["targetSets"][number];

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function buildPerformedSets(targetSets: SessionExercise["targetSets"]) {
  const safeTargetSets = targetSets.length > 0 ? targetSets : [{ reps: 0, restSec: 120 }];
  return safeTargetSets.map((target) => ({
    reps: target.reps,
    weightKg: null,
    restSec: target.restSec,
  }));
}

function isLoggedSet(performedSet: PerformedSet, targetSet?: TargetSet) {
  if (performedSet.weightKg !== null) {
    return true;
  }

  if (!targetSet) {
    return performedSet.reps !== null || performedSet.restSec !== null;
  }

  return performedSet.reps !== targetSet.reps || performedSet.restSec !== targetSet.restSec;
}

export function getUpcomingTrainingDay(split: SplitDoc) {
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

export function getDateKeyFromTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

export function getCurrentDateKey() {
  return getDateKeyFromTimestamp(Date.now());
}

export function getDateBoundsFromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map((part) => Number.parseInt(part, 10));
  const start = new Date(year, month - 1, day).getTime();
  return {
    start,
    end: start + 24 * 60 * 60 * 1000,
  };
}

export function getSessionTrainingDateKey(session: WorkoutSessionDoc) {
  return session.trainingDateKey ?? getDateKeyFromTimestamp(session.startedAt);
}

export function buildSessionExercises(exercises: SplitDoc["days"][number]["exercises"]) {
  return exercises.map((exercise) => ({
    exerciseId: exercise.exerciseId,
    exerciseName: exercise.exerciseName,
    targetSets: exercise.setTargets,
    performedSets: buildPerformedSets(exercise.setTargets),
    isDone: false,
  }));
}

export function updatePerformedSet(
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

export function hasMeaningfulSessionProgress(session: WorkoutSessionDoc) {
  return session.exercises.some((exercise) => {
    if (exercise.isDone) {
      return true;
    }

    return exercise.performedSets.some((performedSet, setIndex) =>
      isLoggedSet(performedSet, exercise.targetSets[setIndex])
    );
  });
}

export function findExistingTrainingDaySession(
  sessions: WorkoutSessionDoc[],
  weekday: number,
  trainingDateKey: string
) {
  return (
    sessions.find(
      (session) =>
        getSessionTrainingDateKey(session) === trainingDateKey && session.weekday === weekday
    ) ?? null
  );
}

export function getSessionTotals(session: WorkoutSessionDoc) {
  let totalSets = 0;
  let totalReps = 0;
  let totalVolumeKg = 0;
  let doneExercises = 0;

  session.exercises.forEach((exercise) => {
    if (exercise.isDone) {
      doneExercises += 1;
    }

    totalSets += exercise.performedSets.length;

    exercise.performedSets.forEach((set) => {
      if (set.reps !== null) {
        totalReps += set.reps;
      }
      if (set.reps !== null && set.weightKg !== null) {
        totalVolumeKg += set.reps * set.weightKg;
      }
    });
  });

  return {
    doneExercises,
    totalSets,
    totalReps,
    totalVolumeKg,
  };
}

export function buildCompletedSessionSummary(session: WorkoutSessionDoc) {
  const totals = getSessionTotals(session);
  const durationMs =
    session.completedAt !== undefined ? Math.max(session.completedAt - session.startedAt, 0) : null;

  return {
    _id: session._id,
    title: session.title,
    weekday: session.weekday,
    startedAt: session.startedAt,
    completedAt: session.completedAt ?? null,
    exerciseCount: session.exercises.length,
    doneExercises: totals.doneExercises,
    totalSets: totals.totalSets,
    totalReps: totals.totalReps,
    totalVolumeKg: totals.totalVolumeKg,
    durationMs,
  };
}

function getExerciseTotals(exercise: SessionExercise) {
  return exercise.performedSets.reduce(
    (acc, set) => {
      acc.totalSets += 1;
      if (set.reps !== null) {
        acc.totalReps += set.reps;
      }
      if (set.reps !== null && set.weightKg !== null) {
        acc.totalVolumeKg += set.reps * set.weightKg;
      }
      return acc;
    },
    { totalSets: 0, totalReps: 0, totalVolumeKg: 0 }
  );
}

export function buildCompletedSessionDetail(session: WorkoutSessionDoc) {
  const totals = getSessionTotals(session);
  const durationMs =
    session.completedAt !== undefined ? Math.max(session.completedAt - session.startedAt, 0) : null;

  return {
    _id: session._id,
    title: session.title,
    weekday: session.weekday,
    startedAt: session.startedAt,
    completedAt: session.completedAt ?? null,
    durationMs,
    totalSets: totals.totalSets,
    totalReps: totals.totalReps,
    totalVolumeKg: totals.totalVolumeKg,
    doneExercises: totals.doneExercises,
    exerciseCount: session.exercises.length,
    exercises: session.exercises.map((exercise) => {
      const exerciseTotals = getExerciseTotals(exercise);

      return {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        isDone: exercise.isDone,
        targetSets: exercise.targetSets,
        performedSets: exercise.performedSets,
        totalSets: exerciseTotals.totalSets,
        totalReps: exerciseTotals.totalReps,
        totalVolumeKg: exerciseTotals.totalVolumeKg,
      };
    }),
  };
}

export function buildNextPerformedSet(exercise: SessionExercise) {
  const nextTarget = exercise.targetSets[exercise.performedSets.length];
  if (nextTarget) {
    return {
      reps: nextTarget.reps,
      weightKg: null,
      restSec: nextTarget.restSec,
    };
  }

  return {
    reps: null,
    weightKg: null,
    restSec: null,
  };
}

export function buildReopenedSessionDocument(
  session: WorkoutSessionDoc
): Omit<WorkoutSessionDoc, "_id" | "_creationTime"> {
  return {
    userToken: session.userToken,
    splitId: session.splitId,
    ...(session.trainingDateKey ? { trainingDateKey: session.trainingDateKey } : {}),
    weekday: session.weekday,
    title: session.title,
    status: "active",
    startedAt: session.startedAt,
    exercises: session.exercises,
  };
}
