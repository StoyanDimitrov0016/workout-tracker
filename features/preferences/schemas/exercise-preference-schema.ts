import { z } from "zod";

import { MAX_EXERCISE_NOTES_LENGTH } from "@/features/preferences/constants/exercise-preferences";

export const ExercisePreferenceSchema = z.object({
  referenceUrl: z.url(),
  notes: z
    .string()
    .trim()
    .max(MAX_EXERCISE_NOTES_LENGTH, {
      error: `Notes must be ${MAX_EXERCISE_NOTES_LENGTH} characters or fewer.`,
    }),
});

export type ExercisePreferenceInput = z.infer<typeof ExercisePreferenceSchema>;
