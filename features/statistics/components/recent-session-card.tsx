import { Pressable, Text, View } from "react-native";

import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { formatDateTime } from "@/utils/format/date-time";
import { formatDurationMs, formatStatNumber, formatVolumeKg } from "@/utils/format/stat";

type RecentSessionCardProps = {
  title: string;
  weekday: number;
  completedAt: number | null;
  exerciseCount: number;
  doneExercises: number;
  totalSets: number;
  totalReps: number;
  totalVolumeKg: number;
  durationMs: number | null;
  onPress?: () => void;
};

export function RecentSessionCard({
  title,
  weekday,
  completedAt,
  exerciseCount,
  doneExercises,
  totalSets,
  totalReps,
  totalVolumeKg,
  durationMs,
  onPress,
}: RecentSessionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="rounded-2xl border border-border bg-card p-4"
    >
      <View className="gap-3">
        <View className="gap-1">
          <Text className="text-base font-semibold text-text-primary">{title || "Training"}</Text>
          <Text className="text-xs text-text-tertiary">
            {weekdayToLabel(weekday)}
            {completedAt !== null ? ` | ${formatDateTime(completedAt)}` : ""}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <View className="rounded-full bg-surface px-2 py-1">
            <Text className="text-[11px] font-semibold text-text-secondary">
              {doneExercises}/{exerciseCount} exercises
            </Text>
          </View>
          <View className="rounded-full bg-surface px-2 py-1">
            <Text className="text-[11px] font-semibold text-text-secondary">
              {formatStatNumber(totalSets)} sets
            </Text>
          </View>
          <View className="rounded-full bg-surface px-2 py-1">
            <Text className="text-[11px] font-semibold text-text-secondary">
              {formatStatNumber(totalReps)} reps
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-text-secondary">Volume</Text>
          <Text className="text-sm font-semibold text-text-primary">
            {formatVolumeKg(totalVolumeKg)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-text-secondary">Duration</Text>
          <Text className="text-sm font-semibold text-text-primary">
            {formatDurationMs(durationMs)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
