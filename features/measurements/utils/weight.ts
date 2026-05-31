import { MAX_WEIGHT_KG, MIN_WEIGHT_KG } from "@/features/measurements/constants/weight";
import { formatWeightKg } from "@/utils/format/weight";

export function clampWeight(value: number) {
  return Math.min(Math.max(value, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
}

export { formatWeightKg };
