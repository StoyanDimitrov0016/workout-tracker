import { z } from "zod";

import {
  MAX_WEIGHT_KG,
  MIN_WEIGHT_KG,
  WEIGHT_STEP_KG,
} from "@/features/measurements/constants/weight";

export const WeightEntrySchema = z.object({
  weightKg: z
    .number({ error: "Enter a valid weight." })
    .min(MIN_WEIGHT_KG, {
      error: `Enter a weight between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg.`,
    })
    .max(MAX_WEIGHT_KG, {
      error: `Enter a weight between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg.`,
    })
    .multipleOf(WEIGHT_STEP_KG, {
      error: `Use ${WEIGHT_STEP_KG} kg precision (e.g. 72.4).`,
    }),
});

export type WeightEntryInput = z.infer<typeof WeightEntrySchema>;
