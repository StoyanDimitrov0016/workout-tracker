import type { Doc } from "@/convex/_generated/dataModel";
import {
  parseSessionDraftNumber,
  type SessionEntryDraft,
  type SessionSetDraft,
} from "@/features/start-session/utils/session-draft";

function isLoggedDraftSet(
  set: SessionSetDraft,
  targetSet?: Doc<"workoutSessions">["exercises"][number]["targetSets"][number]
) {
  const weightKg = parseSessionDraftNumber(set.weightKg);
  const reps = parseSessionDraftNumber(set.reps);
  const restSec = parseSessionDraftNumber(set.restSec);

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
