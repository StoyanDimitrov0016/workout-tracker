import { WorkoutSessionDetailSkeleton } from "@/components/feedback/loading-skeleton";
import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { RouteErrorBoundary } from "@/components/feedback/route-error-boundary";
import { Screen } from "@/components/ui/screen";
import { statisticsResource } from "@/features/statistics/data/statistics-resource";
import { WorkoutSessionDetailContent } from "@/features/statistics/components/workout-session-detail-content";
import {
  ConvexIdParamSchema,
  useValidatedLocalSearchParam,
} from "@/hooks/use-validated-local-search-param";

export { RouteErrorBoundary as ErrorBoundary };

export default function WorkoutSessionDetailScreen() {
  const sessionId = useValidatedLocalSearchParam(
    "sessionId",
    ConvexIdParamSchema<"workoutSessions">()
  );
  const session = statisticsResource.useSessionDetail(sessionId);

  return (
    <Screen>
      {sessionId === null ? (
        <ScreenStateMessage title="Invalid session." />
      ) : session === undefined ? (
        <WorkoutSessionDetailSkeleton />
      ) : session === null ? (
        <ScreenStateMessage title="Workout not found." />
      ) : (
        <WorkoutSessionDetailContent session={session} />
      )}
    </Screen>
  );
}
