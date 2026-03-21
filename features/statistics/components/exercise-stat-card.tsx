import { Text, View } from "react-native";

import { formatDateTime } from "@/utils/format/date-time";
import { formatStatNumber, formatVolumeKg } from "@/utils/format/stat";

type ExerciseStatCardProps = {
  exerciseName: string;
  sessions: number;
  totalSets: number;
  totalReps: number;
  totalVolumeKg: number;
  lastPerformedAt: number;
};

export function ExerciseStatCard({
  exerciseName,
  sessions,
  totalSets,
  totalReps,
  totalVolumeKg,
  lastPerformedAt,
}: ExerciseStatCardProps) {
  return (
    <View className="gap-2 rounded-2xl border border-border bg-card p-4">
      <View className="gap-1">
        <Text className="text-base font-semibold text-text-primary">{exerciseName}</Text>
        <Text className="text-xs text-text-tertiary">
          Last performed {formatDateTime(lastPerformedAt)}
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        <View className="rounded-full bg-surface px-2 py-1">
          <Text className="text-[11px] font-semibold text-text-secondary">
            {formatStatNumber(sessions)} sessions
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
        <Text className="text-sm font-semibold text-text-primary">{formatVolumeKg(totalVolumeKg)}</Text>
      </View>
    </View>
  );
}
