import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { splitResource } from "@/features/splits/data/split-resource";
import { TrainingSplitDayContent } from "@/features/splits/components/training-split-day-content";
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
      <TrainingSplitDayContent weekday={weekday} day={day} />
    </ScreenWrapper>
  );
}
