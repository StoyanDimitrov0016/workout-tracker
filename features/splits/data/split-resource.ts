import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const splitResource = {
  useExerciseSearch(text: string, limit = 20) {
    return useQuery(api.exercises.searchByName, { text, limit });
  },

  useExercises() {
    return useQuery(api.exercises.list);
  },

  useMine() {
    return useQuery(api.splits.getMine);
  },

  useMineWithDailyMuscleVolume() {
    return useQuery(api.splits.getMineWithDailyMuscleVolume);
  },

  useMuscles() {
    return useQuery(api.muscles.list);
  },

  useSave() {
    return useMutation(api.splits.saveMine);
  },
};
