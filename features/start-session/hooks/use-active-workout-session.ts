import { useEffect, useRef, useState } from "react";

import type { Doc, Id } from "@/convex/_generated/dataModel";
import { workoutSessionResource } from "@/features/start-session/data/workout-session-resource";
import { canFinishSession } from "@/features/start-session/utils/session-progress";
import {
  buildSessionEntryDrafts,
  getSessionExerciseKey,
  parseSessionDraftNumber,
  type SessionEntryDraft,
  type SessionSetDraft,
} from "@/features/start-session/utils/session-draft";
import { useToast } from "@/hooks/use-toast";

type PendingSetSave = {
  exerciseIndex: number;
  setIndex: number;
  set: SessionSetDraft;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useActiveWorkoutSession(session: Doc<"workoutSessions">) {
  const updateExerciseSet = workoutSessionResource.useUpdateSet();
  const addExerciseSet = workoutSessionResource.useAddSet();
  const toggleExerciseDone = workoutSessionResource.useToggleDone();
  const finishSession = workoutSessionResource.useFinish();
  const { showError } = useToast();

  const [entries, setEntries] = useState<Record<string, SessionEntryDraft>>(() =>
    buildSessionEntryDrafts(session)
  );
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
      reps: parseSessionDraftNumber(set.reps),
      weightKg: parseSessionDraftNumber(set.weightKg),
      restSec: parseSessionDraftNumber(set.restSec),
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
        showError(getErrorMessage(error, "Could not save session changes."));
      }
    }, 400);

    pendingTimeoutsRef.current.set(pendingKey, timeoutId);
  };

  const updateSetDraft = (exerciseIndex: number, setIndex: number, next: SessionSetDraft) => {
    setEntries((previous) => {
      const key = getSessionExerciseKey(exerciseIndex);
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
    const exercise = session.exercises[exerciseIndex];
    const currentEntry = entries[getSessionExerciseKey(exerciseIndex)];
    if (!exercise || !currentEntry) return;

    const nextTarget = exercise.targetSets[currentEntry.sets.length];
    const nextSet = nextTarget
      ? {
          reps: String(nextTarget.reps),
          weightKg: String(nextTarget.weightKg),
          restSec: String(nextTarget.restSec),
        }
      : { reps: "", weightKg: "0", restSec: "" };

    setEntries((previous) => ({
      ...previous,
      [getSessionExerciseKey(exerciseIndex)]: {
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
        [getSessionExerciseKey(exerciseIndex)]: currentEntry,
      }));
      showError(getErrorMessage(error, "Could not add a new set."));
    }
  };

  const toggleDone = async (exerciseIndex: number) => {
    const key = getSessionExerciseKey(exerciseIndex);
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
      showError(getErrorMessage(error, "Could not update exercise status."));
    }
  };

  const finish = async () => {
    setIsFinishing(true);

    try {
      await flushPendingSetSaves();
      await finishSession({ sessionId: session._id });
      return session._id;
    } catch (error) {
      showError(getErrorMessage(error, "Could not finish the session."));
      return null;
    } finally {
      setIsFinishing(false);
    }
  };

  return {
    canFinish: canFinishSession(session, entries),
    entries,
    isFinishing,
    updateSetDraft,
    addSet,
    toggleDone,
    finish,
  };
}
