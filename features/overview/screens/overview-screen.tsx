import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import {
  OverviewScreenSkeleton,
  SkeletonBlock,
} from "@/components/feedback/loading-skeleton";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { OverviewMetricCard } from "@/features/overview/components/overview-metric-card";
import { OverviewSplitDayCard } from "@/features/overview/components/overview-split-day-card";
import { useOverviewData } from "@/features/overview/hooks/use-overview-data";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { formatDateTime } from "@/utils/format/date-time";
import { formatDurationMs, formatStatNumber, formatVolumeKg } from "@/utils/format/stat";
import { formatWeightKg } from "@/utils/format/weight";

export function OverviewScreen() {
  const router = useRouter();
  const {
    activeSession,
    isLoading,
    orderedDays,
    primaryDay,
    sameWeekdaySession,
    split,
    statistics,
    upcomingDelta,
    weightSummary,
  } = useOverviewData();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <OverviewScreenSkeleton />
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

  const loadedStatistics = statistics!;
  const sessionCountLabel = loadedStatistics.meta.isTruncated
    ? "Recent sessions"
    : "Completed sessions";

  return (
    <ScreenWrapper>
      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-2xl font-semibold text-text-primary">{split.name}</Text>
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
                const actionLabel =
                  index === 0 ? (activeSession ? "Resume workout" : "Open session") : null;

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
            {sameWeekdaySession ? (
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
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <SkeletonBlock width="26%" />
                  <SkeletonBlock width="24%" />
                </View>
                <View className="flex-row items-center justify-between">
                  <SkeletonBlock width="18%" />
                  <SkeletonBlock width="28%" />
                </View>
                <View className="flex-row items-center justify-between">
                  <SkeletonBlock width="28%" />
                  <SkeletonBlock width="24%" />
                </View>
              </View>
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

        {loadedStatistics.summary.totalSessions > 0 ? (
          <View className="gap-2">
            <Text className="text-sm text-text-tertiary">Training momentum</Text>
            <View className="flex-row flex-wrap gap-3">
              <OverviewMetricCard
                label={sessionCountLabel}
                value={formatStatNumber(loadedStatistics.summary.totalSessions)}
              />
              <OverviewMetricCard
                label="Total volume"
                value={formatVolumeKg(loadedStatistics.summary.totalVolumeKg)}
              />
              <OverviewMetricCard
                label="Avg. session time"
                value={formatDurationMs(loadedStatistics.summary.averageSessionDurationMs)}
              />
            </View>
            {loadedStatistics.meta.isTruncated ? (
              <Text className="text-xs text-text-tertiary">
                Based on your most recent{" "}
                {formatStatNumber(loadedStatistics.meta.analyzedSessionCount)} completed workouts.
              </Text>
            ) : null}
            <Pressable onPress={() => router.push("/statistics/history")} className="self-start">
              <Text className="text-sm font-semibold text-primary">Open workout history</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </ScreenWrapper>
  );
}
