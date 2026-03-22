import { Stack } from "expo-router";
import { Text } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { statisticsResource } from "@/features/statistics/data/statistics-resource";
import { WorkoutSessionDetailContent } from "@/features/statistics/components/workout-session-detail-content";
import {
  convexIdParamSchema,
  useValidatedLocalSearchParam,
} from "@/hooks/use-validated-local-search-param";

export default function WorkoutSessionDetailScreen() {
  const sessionId = useValidatedLocalSearchParam("sessionId", convexIdParamSchema<"workoutSessions">());
  const session = statisticsResource.useSessionDetail(sessionId);

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: "Workout", headerTitle: "Workout" }} />

      {sessionId === null ? (
        <Text className="text-text-secondary">Invalid session.</Text>
      ) : session === undefined ? (
        <Text className="text-text-secondary">Loading...</Text>
      ) : session === null ? (
        <Text className="text-text-secondary">Workout not found.</Text>
      ) : (
        <WorkoutSessionDetailContent session={session} />
      )}
    </ScreenWrapper>
  );
}
