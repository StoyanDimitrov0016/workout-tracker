import { Stack } from "expo-router";

import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { statisticsResource } from "@/features/statistics/data/statistics-resource";
import { WorkoutSessionDetailContent } from "@/features/statistics/components/workout-session-detail-content";
import {
  ConvexIdParamSchema,
  useValidatedLocalSearchParam,
} from "@/hooks/use-validated-local-search-param";

export default function WorkoutSessionDetailScreen() {
  const sessionId = useValidatedLocalSearchParam("sessionId", ConvexIdParamSchema<"workoutSessions">());
  const session = statisticsResource.useSessionDetail(sessionId);

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: "Workout", headerTitle: "Workout" }} />

      {sessionId === null ? (
        <ScreenStateMessage title="Invalid session." />
      ) : session === undefined ? (
        <ScreenStateMessage title="Loading..." />
      ) : session === null ? (
        <ScreenStateMessage title="Workout not found." />
      ) : (
        <WorkoutSessionDetailContent session={session} />
      )}
    </ScreenWrapper>
  );
}
