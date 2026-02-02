export type SetTarget = {
  reps: number;
  restSec: number;
};

function formatNumber(value: number) {
  if (Number.isInteger(value)) return String(value);
  const fixed = value.toFixed(1);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
}

function summarizeValues(values: number[]) {
  if (values.length === 0) return null;
  const normalized = values.map((value) => (Number.isNaN(value) ? null : formatNumber(value)));
  if (normalized.every((value) => value === null)) return null;
  const filled = normalized.map((value) => value ?? "?");
  const allSame = filled.every((value) => value === filled[0]);
  return allSame ? filled[0] : filled.join("/");
}

function formatUnitSummary(values: number[], unit: string) {
  const summary = summarizeValues(values);
  if (!summary) return null;
  return `${summary}${unit}`;
}

export function getSetCount(setTargets: SetTarget[]) {
  return setTargets.length;
}

export function getTotalReps(setTargets: SetTarget[]) {
  return setTargets.reduce((sum, set) => sum + set.reps, 0);
}

export function formatSetTargetsSummary(setTargets: SetTarget[]) {
  if (setTargets.length === 0) return "No targets";

  const parts = [`${setTargets.length} sets`];
  const repsSummary = summarizeValues(setTargets.map((set) => set.reps));
  const restSummary = formatUnitSummary(
    setTargets.map((set) => set.restSec),
    "s"
  );

  if (repsSummary) {
    parts.push(`reps ${repsSummary}`);
  }

  if (restSummary) {
    parts.push(`rest ${restSummary}`);
  }

  return parts.join(" | ");
}
