import { z } from "zod";

const PositiveMeasurementSchema = z
  .number({ error: "Enter a valid number." })
  .gt(0, { error: "Enter a valid number." });

export const CircumferenceSchema = z.object({
  neckCm: PositiveMeasurementSchema,
  chestCm: PositiveMeasurementSchema,
  waistCm: PositiveMeasurementSchema,
  hipsCm: PositiveMeasurementSchema,
  upperArmLeftCm: PositiveMeasurementSchema,
  upperArmRightCm: PositiveMeasurementSchema,
  thighLeftCm: PositiveMeasurementSchema,
  thighRightCm: PositiveMeasurementSchema,
  forearmLeftCm: PositiveMeasurementSchema,
  forearmRightCm: PositiveMeasurementSchema,
  calfLeftCm: PositiveMeasurementSchema,
  calfRightCm: PositiveMeasurementSchema,
});

export type CircumferenceInput = z.infer<typeof CircumferenceSchema>;
