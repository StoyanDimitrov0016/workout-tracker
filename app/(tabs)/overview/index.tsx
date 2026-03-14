import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { formatWeightKg } from "@/features/measurements/utils/weight";
import { formatDateTime } from "@/features/measurements/utils/format-date-time";
import { OverviewHighlightCard } from "@/features/overview/components/overview-highlight-card";
import { OverviewMetricCard } from "@/features/overview/components/overview-metric-card";
import { formatDurationMs, formatStatNumber, formatVolumeKg } from "@/features/statistics/utils/format-stat";
import { jsDayToWeekday, weekdayToLabel } from "@/features/splits/constants/weekdays";
import { formatSetTargetsSummary } from "@/features/splits/utils/targets";

export default function OverviewScreen() {
  const router = useRouter();
  const split = useQuery(api.splits.getMineWithDailyMuscleVolume);
  const weightSummary = useQuery(api.weights.getLatestAndAverage, { days: 7 });
  const activeSession = useQuery(api.workoutSessions.getActive);
  const statistics = useQuery(api.workoutSessions.getStatisticsOverview);

  if (split === undefined || activeSession === undefined || statistics === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
      </ScreenWrapper>
    );
  }

  if (!split) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-xl font-semibold text-text-primary">Create your plan</Text>
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

  const latestCompletedSession = statistics.recentSessions[0] ?? null;

  const today = jsDayToWeekday(new Date().getDay());
  const trainingDays = split.days.filter((day) => day.exercises.length > 0);

  let upcomingWeekday = today;
  let upcomingDelta = 7;

  trainingDays.forEach((day) => {
    const delta = (day.weekday - today + 7) % 7;
    if (delta < upcomingDelta) {
      upcomingWeekday = day.weekday;
      upcomingDelta = delta;
    }
  });

  const orderedDays = trainingDays
    .map((day) => ({
      day,
      delta: (day.weekday - upcomingWeekday + 7) % 7,
    }))
    .sort((a, b) => a.delta - b.delta)
    .map((entry) => entry.day);

  return (
    <ScreenWrapper>
      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-sm text-text-tertiary">Overview</Text>
          <Text className="text-2xl font-semibold text-text-primary">Your gym snapshot</Text>
        </View>

        {activeSession ? (
          <OverviewHighlightCard
            eyebrow="Active workout"
            title={activeSession.title.trim() || "Training"}
            description={`${
              activeSession.exercises.filter((exercise) => exercise.isDone).length
            }/${activeSession.exercises.length} exercises marked done.`}
            meta={`Started ${formatDateTime(activeSession.startedAt)}`}
            actionLabel="Resume workout"
            onAction={() => router.push("/start-session")}
          />
        ) : latestCompletedSession ? (
          <OverviewHighlightCard
            eyebrow="Last completed workout"
            title={latestCompletedSession.title || "Training"}
            description={`${formatStatNumber(latestCompletedSession.totalSets)} sets | ${formatVolumeKg(
              latestCompletedSession.totalVolumeKg
            )} volume`}
            meta={
              latestCompletedSession.completedAt !== null
                ? `${weekdayToLabel(latestCompletedSession.weekday)} | ${formatDateTime(
                    latestCompletedSession.completedAt
                  )}`
                : weekdayToLabel(latestCompletedSession.weekday)
            }
            actionLabel="Open workout"
            onAction={() =>
              router.push({
                pathname: "/statistics/session/[sessionId]",
                params: { sessionId: latestCompletedSession._id },
              })
            }
          />
        ) : upcomingDelta < 7 ? (
          <OverviewHighlightCard
            eyebrow="Ready to train"
            title={orderedDays[0]?.title?.trim() || "Training"}
            description={`${
              orderedDays[0]?.exercises.length ?? 0
            } exercises planned for ${weekdayToLabel(orderedDays[0]?.weekday ?? today)}.`}
            meta={upcomingDelta === 0 ? "Your next workout is today." : "Your next workout is coming up."}
            actionLabel="Start session"
            onAction={() => router.push("/start-session")}
          />
        ) : null}

        {statistics.summary.totalSessions > 0 ? (
          <View className="gap-2">
            <Text className="text-sm text-text-tertiary">Training momentum</Text>
            <View className="flex-row flex-wrap gap-3">
              <OverviewMetricCard
                label="Completed sessions"
                value={formatStatNumber(statistics.summary.totalSessions)}
              />
              <OverviewMetricCard
                label="Total volume"
                value={formatVolumeKg(statistics.summary.totalVolumeKg)}
              />
              <OverviewMetricCard
                label="Avg. session time"
                value={formatDurationMs(statistics.summary.averageSessionDurationMs)}
              />
            </View>
            <Pressable onPress={() => router.push("/statistics/history")} className="self-start">
              <Text className="text-sm font-semibold text-primary">Open workout history</Text>
            </Pressable>
          </View>
        ) : null}

        <View className="gap-1">
          <Text className="text-sm text-text-tertiary">Plan overview</Text>
          <Text className="text-2xl font-semibold text-text-primary">{split.name}</Text>
        </View>

        {orderedDays.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4">
              {orderedDays.map((day, index) => {
                const dayTitle = day.title?.trim() || "Training";
                const exercises = day.exercises ?? [];
                const muscleLine =
                  day.setsByMuscle.map((item) => `${item.muscleName} ${item.sets}`).join(", ") ?? "";
                const tagLabel = index === 0 ? (upcomingDelta === 0 ? "Today" : "Up next") : null;

                return (
                  <View
                    key={day.weekday}
                    className="w-80 gap-3 rounded-2xl border border-border bg-card p-4"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-semibold text-text-secondary">
                        {weekdayToLabel(day.weekday)}
                      </Text>
                      {tagLabel ? (
                        <View className="rounded-full bg-primary px-2 py-0.5">
                          <Text className="text-[10px] font-semibold text-white">{tagLabel}</Text>
                        </View>
                      ) : null}
                    </View>

                    <View className="gap-1">
                      <Text className="text-lg font-semibold text-text-primary">{dayTitle}</Text>
                      <Text className="text-xs text-text-tertiary">{exercises.length} exercises</Text>
                    </View>

                    <View className="gap-2">
                      {exercises.length > 0 ? (
                        exercises.map((exercise, exerciseIndex) => (
                          <View key={`${exercise.exerciseId}-${exerciseIndex}`} className="gap-1">
                            <Text className="text-sm font-semibold text-text-primary">
                              {exercise.exerciseName}
                            </Text>
                            <Text className="text-xs text-text-tertiary">
                              {formatSetTargetsSummary(exercise.setTargets)}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text className="text-sm text-text-tertiary">Rest day.</Text>
                      )}
                    </View>

                    <View className="gap-1 border-t border-border pt-3">
                      <Text className="text-xs font-semibold text-text-secondary">Muscle groups</Text>
                      {muscleLine ? (
                        <Text className="text-xs text-text-tertiary">{muscleLine}</Text>
                      ) : (
                        <Text className="text-xs text-text-tertiary">No volume recorded yet.</Text>
                      )}
                      <Text className="text-xs text-text-tertiary">Total sets: {day.totalSets}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        ) : (
          <View className="rounded-2xl border border-border bg-card p-4">
            <Text className="text-sm text-text-secondary">
              You do not have any training days with exercises yet.
            </Text>
          </View>
        )}

        <View className="gap-2">
          <Text className="text-sm text-text-tertiary">Weight overview</Text>
          <View className="gap-3 rounded-2xl border border-border bg-card p-4">
            {weightSummary === undefined ? (
              <Text className="text-sm text-text-tertiary">Loading weight data...</Text>
            ) : (
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-text-secondary">Latest weight</Text>
                  <Text className="text-base font-semibold text-text-primary">
                    {weightSummary.latestWeightKg !== null
                      ? `${formatWeightKg(weightSummary.latestWeightKg)} kg`
                      : "No entries"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-text-secondary">Last 7 days avg</Text>
                  <Text className="text-base font-semibold text-text-primary">
                    {weightSummary.recentAverageKg !== null
                      ? `${formatWeightKg(weightSummary.recentAverageKg)} kg`
                      : "No entries"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
