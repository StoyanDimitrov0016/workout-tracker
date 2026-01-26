import { z } from "zod";

import { validateWeight } from "@/features/measurements/utils/weight";

export const weightEntrySchema = z.object({
  weightKg: z
    .string()
    .min(1, "Enter your weight.")
    .superRefine((value, ctx) => {
      const error = validateWeight(value);
      if (error) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
      }
    }),
});

export type WeightEntryFormValues = z.infer<typeof weightEntrySchema>;
