import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { formatWeightKg } from "@/features/measurements/utils/weight";

type SessionSetDraft = {
  reps: string;
  weightKg: string;
  restSec: string;
};

type SessionEntryDraft = {
  isDone: boolean;
  sets: SessionSetDraft[];
};

type PendingSetSave = {
  exerciseIndex: number;
  setIndex: number;
  set: SessionSetDraft;
};

function formatDraftNumber(value: number | null) {
  if (value === null) return "";
  return String(value);
}

function buildEntries(session: Doc<"workoutSessions">) {
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

function parseOptionalNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return null;

  return parsed;
}

function getExerciseKey(exerciseIndex: number) {
  return String(exerciseIndex);
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useActiveWorkoutSession(session: Doc<"workoutSessions">) {
  const updateExerciseSet = useMutation(api.workoutSessions.updateExerciseSet);
  const addExerciseSet = useMutation(api.workoutSessions.addExerciseSet);
  const toggleExerciseDone = useMutation(api.workoutSessions.toggleExerciseDone);
  const finishSession = useMutation(api.workoutSessions.finish);

  const [entries, setEntries] = useState<Record<string, SessionEntryDraft>>(() =>
    buildEntries(session)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const pendingSetSavesRef = useRef<Map<string, PendingSetSave>>(new Map());
  const pendingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const pendingTimeouts = pendingTimeoutsRef.current;
    const pendingSetSaves = pendingSetSavesRef.current;

    return () => {
      pendingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      pendingTimeouts.clear();
      pendingSetSaves.clear();
    };
  }, []);

  const persistSet = async (
    sessionId: Id<"workoutSessions">,
    exerciseIndex: number,
    setIndex: number,
    set: SessionSetDraft
  ) => {
    await updateExerciseSet({
      sessionId,
      exerciseIndex,
      setIndex,
      reps: parseOptionalNumber(set.reps),
      weightKg: parseOptionalNumber(set.weightKg),
      restSec: parseOptionalNumber(set.restSec),
    });
  };

  const clearPendingSave = (pendingKey: string) => {
    const timeoutId = pendingTimeoutsRef.current.get(pendingKey);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    pendingTimeoutsRef.current.delete(pendingKey);
    pendingSetSavesRef.current.delete(pendingKey);
  };

  const flushPendingSetSaves = async () => {
    const pendingKeys = Array.from(pendingSetSavesRef.current.keys());
    const pendingSaves = pendingKeys
      .map((key) => pendingSetSavesRef.current.get(key))
      .filter((save): save is PendingSetSave => save !== undefined);

    pendingKeys.forEach((key) => clearPendingSave(key));

    for (const pendingSave of pendingSaves) {
      await persistSet(
        session._id,
        pendingSave.exerciseIndex,
        pendingSave.setIndex,
        pendingSave.set
      );
    }
  };

  const scheduleSetSave = (exerciseIndex: number, setIndex: number, set: SessionSetDraft) => {
    const pendingKey = `${exerciseIndex}-${setIndex}`;
    const existingTimeout = pendingTimeoutsRef.current.get(pendingKey);

    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    pendingSetSavesRef.current.set(pendingKey, { exerciseIndex, setIndex, set });

    const timeoutId = setTimeout(async () => {
      pendingTimeoutsRef.current.delete(pendingKey);
      const pendingSave = pendingSetSavesRef.current.get(pendingKey);

      if (!pendingSave) return;

      pendingSetSavesRef.current.delete(pendingKey);

      try {
        await persistSet(
          session._id,
          pendingSave.exerciseIndex,
          pendingSave.setIndex,
          pendingSave.set
        );
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Could not save session changes."));
      }
    }, 400);

    pendingTimeoutsRef.current.set(pendingKey, timeoutId);
  };

  const updateSetDraft = (exerciseIndex: number, setIndex: number, next: SessionSetDraft) => {
    setErrorMessage(null);
    setEntries((previous) => {
      const key = getExerciseKey(exerciseIndex);
      const currentEntry = previous[key];
      if (!currentEntry) return previous;

      return {
        ...previous,
        [key]: {
          ...currentEntry,
          sets: currentEntry.sets.map((set, index) => (index === setIndex ? next : set)),
        },
      };
    });

    scheduleSetSave(exerciseIndex, setIndex, next);
  };

  const addSet = async (exerciseIndex: number) => {
    setErrorMessage(null);

    const exercise = session.exercises[exerciseIndex];
    const currentEntry = entries[getExerciseKey(exerciseIndex)];
    if (!exercise || !currentEntry) return;

    const nextTarget = exercise.targetSets[currentEntry.sets.length];
    const nextSet = nextTarget
      ? {
          reps: String(nextTarget.reps),
          weightKg: "",
          restSec: String(nextTarget.restSec),
        }
      : { reps: "", weightKg: "", restSec: "" };

    setEntries((previous) => ({
      ...previous,
      [getExerciseKey(exerciseIndex)]: {
        ...currentEntry,
        sets: [...currentEntry.sets, nextSet],
      },
    }));

    try {
      await addExerciseSet({
        sessionId: session._id,
        exerciseIndex,
      });
    } catch (error) {
      setEntries((previous) => ({
        ...previous,
        [getExerciseKey(exerciseIndex)]: currentEntry,
      }));
      setErrorMessage(getErrorMessage(error, "Could not add a new set."));
    }
  };

  const toggleDone = async (exerciseIndex: number) => {
    setErrorMessage(null);

    const key = getExerciseKey(exerciseIndex);
    const currentEntry = entries[key];
    if (!currentEntry) return;

    const nextIsDone = !currentEntry.isDone;

    setEntries((previous) => ({
      ...previous,
      [key]: {
        ...currentEntry,
        isDone: nextIsDone,
      },
    }));

    try {
      await flushPendingSetSaves();
      await toggleExerciseDone({
        sessionId: session._id,
        exerciseIndex,
        isDone: nextIsDone,
      });
    } catch (error) {
      setEntries((previous) => ({
        ...previous,
        [key]: currentEntry,
      }));
      setErrorMessage(getErrorMessage(error, "Could not update exercise status."));
    }
  };

  const finish = async () => {
    setErrorMessage(null);
    setIsFinishing(true);

    try {
      await flushPendingSetSaves();
      await finishSession({ sessionId: session._id });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Could not finish the session."));
    } finally {
      setIsFinishing(false);
    }
  };

  return {
    entries,
    errorMessage,
    isFinishing,
    updateSetDraft,
    addSet,
    toggleDone,
    finish,
  };
}
