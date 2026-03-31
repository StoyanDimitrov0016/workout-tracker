import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const preferencesResource = {
  useExercisePreferences() {
    return useQuery(api.exercisePreferences.listMine);
  },

  useSaveExercisePreference() {
    return useMutation(api.exercisePreferences.saveMine);
  },
};
