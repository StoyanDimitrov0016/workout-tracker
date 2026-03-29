import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { ExerciseStatCard } from "@/features/statistics/components/exercise-stat-card";
import { RecentSessionCard } from "@/features/statistics/components/recent-session-card";
import { StatisticsSummaryCard } from "@/features/statistics/components/statistics-summary-card";
import { statisticsResource } from "@/features/statistics/data/statistics-resource";
import { formatDurationMs, formatStatNumber, formatVolumeKg } from "@/utils/format/stat";

export function StatisticsScreen() {
  const router = useRouter();
  const statistics = statisticsResource.useOverview();

  if (statistics === undefined) {
    return (
      <ScreenWrapper>
        <ScreenStateMessage title="Loading..." showSpinner />
      </ScreenWrapper>
    );
  }

  if (statistics.summary.totalSessions === 0) {
    return (
      <ScreenWrapper>
        <View className="gap-4">
          <ScreenStateMessage
            title="No completed workouts yet"
            description="Finish your first workout session to unlock volume, recent session history, and exercise frequency."
          />
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

  const sessionCountLabel = statistics.meta.isTruncated ? "Recent sessions" : "Completed sessions";

  return (
    <ScreenWrapper>
      <View className="gap-6">
        <View className="flex-row flex-wrap gap-3">
          <StatisticsSummaryCard
            label={sessionCountLabel}
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
        {statistics.meta.isTruncated ? (
          <Text className="text-xs text-text-tertiary">
            Based on your most recent {formatStatNumber(statistics.meta.analyzedSessionCount)} completed workouts.
          </Text>
        ) : null}

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
