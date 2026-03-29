import { WEEKDAYS } from "@/features/splits/constants/weekdays";
import type {
  BuilderDay,
  BuilderExercise,
  BuilderSetTarget,
  SplitFormValues,
  SplitInput,
} from "@/features/splits/components/split-builder-types";
import { NumberMapper } from "@/utils/form/number-mapper";

const DEFAULT_SET_TARGET: BuilderSetTarget = { reps: "", weightKg: "0", restSec: "120" };

function ensureSetTargets(setTargets: BuilderSetTarget[]) {
  return setTargets.length > 0 ? setTargets : [{ ...DEFAULT_SET_TARGET }];
}

function mapExerciseToBuilderExercise(
  exercise: SplitInput["days"][number]["exercises"][number]
): BuilderExercise {
  return {
    exerciseId: exercise.exerciseId,
    exerciseName: exercise.exerciseName,
    setTargets: ensureSetTargets(
      exercise.setTargets.map((target) => ({
        reps: String(target.reps),
        weightKg: String(target.weightKg ?? 0),
        restSec: String(target.restSec),
      }))
    ),
  };
}

export const SplitMapper = {
  toInput(values: SplitFormValues): SplitInput {
    return {
      name: values.name.trim() || "My Split",
      days: values.days
        .filter((day) => day.isTraining)
        .map((day) => ({
          weekday: day.weekday,
          title: day.title.trim() || "Training",
          exercises: day.exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            setTargets: exercise.setTargets.map((setTarget) => ({
              reps: NumberMapper.toNumber(setTarget.reps),
              weightKg: NumberMapper.toNumber(setTarget.weightKg),
              restSec: NumberMapper.toNumber(setTarget.restSec),
            })),
          })),
        })),
    };
  },

  toFormValues(input: SplitInput | null): SplitFormValues {
    const daysByWeekday = new Map(input?.days.map((day) => [day.weekday, day]) ?? []);

    return {
      name: input?.name ?? "",
      days: WEEKDAYS.map((weekday) => {
        const day = daysByWeekday.get(weekday.weekday);

        return {
          weekday: weekday.weekday,
          label: weekday.label,
          isTraining: Boolean(day),
          title: day?.title ?? "",
          exercises: day ? day.exercises.map(mapExerciseToBuilderExercise) : [],
        };
      }),
    };
  },

  toSetTargetInput(setTarget: BuilderSetTarget) {
    return {
      reps: NumberMapper.toNumber(setTarget.reps),
      weightKg: NumberMapper.toNumber(setTarget.weightKg),
      restSec: NumberMapper.toNumber(setTarget.restSec),
    };
  },
};
