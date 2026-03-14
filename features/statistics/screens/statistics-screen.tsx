import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { ExerciseStatCard } from "@/features/statistics/components/exercise-stat-card";
import { RecentSessionCard } from "@/features/statistics/components/recent-session-card";
import { StatisticsSummaryCard } from "@/features/statistics/components/statistics-summary-card";
import { formatDurationMs, formatStatNumber, formatVolumeKg } from "@/utils/format/stat";

export function StatisticsScreen() {
  const router = useRouter();
  const statistics = useQuery(api.workoutSessions.getStatisticsOverview);

  if (statistics === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
      </ScreenWrapper>
    );
  }

  if (statistics.summary.totalSessions === 0) {
    return (
      <ScreenWrapper>
        <View className="gap-4">
          <View className="gap-1">
            <Text className="text-sm text-text-tertiary">Statistics</Text>
            <Text className="text-2xl font-semibold text-text-primary">No completed workouts yet</Text>
          </View>
          <Text className="text-sm text-text-secondary">
            Finish your first workout session to unlock volume, recent session history, and exercise frequency.
          </Text>
          <Pressable
            onPress={() => router.push("/start-session")}
            className="rounded-xl bg-primary px-4 py-3"
          >
            <Text className="text-center font-semibold text-white">Start workout</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="gap-6">
        <View className="gap-1">
          <Text className="text-sm text-text-tertiary">Statistics</Text>
          <Text className="text-2xl font-semibold text-text-primary">Training history</Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <StatisticsSummaryCard
            label="Completed sessions"
            value={formatStatNumber(statistics.summary.totalSessions)}
          />
          <StatisticsSummaryCard
            label="Total sets"
            value={formatStatNumber(statistics.summary.totalSets)}
          />
          <StatisticsSummaryCard
            label="Total reps"
            value={formatStatNumber(statistics.summary.totalReps)}
          />
          <StatisticsSummaryCard
            label="Total volume"
            value={formatVolumeKg(statistics.summary.totalVolumeKg)}
          />
          <StatisticsSummaryCard
            label="Avg. session time"
            value={formatDurationMs(statistics.summary.averageSessionDurationMs)}
          />
        </View>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-text-primary">Recent sessions</Text>
            <Pressable onPress={() => router.push("/statistics/history")}>
              <Text className="text-sm font-semibold text-primary">View all</Text>
            </Pressable>
          </View>
          <View className="gap-3">
            {statistics.recentSessions.map((session) => (
              <RecentSessionCard
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
        </View>

        <View className="gap-3">
          <Text className="text-base font-semibold text-text-primary">Most trained exercises</Text>
          <View className="gap-3">
            {statistics.topExercises.map((exercise) => (
              <ExerciseStatCard
                key={exercise.exerciseId}
                exerciseName={exercise.exerciseName}
                sessions={exercise.sessions}
                totalSets={exercise.totalSets}
                totalReps={exercise.totalReps}
                totalVolumeKg={exercise.totalVolumeKg}
                lastPerformedAt={exercise.lastPerformedAt}
              />
            ))}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
