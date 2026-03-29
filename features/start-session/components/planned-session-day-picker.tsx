import { Pressable, ScrollView, Text, View } from "react-native";

import { InlineErrorBanner } from "@/components/feedback/inline-error-banner";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { formatSetTargetsSummary } from "@/features/splits/utils/targets";

type PlannedSessionDay = {
  weekday: number;
  title: string;
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    setTargets: Array<{ reps: number; weightKg: number; restSec: number }>;
  }>;
  isRecommended: boolean;
  status: "available" | "completed_today";
  sessionId: string | null;
};

type PlannedSessionDayPickerProps = {
  days: PlannedSessionDay[];
  selectedWeekday: number;
  errorMessage: string | null;
  isStarting: boolean;
  onSelectWeekday: (weekday: number) => void;
  onStart: () => void;
  onOpenCompleted: (sessionId: string) => void;
};

export function PlannedSessionDayPicker({
  days,
  selectedWeekday,
  errorMessage,
  isStarting,
  onSelectWeekday,
  onStart,
  onOpenCompleted,
}: PlannedSessionDayPickerProps) {
  const selectedDay = days.find((day) => day.weekday === selectedWeekday) ?? days[0];

  return (
    <View className="gap-6">
      {errorMessage ? <InlineErrorBanner message={errorMessage} /> : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4">
        <View className="flex-row gap-3 px-4">
          {days.map((day) => {
            const isSelected = day.weekday === selectedWeekday;
            const badge =
              day.status === "completed_today"
                ? "Done today"
                : day.isRecommended
                  ? "Recommended"
                  : null;

            return (
              <Pressable
                key={day.weekday}
                onPress={() => onSelectWeekday(day.weekday)}
                className={`w-44 gap-2 rounded-2xl border p-4 ${
                  isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
              >
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="text-sm font-semibold text-text-primary">
                    {weekdayToLabel(day.weekday)}
                  </Text>
                  {badge ? (
                    <View
                      className={`rounded-full px-2 py-0.5 ${
                        day.status === "completed_today" ? "bg-secondary/15" : "bg-primary/15"
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-semibold ${
                          day.status === "completed_today" ? "text-text-secondary" : "text-primary"
                        }`}
                      >
                        {badge}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View className="gap-1">
                  <Text className="text-base font-semibold text-text-primary">
                    {day.title?.trim() || "Training"}
                  </Text>
                  <Text className="text-xs text-text-tertiary">
                    {day.exercises.length} exercises planned
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="gap-3 rounded-2xl border border-border bg-card p-4">
        <View className="gap-1">
          <Text className="text-sm font-semibold text-text-primary">
            {weekdayToLabel(selectedDay.weekday)}
          </Text>
          <Text className="text-sm text-text-secondary">
            {selectedDay.status === "completed_today"
              ? "You already completed this planned workout today."
              : "This workout will start with your planned exercises and targets."}
          </Text>
        </View>

        {selectedDay.exercises.map((exercise, exerciseIndex) => (
          <View key={`${exercise.exerciseId}-${exerciseIndex}`} className="gap-1">
            <Text className="text-sm font-semibold text-text-primary">{exercise.exerciseName}</Text>
            <Text className="text-xs text-text-tertiary">
              {formatSetTargetsSummary(exercise.setTargets)}
            </Text>
          </View>
        ))}
      </View>

      {selectedDay.status === "completed_today" && selectedDay.sessionId ? (
        <Pressable
          onPress={() => onOpenCompleted(selectedDay.sessionId!)}
          className="rounded-xl bg-primary py-3"
        >
          <Text className="text-center font-semibold text-white">View summary</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={onStart}
          disabled={isStarting}
          className={`rounded-xl py-3 ${isStarting ? "bg-primary/60" : "bg-primary"}`}
        >
          <Text className="text-center font-semibold text-white">
            {isStarting ? "Starting..." : "Start workout"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
