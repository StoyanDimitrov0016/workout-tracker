import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { formatWeightKg } from "@/features/measurements/utils/weight";
import { formatDateTime } from "@/features/measurements/utils/format-date-time";
import { OverviewMetricCard } from "@/features/overview/components/overview-metric-card";
import { OverviewSplitDayCard } from "@/features/overview/components/overview-split-day-card";
import { formatDurationMs, formatStatNumber, formatVolumeKg } from "@/features/statistics/utils/format-stat";
import { jsDayToWeekday, weekdayToLabel } from "@/features/splits/constants/weekdays";

export default function OverviewScreen() {
  const router = useRouter();
  const split = useQuery(api.splits.getMineWithDailyMuscleVolume);
  const weightSummary = useQuery(api.weights.getLatestAndAverage, { days: 7 });
  const activeSession = useQuery(api.workoutSessions.getActive);
  const statistics = useQuery(api.workoutSessions.getStatisticsOverview);

  const today = jsDayToWeekday(new Date().getDay());
  const trainingDays = split?.days.filter((day) => day.exercises.length > 0) ?? [];

  let upcomingWeekday = today;
  let upcomingDelta = 7;

  trainingDays.forEach((day) => {
    const delta = (day.weekday - today + 7) % 7;
    if (delta < upcomingDelta) {
      upcomingWeekday = day.weekday;
      upcomingDelta = delta;
    }
  });

  const focusWeekday = activeSession?.weekday ?? upcomingWeekday;
  const orderedDays = trainingDays
    .map((day) => ({
      day,
      delta: (day.weekday - focusWeekday + 7) % 7,
    }))
    .sort((a, b) => a.delta - b.delta)
    .map((entry) => entry.day);
  const primaryDay = orderedDays[0] ?? null;
  const sameWeekdaySession = useQuery(
    api.workoutSessions.getLatestCompletedForWeekday,
    primaryDay ? { weekday: primaryDay.weekday } : "skip"
  );

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

  return (
    <ScreenWrapper>
      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-sm text-text-tertiary">Overview</Text>
          <Text className="text-2xl font-semibold text-text-primary">{split.name}</Text>
          <Text className="text-sm text-text-secondary">
            Start from your current or nearest planned training day.
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-sm text-text-tertiary">Training program</Text>
          {primaryDay ? (
            <Text className="text-sm text-text-secondary">
              {activeSession
                ? `You have an active ${weekdayToLabel(primaryDay.weekday).toLowerCase()} session in progress.`
                : upcomingDelta === 0
                  ? "Your first card is today's plan."
                  : "Your first card is the nearest planned workout."}
            </Text>
          ) : null}
        </View>

        {orderedDays.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4">
              {orderedDays.map((day, index) => {
                const tagLabel =
                  index === 0
                    ? activeSession
                      ? "Current"
                      : upcomingDelta === 0
                        ? "Today"
                        : "Up next"
                    : null;
                const actionLabel = index === 0 ? (activeSession ? "Resume workout" : "Open session") : null;

                return (
                  <OverviewSplitDayCard
                    key={day.weekday}
                    day={day}
                    tagLabel={tagLabel}
                    actionLabel={actionLabel}
                    onAction={() => router.push("/start-session")}
                  />
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

        {primaryDay ? (
          <View className="gap-2">
            <Text className="text-sm text-text-tertiary">
              Last {weekdayToLabel(primaryDay.weekday).toLowerCase()} workout
            </Text>
            {sameWeekdaySession === undefined ? (
              <View className="rounded-2xl border border-border bg-card p-4">
                <Text className="text-sm text-text-tertiary">Loading workout comparison...</Text>
              </View>
            ) : sameWeekdaySession ? (
              <View className="gap-3 rounded-2xl border border-border bg-card p-4">
                <View className="gap-1">
                  <Text className="text-base font-semibold text-text-primary">
                    {sameWeekdaySession.title || "Training"}
                  </Text>
                  <Text className="text-sm text-text-secondary">
                    {sameWeekdaySession.completedAt !== null
                      ? formatDateTime(sameWeekdaySession.completedAt)
                      : weekdayToLabel(sameWeekdaySession.weekday)}
                  </Text>
                </View>
                <Text className="text-sm text-text-secondary">
                  {formatStatNumber(sameWeekdaySession.totalSets)} sets |{" "}
                  {formatStatNumber(sameWeekdaySession.totalReps)} reps |{" "}
                  {formatVolumeKg(sameWeekdaySession.totalVolumeKg)}
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/statistics/session/[sessionId]",
                      params: { sessionId: sameWeekdaySession._id },
                    })
                  }
                  className="rounded-xl border border-border px-4 py-3"
                >
                  <Text className="text-center font-semibold text-text-primary">
                    Open same-day workout
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="rounded-2xl border border-border bg-card p-4">
                <Text className="text-sm text-text-secondary">
                  No completed workout found yet for this training day.
                </Text>
              </View>
            )}
          </View>
        ) : null}

        <View className="gap-2">
          <Text className="text-sm text-text-tertiary">Weight preview</Text>
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
                  <Text className="text-sm text-text-secondary">Logged</Text>
                  <Text className="text-base font-semibold text-text-primary">
                    {weightSummary.latestCreatedAt !== null
                      ? formatDateTime(weightSummary.latestCreatedAt)
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
      </View>
    </ScreenWrapper>
  );
}
