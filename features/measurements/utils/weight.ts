import {
  MAX_WEIGHT_KG,
  MIN_WEIGHT_KG,
  WEIGHT_STEP_KG,
} from "@/features/measurements/constants/weight";

export function clampWeight(value: number) {
  return Math.min(Math.max(value, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
}

export function formatWeightKg(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
}

export function parseWeightKg(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);

  if (Number.isNaN(parsed)) return null;
  return parsed;
}

export function validateWeight(value: string) {
  const parsed = parseWeightKg(value);
  if (parsed === null) return "Enter a valid number.";
  if (parsed < MIN_WEIGHT_KG || parsed > MAX_WEIGHT_KG) {
    return `Enter a weight between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg.`;
  }
  if (Math.round(parsed * 10) / 10 !== parsed) {
    return `Use ${WEIGHT_STEP_KG} kg precision (e.g. 72.4).`;
  }
  return null;
}
