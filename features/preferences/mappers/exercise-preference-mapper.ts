import type { ExercisePreferenceInput } from "@/features/preferences/schemas/exercise-preference-schema";

export type ExercisePreferenceFormValues = {
  referenceUrl: string;
  notes: string;
};

export const ExercisePreferenceMapper = {
  toInput(values: ExercisePreferenceFormValues): ExercisePreferenceInput {
    return {
      referenceUrl: values.referenceUrl.trim(),
      notes: values.notes.trim(),
    };
  },

  toFormValues(input: ExercisePreferenceInput | null): ExercisePreferenceFormValues {
    return {
      referenceUrl: input?.referenceUrl ?? "",
      notes: input?.notes ?? "",
    };
  },
};
