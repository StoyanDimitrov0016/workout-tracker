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

  useReopen() {
    return useMutation(api.workoutSessions.reopen);
  },

  useStart() {
    return useMutation(api.workoutSessions.startFromUpcomingDay);
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

  useUpcomingAvailability() {
    return useQuery(api.workoutSessions.getUpcomingAvailability);
  },

  useUpdateSet() {
    return useMutation(api.workoutSessions.updateExerciseSet);
  },
};
