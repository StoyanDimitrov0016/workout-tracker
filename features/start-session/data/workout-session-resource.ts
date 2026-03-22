import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export const workoutSessionResource = {
  useActive() {
    return useQuery(api.workoutSessions.getActive);
  },

  useAddSet() {
    return useMutation(api.workoutSessions.addExerciseSet);
  },

  useFinish() {
    return useMutation(api.workoutSessions.finish);
  },

  useLatestCompletedForWeekday(weekday: number | null) {
    return useQuery(
      api.workoutSessions.getLatestCompletedForWeekday,
      weekday !== null ? { weekday } : "skip"
    );
  },

  useReopen() {
    return useMutation(api.workoutSessions.reopen);
  },

  useStartPlannedDay() {
    return useMutation(api.workoutSessions.startFromPlannedDay);
  },

  useSummary(sessionId: Id<"workoutSessions"> | null) {
    return useQuery(
      api.workoutSessions.getCompletedById,
      sessionId !== null ? { sessionId } : "skip"
    );
  },

  useToggleDone() {
    return useMutation(api.workoutSessions.toggleExerciseDone);
  },

  usePlannedDayOptions() {
    return useQuery(api.workoutSessions.getPlannedDayOptions);
  },

  useUpdateSet() {
    return useMutation(api.workoutSessions.updateExerciseSet);
  },
};
