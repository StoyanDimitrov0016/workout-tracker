import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { HistorySessionCard } from "@/features/statistics/components/history-session-card";
import {
  statisticsResource,
  WORKOUT_HISTORY_PAGE_SIZE,
} from "@/features/statistics/data/statistics-resource";

export { RouteErrorBoundary as ErrorBoundary } from "@/components/feedback/route-error-boundary";

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const history = statisticsResource.useHistory();

  return (
    <ScreenWrapper>
      {history.status === "LoadingFirstPage" ? (
        <ScreenStateMessage title="Loading..." showSpinner />
      ) : history.results.length === 0 ? (
        <ScreenStateMessage
          title="No completed workouts yet"
          description="Finish a workout session and it will appear here."
        />
      ) : (
        <View className="gap-3">
          {history.results.map((session) => (
            <HistorySessionCard
              key={session._id}
              title={session.title}
              weekday={session.weekday}
              completedAt={session.completedAt}
              exerciseCount={session.exerciseCount}
              doneExercises={session.doneExercises}
              totalSets={session.totalSets}
              totalReps={session.totalReps}
              totalVolumeKg={session.totalVolumeKg}
              durationMs={session.durationMs}
              onPress={() =>
                router.push({
                  pathname: "/statistics/session/[sessionId]",
                  params: { sessionId: session._id },
                })
              }
            />
          ))}
          {history.status === "CanLoadMore" || history.status === "LoadingMore" ? (
            <Pressable
              onPress={() => history.loadMore(WORKOUT_HISTORY_PAGE_SIZE)}
              disabled={history.status === "LoadingMore"}
              className="rounded-xl border border-border bg-card px-4 py-3 disabled:opacity-60"
            >
              <Text className="text-center font-semibold text-text-primary">
                {history.status === "LoadingMore" ? "Loading more..." : "Load more workouts"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </ScreenWrapper>
  );
}
