import type { WeightEntryInput } from "@/features/measurements/schemas/weight-entry-schema";

export type WeightEntryFormValues = {
  weightKg: number | null;
};

export const WeightEntryMapper = {
  toInput(values: WeightEntryFormValues): WeightEntryInput {
    return {
      weightKg: values.weightKg ?? Number.NaN,
    };
  },

  toFormValues(input: WeightEntryInput | null): WeightEntryFormValues {
    return {
      weightKg: input?.weightKg ?? null,
    };
  },
};
