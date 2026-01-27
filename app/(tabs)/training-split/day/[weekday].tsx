import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";

export default function TrainingSplitDay() {
  const router = useRouter();
  const params = useLocalSearchParams<{ weekday?: string }>();
  const weekday = Number(params.weekday);
  const split = useQuery(api.splits.getMine);

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
      </ScreenWrapper>
    );
  }

  if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7) {
    return (
      <ScreenWrapper>
        <Text className="text-lg font-semibold text-text-primary">Invalid weekday.</Text>
      </ScreenWrapper>
    );
  }

  if (!split) {
    return (
      <ScreenWrapper>
        <Stack.Screen options={{ title: weekdayToLabel(weekday) }} />
        <View className="gap-3">
          <Text className="text-lg font-semibold text-text-primary">No plan yet</Text>
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

  const day = split.days.find((item) => item.weekday === weekday);

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: weekdayToLabel(weekday) }} />
      <View className="gap-4">
        <View>
          <Text className="text-sm text-text-tertiary">{weekdayToLabel(weekday)}</Text>
          <Text className="text-2xl font-semibold text-text-primary">
            {day?.title?.trim() || (day ? "Training" : "Rest day")}
          </Text>
        </View>

        {day && day.exercises.length > 0 ? (
          <View className="gap-3">
            {day.exercises.map((exercise, index) => (
              <View
                key={`${exercise.exerciseId}-${index}`}
                className="rounded-xl border border-border bg-card p-4"
              >
                <Text className="text-base font-semibold text-text-primary">
                  {exercise.exerciseName}
                </Text>
                <Text className="text-sm text-text-tertiary">
                  {exercise.sets} x {exercise.reps} - {exercise.restSec}s rest
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-sm text-text-tertiary">Rest day.</Text>
        )}
      </View>
    </ScreenWrapper>
  );
}
