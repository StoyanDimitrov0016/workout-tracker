import type {
  BuilderDay,
  BuilderExercise,
  BuilderSetTarget,
} from "@/features/splits/components/split-builder-types";
import { SplitMapper } from "@/features/splits/mappers/split-mapper";
import { SplitSetTargetSchema } from "@/features/splits/schemas/split-schema";

export type SetTargetFieldError = {
  reps?: string;
  restSec?: string;
};

export type ExerciseValidationResult = {
  errors: SetTargetFieldError[];
  hasErrors: boolean;
  invalidFieldCount: number;
};

export function validateSetTarget(setTarget: BuilderSetTarget): SetTargetFieldError {
  const result = SplitSetTargetSchema.safeParse(SplitMapper.toSetTargetInput(setTarget));
  if (result.success) {
    return {};
  }

  const errors: SetTargetFieldError = {};
  result.error.issues.forEach((issue) => {
    if (issue.path[0] === "reps") {
      errors.reps = issue.message;
    }
    if (issue.path[0] === "restSec") {
      errors.restSec = issue.message;
    }
  });

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
