import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { splitResource } from "@/features/splits/data/split-resource";
import { formatSetTargetsSummary } from "@/features/splits/utils/targets";
import {
  useValidatedLocalSearchParam,
  weekdayParamSchema,
} from "@/hooks/use-validated-local-search-param";

export default function TrainingSplitDay() {
  const router = useRouter();
  const weekday = useValidatedLocalSearchParam("weekday", weekdayParamSchema);
  const split = splitResource.useMine();

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
      </ScreenWrapper>
    );
  }

  if (weekday === null) {
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
                  {formatSetTargetsSummary(exercise.setTargets)}
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
