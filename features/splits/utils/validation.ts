import type {
  BuilderDay,
  BuilderExercise,
  BuilderSetTarget,
} from "@/features/splits/components/split-builder-types";

export type SetTargetFieldError = {
  reps?: string;
  restSec?: string;
};

export type ExerciseValidationResult = {
  errors: SetTargetFieldError[];
  hasErrors: boolean;
  invalidFieldCount: number;
};

function parsePositiveInteger(value: string) {
  const trimmed = value.trim();
  if (trimmed === "") return null;

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;

  return parsed;
}

export function validateSetTarget(setTarget: BuilderSetTarget): SetTargetFieldError {
  const errors: SetTargetFieldError = {};

  if (parsePositiveInteger(setTarget.reps) === null) {
    errors.reps = "Use a whole number above 0.";
  }

  if (parsePositiveInteger(setTarget.restSec) === null) {
    errors.restSec = "Use seconds above 0.";
  }

  return errors;
}

export function validateExerciseSetTargets(exercise: BuilderExercise): ExerciseValidationResult {
  const errors = exercise.setTargets.map(validateSetTarget);
  const invalidFieldCount = errors.reduce((count, error) => {
    let nextCount = count;
    if (error.reps) nextCount += 1;
    if (error.restSec) nextCount += 1;
    return nextCount;
  }, 0);

  return {
    errors,
    hasErrors: invalidFieldCount > 0,
    invalidFieldCount,
  };
}

export function validateTrainingDays(days: BuilderDay[]) {
  const errorsByExerciseKey = new Map<string, ExerciseValidationResult>();
  let totalInvalidFields = 0;

  days
    .filter((day) => day.isTraining)
    .forEach((day) => {
      day.exercises.forEach((exercise, exerciseIndex) => {
        const result = validateExerciseSetTargets(exercise);
        const key = `${day.weekday}-${exerciseIndex}`;
        errorsByExerciseKey.set(key, result);
        totalInvalidFields += result.invalidFieldCount;
      });
    });

  return {
    errorsByExerciseKey,
    hasErrors: totalInvalidFields > 0,
    totalInvalidFields,
  };
}

export function parseValidatedPositiveInteger(value: string) {
  const parsed = parsePositiveInteger(value);
  if (parsed === null) {
    throw new Error("Expected a validated positive integer.");
  }
  return parsed;
}
