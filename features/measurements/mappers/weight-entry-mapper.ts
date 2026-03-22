import type { WeightEntryInput } from "@/features/measurements/schemas/weight-entry-schema";
import { formatWeightKg } from "@/features/measurements/utils/weight";
import { NumberMapper } from "@/utils/form/number-mapper";

export type WeightEntryFormValues = {
  weightKg: string;
};

export const WeightEntryMapper = {
  toInput(values: WeightEntryFormValues): WeightEntryInput {
    return {
      weightKg: NumberMapper.toNumber(values.weightKg),
    };
  },

  toFormValues(input: WeightEntryInput | null): WeightEntryFormValues {
    return {
      weightKg: input ? formatWeightKg(input.weightKg) : "",
    };
  },
};
