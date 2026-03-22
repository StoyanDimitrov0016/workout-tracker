import { z } from "zod";

import type { Id } from "@/convex/_generated/dataModel";
import type { SplitInput } from "@/features/splits/components/split-builder-types";

const ExerciseIdSchema = z.custom<Id<"exercises">>(
  (value) => typeof value === "string" && value.length > 0,
  "Choose an exercise."
);

export const SplitSetTargetSchema = z.object({
  reps: z
    .number({ error: "Use a whole number above 0." })
    .int({ error: "Use a whole number above 0." })
    .positive({ error: "Use a whole number above 0." }),
  restSec: z
    .number({ error: "Use seconds above 0." })
    .int({ error: "Use seconds above 0." })
    .positive({ error: "Use seconds above 0." }),
});

export const SplitSchema: z.ZodType<SplitInput> = z.object({
  name: z.string().trim().min(1),
  days: z.array(
    z.object({
      weekday: z.number().int().min(1).max(7),
      title: z.string().trim().min(1),
      exercises: z.array(
        z.object({
          exerciseId: ExerciseIdSchema,
          exerciseName: z.string().trim().min(1),
          setTargets: z.array(SplitSetTargetSchema).min(1),
        })
      ),
    })
  ),
});
