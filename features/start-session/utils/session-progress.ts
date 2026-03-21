import type { Doc } from "@/convex/_generated/dataModel";

type SessionSetDraft = {
  reps: string;
  weightKg: string;
  restSec: string;
};

type SessionEntryDraft = {
  isDone: boolean;
  sets: SessionSetDraft[];
};

function parseOptionalNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return null;

  return parsed;
}

function isLoggedDraftSet(
  set: SessionSetDraft,
  targetSet?: Doc<"workoutSessions">["exercises"][number]["targetSets"][number]
) {
  const weightKg = parseOptionalNumber(set.weightKg);
  const reps = parseOptionalNumber(set.reps);
  const restSec = parseOptionalNumber(set.restSec);

  if (weightKg !== null) {
    return true;
  }

  if (!targetSet) {
    return reps !== null || restSec !== null;
  }

  return reps !== targetSet.reps || restSec !== targetSet.restSec;
}

export function canFinishSession(
  session: Doc<"workoutSessions">,
  entries: Record<string, SessionEntryDraft>
) {
  return session.exercises.some((exercise, exerciseIndex) => {
    const entry = entries[String(exerciseIndex)];
    const isDone = entry?.isDone ?? exercise.isDone;

    if (isDone) {
      return true;
    }

    const sets = entry?.sets ?? [];
    return sets.some((set, setIndex) => isLoggedDraftSet(set, exercise.targetSets[setIndex]));
  });
}
