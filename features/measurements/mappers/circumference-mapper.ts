import { circumferenceFieldNames } from "@/features/measurements/constants/circumference-fields";
import type { CircumferenceInput } from "@/features/measurements/schemas/circumference-schema";

export type CircumferenceFormValues = Record<keyof CircumferenceInput, number | null>;

export const CircumferenceMapper = {
  toInput(values: CircumferenceFormValues): CircumferenceInput {
    return circumferenceFieldNames.reduce((acc, key) => {
      acc[key] = values[key] ?? Number.NaN;
      return acc;
    }, {} as CircumferenceInput);
  },

  toFormValues(input: CircumferenceInput | null): CircumferenceFormValues {
    if (!input) {
      return circumferenceFieldNames.reduce((acc, key) => {
        acc[key] = null;
        return acc;
      }, {} as CircumferenceFormValues);
    }

    return circumferenceFieldNames.reduce((acc, key) => {
      acc[key] = input[key];
      return acc;
    }, {} as CircumferenceFormValues);
  },
};
