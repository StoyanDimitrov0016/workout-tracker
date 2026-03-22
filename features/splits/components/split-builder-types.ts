import type { Id } from "@/convex/_generated/dataModel";

export type SplitSetTargetInput = {
  reps: number;
  restSec: number;
};

export type SplitExerciseInput = {
  exerciseId: Id<"exercises">;
  exerciseName: string;
  setTargets: SplitSetTargetInput[];
};

export type SplitDayInput = {
  weekday: number;
  title: string;
  exercises: SplitExerciseInput[];
};

export type SplitInput = {
  name: string;
  days: SplitDayInput[];
};

export type SplitFormValues = {
  name: string;
  days: BuilderDay[];
};

export type BuilderSetTarget = {
  reps: string;
  restSec: string;
};

export type BuilderExercise = {
  exerciseId: Id<"exercises">;
  exerciseName: string;
  setTargets: BuilderSetTarget[];
};

export type BuilderDay = {
  weekday: number;
  label: string;
  isTraining: boolean;
  title: string;
  exercises: BuilderExercise[];
};
