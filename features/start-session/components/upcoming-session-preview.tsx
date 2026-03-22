import { Pressable, Text, View } from "react-native";

import { InlineErrorBanner } from "@/components/feedback/inline-error-banner";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { formatSetTargetsSummary } from "@/features/splits/utils/targets";

type UpcomingSessionDay = {
  weekday: number;
  title: string;
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    setTargets: Array<{ reps: number; restSec: number }>;
  }>;
};

type UpcomingSessionPreviewProps = {
  day: UpcomingSessionDay;
  isStarting: boolean;
  errorMessage: string | null;
  onStart: () => void;
};

export function UpcomingSessionPreview({
  day,
  isStarting,
  errorMessage,
  onStart,
}: UpcomingSessionPreviewProps) {
  return (
    <View className="gap-6">
      {errorMessage ? <InlineErrorBanner message={errorMessage} /> : null}

      <View className="gap-1">
        <Text className="text-sm text-text-tertiary">Upcoming session</Text>
        <Text className="text-2xl font-semibold text-text-primary">
          {day.title?.trim() || "Training"}
        </Text>
        <Text className="text-sm text-text-secondary">{weekdayToLabel(day.weekday)}</Text>
      </View>

      <View className="gap-3 rounded-2xl border border-border bg-card p-4">
        {day.exercises.map((exercise, exerciseIndex) => (
          <View key={`${exercise.exerciseId}-${exerciseIndex}`} className="gap-1">
            <Text className="text-sm font-semibold text-text-primary">{exercise.exerciseName}</Text>
            <Text className="text-xs text-text-tertiary">
              {formatSetTargetsSummary(exercise.setTargets)}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={onStart}
        disabled={isStarting}
        className={`rounded-xl py-3 ${isStarting ? "bg-primary/60" : "bg-primary"}`}
      >
        <Text className="text-center font-semibold text-white">
          {isStarting ? "Starting..." : "Start workout"}
        </Text>
      </Pressable>
    </View>
  );
}
