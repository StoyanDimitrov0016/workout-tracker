import { useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { api } from "@/convex/_generated/api";
import { DayCard } from "@/features/splits/components/day-card";
import { WEEKDAYS } from "@/features/splits/constants/weekdays";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";

export default function TrainingSplitIndex() {
  const router = useRouter();
  const split = useQuery(api.splits.getMine);
  const exercises = useQuery(api.exercises.list);
  const muscles = useQuery(api.muscles.list);

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
      </ScreenWrapper>
    );
  }

  const daysByWeekday = new Map(split?.days.map((day) => [day.weekday, day]) ?? []);
  const exerciseById = new Map(exercises?.map((exercise) => [exercise._id, exercise]) ?? []);
  const muscleById = new Map(muscles?.map((muscle) => [muscle._id, muscle]) ?? []);

  return (
    <ScreenWrapper>
      <Stack.Screen
        options={{
          headerRight: split
            ? () => (
                <Pressable onPress={() => router.push("/training-split/edit")}>
                  <Text className="text-sm font-semibold text-primary">Edit</Text>
                </Pressable>
              )
            : undefined,
        }}
      />

      {split ? (
        <View className="gap-4">
          <View className="gap-1">
            <Text className="text-sm text-text-tertiary">Split name</Text>
            <Text className="text-2xl font-semibold text-text-primary">{split.name}</Text>
          </View>

          <View className="gap-3">
            <Text className="text-sm font-semibold text-text-secondary">Your week</Text>
            <View className="gap-3">
              {WEEKDAYS.map((day) => {
                const dayData = daysByWeekday.get(day.weekday);
                const totalSets =
                  dayData?.exercises.reduce((sum, exercise) => sum + exercise.sets, 0) ?? 0;
                const summary = dayData
                  ? `${dayData.exercises.length} exercises - ${totalSets} sets`
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
                    current.sets += exercise.sets;
                    current.reps += exercise.sets * exercise.reps;
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
