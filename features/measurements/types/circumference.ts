import type { CircumferenceField } from "@/features/measurements/constants/circumference-fields";

export type CircumferenceMutationInput = {
  [Key in CircumferenceField]: number;
};
