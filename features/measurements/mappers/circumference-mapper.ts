import { circumferenceFieldNames } from "@/features/measurements/constants/circumference-fields";
import type { CircumferenceInput } from "@/features/measurements/schemas/circumference-schema";
import { formatMeasurementValue } from "@/utils/format/measurement";
import { NumberMapper } from "@/utils/form/number-mapper";

export type CircumferenceFormValues = {
  neckCm: string;
  chestCm: string;
  waistCm: string;
  hipsCm: string;
  upperArmLeftCm: string;
  upperArmRightCm: string;
  thighLeftCm: string;
  thighRightCm: string;
  forearmLeftCm: string;
  forearmRightCm: string;
  calfLeftCm: string;
  calfRightCm: string;
};

export const CircumferenceMapper = {
  toInput(values: CircumferenceFormValues): CircumferenceInput {
    return circumferenceFieldNames.reduce((acc, key) => {
      acc[key] = NumberMapper.toNumber(values[key]);
      return acc;
    }, {} as CircumferenceInput);
  },

  toFormValues(input: CircumferenceInput | null): CircumferenceFormValues {
    if (!input) {
      return circumferenceFieldNames.reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {} as CircumferenceFormValues);
    }

    return circumferenceFieldNames.reduce((acc, key) => {
      acc[key] = formatMeasurementValue(input[key]);
      return acc;
    }, {} as CircumferenceFormValues);
  },
};
