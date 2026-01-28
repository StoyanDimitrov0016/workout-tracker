import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { jsDayToWeekday, weekdayToLabel } from "@/features/splits/constants/weekdays";

export default function OverviewScreen() {
  const router = useRouter();
  const split = useQuery(api.splits.getMineWithDailyMuscleVolume);

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
      </ScreenWrapper>
    );
  }

  if (!split) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-xl font-semibold text-text-primary">Create your plan</Text>
          <Pressable
            onPress={() => router.push("/training-split/create")}
            className="rounded-xl bg-primary px-4 py-3"
          >
            <Text className="font-semibold text-white">Create split</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  const today = jsDayToWeekday(new Date().getDay());
  const trainingDays = split.days.filter((day) => day.exercises.length > 0);
  if (trainingDays.length === 0) {
    return (
      <ScreenWrapper>
        <View className="gap-2">
          <Text className="text-sm text-text-tertiary">Plan overview</Text>
          <Text className="text-2xl font-semibold text-text-primary">{split.name}</Text>
          <Text className="text-sm text-text-tertiary">
            You do not have any training days with exercises yet.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  let upcomingWeekday = today;
  let upcomingDelta = 7;

  trainingDays.forEach((day) => {
    const delta = (day.weekday - today + 7) % 7;
    if (delta < upcomingDelta) {
      upcomingWeekday = day.weekday;
      upcomingDelta = delta;
    }
  });

  const orderedDays = trainingDays
    .map((day) => ({
      day,
      delta: (day.weekday - upcomingWeekday + 7) % 7,
    }))
    .sort((a, b) => a.delta - b.delta)
    .map((entry) => entry.day);

  return (
    <ScreenWrapper>
      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-sm text-text-tertiary">Plan overview</Text>
          <Text className="text-2xl font-semibold text-text-primary">{split.name}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4">
            {orderedDays.map((day, index) => {
              const dayTitle = day.title?.trim() || "Training";
              const exercises = day.exercises ?? [];
              const muscleLine =
                day.setsByMuscle.map((item) => `${item.muscleName} ${item.sets}`).join(", ") ??
                "";
              const tagLabel = index === 0 ? (upcomingDelta === 0 ? "Today" : "Up next") : null;

              return (
                <View
                  key={day.weekday}
                  className="w-80 gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-text-secondary">
                      {weekdayToLabel(day.weekday)}
                    </Text>
                    {tagLabel ? (
                      <View className="rounded-full bg-primary px-2 py-0.5">
                        <Text className="text-[10px] font-semibold text-white">{tagLabel}</Text>
                      </View>
                    ) : null}
                  </View>

                  <View className="gap-1">
                    <Text className="text-lg font-semibold text-text-primary">{dayTitle}</Text>
                    <Text className="text-xs text-text-tertiary">
                      {exercises.length} exercises
                    </Text>
                  </View>

                  <View className="gap-2">
                    {exercises.length > 0 ? (
                      exercises.map((exercise, exerciseIndex) => (
                        <View
                          key={`${exercise.exerciseId}-${exerciseIndex}`}
                          className="gap-1"
                        >
                          <Text className="text-sm font-semibold text-text-primary">
                            {exercise.exerciseName}
                          </Text>
                          <Text className="text-xs text-text-tertiary">
                            {exercise.sets} x {exercise.reps} • {exercise.restSec}s rest
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text className="text-sm text-text-tertiary">Rest day.</Text>
                    )}
                  </View>

                  <View className="gap-1 border-t border-border pt-3">
                    <Text className="text-xs font-semibold text-text-secondary">
                      Muscle groups
                    </Text>
                    {muscleLine ? (
                      <Text className="text-xs text-text-tertiary">{muscleLine}</Text>
                    ) : (
                      <Text className="text-xs text-text-tertiary">
                        No volume recorded yet.
                      </Text>
                    )}
                    <Text className="text-xs text-text-tertiary">
                      Total sets: {day.totalSets}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
