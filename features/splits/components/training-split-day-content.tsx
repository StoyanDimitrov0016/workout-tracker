import { Text, View } from "react-native";

import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { formatSetTargetsSummary } from "@/features/splits/utils/targets";

type TrainingSplitDayContentProps = {
  weekday: number;
  day:
    | {
        title: string;
        exercises: Array<{
          exerciseId: string;
          exerciseName: string;
          setTargets: Array<{ reps: number; weightKg: number; restSec: number }>;
        }>;
      }
    | undefined;
};

export function TrainingSplitDayContent({ weekday, day }: TrainingSplitDayContentProps) {
  return (
    <View className="gap-4">
      <View>
        <Text className="text-sm text-text-tertiary">{weekdayToLabel(weekday)}</Text>
        <Text className="text-2xl font-semibold text-text-primary">
          {day?.title?.trim() || (day ? "Training" : "Rest day")}
        </Text>
      </View>

      {day && day.exercises.length > 0 ? (
        <View className="gap-3">
          {day.exercises.map((exercise, index) => (
            <View
              key={`${exercise.exerciseId}-${index}`}
              className="rounded-xl border border-border bg-card p-4"
            >
              <Text className="text-base font-semibold text-text-primary">
                {exercise.exerciseName}
              </Text>
              <Text className="text-sm text-text-tertiary">
                {formatSetTargetsSummary(exercise.setTargets)}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text className="text-sm text-text-tertiary">Rest day.</Text>
      )}
    </View>
  );
}
