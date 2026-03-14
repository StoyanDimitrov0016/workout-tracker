import { Pressable, Text, View } from "react-native";

import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { formatSetTargetsSummary } from "@/features/splits/utils/targets";

type OverviewSplitDayCardProps = {
  day: {
    weekday: number;
    title: string;
    exercises: Array<{
      exerciseId: string;
      exerciseName: string;
      setTargets: Array<{ reps: number; restSec: number }>;
    }>;
    totalSets: number;
    setsByMuscle: Array<{ muscleName: string; sets: number }>;
  };
  tagLabel?: string | null;
  actionLabel?: string | null;
  onAction?: (() => void) | null;
};

export function OverviewSplitDayCard({
  day,
  tagLabel,
  actionLabel,
  onAction,
}: OverviewSplitDayCardProps) {
  const dayTitle = day.title?.trim() || "Training";
  const muscleLine = day.setsByMuscle.map((item) => `${item.muscleName} ${item.sets}`).join(", ");

  return (
    <View className="w-80 gap-3 rounded-2xl border border-border bg-card p-4">
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
        <Text className="text-xs text-text-tertiary">{day.exercises.length} exercises</Text>
      </View>

      <View className="gap-2">
        {day.exercises.length > 0 ? (
          day.exercises.map((exercise, exerciseIndex) => (
            <View key={`${exercise.exerciseId}-${exerciseIndex}`} className="gap-1">
              <Text className="text-sm font-semibold text-text-primary">{exercise.exerciseName}</Text>
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

      {actionLabel && onAction ? (
        <Pressable onPress={onAction} className="rounded-xl bg-primary px-4 py-3">
          <Text className="text-center font-semibold text-white">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
