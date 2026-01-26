export const circumferenceFieldNames = [
  "neckCm",
  "chestCm",
  "waistCm",
  "hipsCm",
  "upperArmLeftCm",
  "upperArmRightCm",
  "thighLeftCm",
  "thighRightCm",
  "forearmLeftCm",
  "forearmRightCm",
  "calfLeftCm",
  "calfRightCm",
] as const;

export type CircumferenceField = (typeof circumferenceFieldNames)[number];

export const circumferenceLabels: Record<CircumferenceField, string> = {
  neckCm: "Neck (cm)",
  chestCm: "Chest (cm)",
  waistCm: "Waist (cm)",
  hipsCm: "Hips (cm)",
  upperArmLeftCm: "Upper arm L (cm)",
  upperArmRightCm: "Upper arm R (cm)",
  thighLeftCm: "Thigh L (cm)",
  thighRightCm: "Thigh R (cm)",
  forearmLeftCm: "Forearm L (cm)",
  forearmRightCm: "Forearm R (cm)",
  calfLeftCm: "Calf L (cm)",
  calfRightCm: "Calf R (cm)",
};
