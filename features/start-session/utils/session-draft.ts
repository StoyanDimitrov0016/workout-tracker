import type { Doc } from "@/convex/_generated/dataModel";
import { formatWeightKg } from "@/utils/format/weight";

export type SessionSetDraft = {
  reps: string;
  weightKg: string;
  restSec: string;
};

export type SessionEntryDraft = {
  isDone: boolean;
  sets: SessionSetDraft[];
};

export function formatDraftNumber(value: number | null) {
  if (value === null) return "";
  return String(value);
}

export function buildSessionEntryDrafts(session: Doc<"workoutSessions">) {
  return session.exercises.reduce<Record<string, SessionEntryDraft>>(
    (acc, exercise, exerciseIndex) => {
      acc[String(exerciseIndex)] = {
        isDone: exercise.isDone,
        sets: exercise.performedSets.map((set) => ({
          reps: formatDraftNumber(set.reps),
          weightKg: set.weightKg === null ? "" : formatWeightKg(set.weightKg),
          restSec: formatDraftNumber(set.restSec),
        })),
      };

      return acc;
    },
    {}
  );
}

export function parseSessionDraftNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return null;

  return parsed;
}

export function getSessionExerciseKey(exerciseIndex: number) {
  return String(exerciseIndex);
}
