import { Stack, useRouter } from "expo-router";
import { Text, View } from "react-native";

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
        <Text className="text-text-secondary">Loading...</Text>
      ) : sessions.length === 0 ? (
        <View className="gap-3">
          <Text className="text-lg font-semibold text-text-primary">No completed workouts yet</Text>
          <Text className="text-sm text-text-secondary">
            Finish a workout session and it will appear here.
          </Text>
        </View>
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
