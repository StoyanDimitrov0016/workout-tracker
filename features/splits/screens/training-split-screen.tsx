import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { TrainingSplitScreenSkeleton } from "@/components/feedback/loading-skeleton";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { DayCard } from "@/features/splits/components/day-card";
import { WEEKDAYS } from "@/features/splits/constants/weekdays";
import { splitResource } from "@/features/splits/data/split-resource";
import { getSetCount, getTotalReps } from "@/features/splits/utils/targets";

export function TrainingSplitScreen() {
  const router = useRouter();
  const split = splitResource.useMine();
  const exercises = splitResource.useExercises();
  const muscles = splitResource.useMuscles();

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <TrainingSplitScreenSkeleton />
      </ScreenWrapper>
    );
  }

  const daysByWeekday = new Map(split?.days.map((day) => [day.weekday, day]) ?? []);
  const exerciseById = new Map(exercises?.map((exercise) => [exercise._id, exercise]) ?? []);
  const muscleById = new Map(muscles?.map((muscle) => [muscle._id, muscle]) ?? []);

  return (
    <ScreenWrapper>
      {split ? (
        <View className="gap-4">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-2xl font-semibold text-text-primary">{split.name}</Text>
            <Pressable onPress={() => router.push("/training-split/edit")}>
              <Text className="text-sm font-semibold text-primary">Edit</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            <Text className="text-sm font-semibold text-text-secondary">Your week</Text>
            <View className="gap-3">
              {WEEKDAYS.map((day) => {
                const dayData = daysByWeekday.get(day.weekday);
                const totals =
                  dayData?.exercises.reduce(
                    (acc, exercise) => {
                      acc.sets += getSetCount(exercise.setTargets);
                      acc.reps += getTotalReps(exercise.setTargets);
                      return acc;
                    },
                    { sets: 0, reps: 0 }
                  ) ?? { sets: 0, reps: 0 };
                const summary = dayData
                  ? `${dayData.exercises.length} exercises | ${totals.sets} sets | ${totals.reps} reps`
                  : "";
                const title = dayData?.title?.trim() || (dayData ? "Training" : "Rest");
                const isRest = !dayData;
                const tag = isRest ? "Rest" : "Train";
                const tagTone = isRest ? "rest" : "train";
                const details: string[] = [];

                if (dayData && exercises && muscles) {
                  const byMuscle = new Map<string, { sets: number; reps: number }>();

                  dayData.exercises.forEach((exercise) => {
                    const exerciseMeta = exerciseById.get(exercise.exerciseId);
                    const muscleName =
                      (exerciseMeta && muscleById.get(exerciseMeta.muscleId)?.name) || "Other";
                    const current = byMuscle.get(muscleName) ?? { sets: 0, reps: 0 };
                    current.sets += getSetCount(exercise.setTargets);
                    current.reps += getTotalReps(exercise.setTargets);
                    byMuscle.set(muscleName, current);
                  });

                  byMuscle.forEach((value, name) => {
                    details.push(`${name}: ${value.sets} sets, ${value.reps} reps`);
                  });
                }

                return (
                  <DayCard
                    key={day.weekday}
                    label={day.label}
                    title={title}
                    summary={summary}
                    compact={isRest}
                    details={details}
                    tag={tag}
                    tagTone={tagTone}
                    onPress={() => router.push(`/training-split/day/${day.weekday}`)}
                  />
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-xl font-semibold text-text-primary">Create your plan</Text>
          <Pressable
            onPress={() => router.push("/training-split/create")}
            className="rounded-xl bg-primary px-4 py-3"
          >
            <Text className="font-semibold text-white">Create split</Text>
          </Pressable>
        </View>
      )}
    </ScreenWrapper>
  );
}
