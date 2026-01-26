import { z } from "zod";

import { circumferenceFieldNames } from "@/features/measurements/constants/circumference-fields";
import { parseMeasurementInput } from "@/features/measurements/utils/parse-measurement-input";

export const circumferenceSchema = z
  .object({
    neckCm: z.string().min(1, "Required"),
    chestCm: z.string().min(1, "Required"),
    waistCm: z.string().min(1, "Required"),
    hipsCm: z.string().min(1, "Required"),
    upperArmLeftCm: z.string().min(1, "Required"),
    upperArmRightCm: z.string().min(1, "Required"),
    thighLeftCm: z.string().min(1, "Required"),
    thighRightCm: z.string().min(1, "Required"),
    forearmLeftCm: z.string().min(1, "Required"),
    forearmRightCm: z.string().min(1, "Required"),
    calfLeftCm: z.string().min(1, "Required"),
    calfRightCm: z.string().min(1, "Required"),
  })
  .superRefine((values, ctx) => {
    circumferenceFieldNames.forEach((name) => {
      const raw = values[name];
      const { value } = parseMeasurementInput(raw);
      if (Number.isNaN(value) || value <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [name],
          message: "Enter a valid number",
        });
      }
    });
  });

export type CircumferenceFormValues = z.infer<typeof circumferenceSchema>;
