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
    return {
      neckCm: NumberMapper.toNumber(values.neckCm),
      chestCm: NumberMapper.toNumber(values.chestCm),
      waistCm: NumberMapper.toNumber(values.waistCm),
      hipsCm: NumberMapper.toNumber(values.hipsCm),
      upperArmLeftCm: NumberMapper.toNumber(values.upperArmLeftCm),
      upperArmRightCm: NumberMapper.toNumber(values.upperArmRightCm),
      thighLeftCm: NumberMapper.toNumber(values.thighLeftCm),
      thighRightCm: NumberMapper.toNumber(values.thighRightCm),
      forearmLeftCm: NumberMapper.toNumber(values.forearmLeftCm),
      forearmRightCm: NumberMapper.toNumber(values.forearmRightCm),
      calfLeftCm: NumberMapper.toNumber(values.calfLeftCm),
      calfRightCm: NumberMapper.toNumber(values.calfRightCm),
    };
  },

  toFormValues(input: CircumferenceInput | null): CircumferenceFormValues {
    if (!input) {
      return circumferenceFieldNames.reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {} as CircumferenceFormValues);
    }

    return {
      neckCm: formatMeasurementValue(input.neckCm),
      chestCm: formatMeasurementValue(input.chestCm),
      waistCm: formatMeasurementValue(input.waistCm),
      hipsCm: formatMeasurementValue(input.hipsCm),
      upperArmLeftCm: formatMeasurementValue(input.upperArmLeftCm),
      upperArmRightCm: formatMeasurementValue(input.upperArmRightCm),
      thighLeftCm: formatMeasurementValue(input.thighLeftCm),
      thighRightCm: formatMeasurementValue(input.thighRightCm),
      forearmLeftCm: formatMeasurementValue(input.forearmLeftCm),
      forearmRightCm: formatMeasurementValue(input.forearmRightCm),
      calfLeftCm: formatMeasurementValue(input.calfLeftCm),
      calfRightCm: formatMeasurementValue(input.calfRightCm),
    };
  },
};
