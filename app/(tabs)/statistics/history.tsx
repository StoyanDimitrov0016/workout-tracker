import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { HistorySessionCard } from "@/features/statistics/components/history-session-card";
import { statisticsResource } from "@/features/statistics/data/statistics-resource";

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const sessions = statisticsResource.useHistory();

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: "Workout history", headerTitle: "Workout history" }} />

      {sessions === undefined ? (
        <ScreenStateMessage title="Loading..." />
      ) : sessions.length === 0 ? (
        <ScreenStateMessage
          title="No completed workouts yet"
          description="Finish a workout session and it will appear here."
        />
      ) : (
        <View className="gap-3">
          {sessions.map((session) => (
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
        </View>
      )}
    </ScreenWrapper>
  );
}
