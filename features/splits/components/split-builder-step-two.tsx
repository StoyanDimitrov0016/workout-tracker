import { Pressable, ScrollView, Text, View } from "react-native";

import { ExerciseRow } from "@/features/splits/components/exercise-row";
import type { BuilderDay, BuilderExercise } from "@/features/splits/components/split-builder-types";
import { SplitBuilderStepHeader } from "@/features/splits/components/split-builder-step-header";
import type { ExerciseValidationResult } from "@/features/splits/utils/validation";

type SplitBuilderStepTwoProps = {
  trainingDays: BuilderDay[];
  placeholderByWeekday: Map<number, string>;
  expandedExerciseKey: string | null;
  copyMenuWeekday: number | null;
  saveErrorMessage: string | null;
  validationErrorsByExerciseKey: Map<string, ExerciseValidationResult>;
  totalInvalidFields: number;
  onToggleExpandedExercise: (key: string) => void;
  onUpdateExercise: (weekday: number, index: number, next: Partial<BuilderExercise>) => void;
  onRemoveExercise: (weekday: number, index: number) => void;
  onToggleCopyMenu: (weekday: number) => void;
  onCopyExercisesToDay: (sourceWeekday: number, targetWeekday: number) => void;
  onCopyExercisesToAll: (sourceWeekday: number) => void;
};

export function SplitBuilderStepTwo({
  trainingDays,
  placeholderByWeekday,
  expandedExerciseKey,
  copyMenuWeekday,
  saveErrorMessage,
  validationErrorsByExerciseKey,
  totalInvalidFields,
  onToggleExpandedExercise,
  onUpdateExercise,
  onRemoveExercise,
  onToggleCopyMenu,
  onCopyExercisesToDay,
  onCopyExercisesToAll,
}: SplitBuilderStepTwoProps) {
  return (
    <View className="gap-6">
      <SplitBuilderStepHeader
        stepLabel="Step 2 of 2"
        title="Configure details"
        description="Set the sets, reps, weight, and rest for each exercise."
      />
      {saveErrorMessage ? (
        <View className="rounded-2xl border border-status-error/20 bg-status-error/10 p-4">
          <Text className="text-sm text-status-error">{saveErrorMessage}</Text>
        </View>
      ) : null}
      {totalInvalidFields > 0 ? (
        <View className="rounded-2xl border border-status-error/20 bg-status-error/10 p-4">
          <Text className="text-sm text-status-error">
            Fix {totalInvalidFields} invalid field{totalInvalidFields === 1 ? "" : "s"} before
            saving.
          </Text>
        </View>
      ) : null}

      {trainingDays.length === 0 ? (
        <View className="gap-3 rounded-2xl border border-border bg-card p-4">
          <Text className="text-base font-semibold text-text-primary">No training days yet</Text>
          <Text className="text-sm text-text-secondary">
            Go back and select at least one training day.
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4">
          <View className="flex-row gap-4 px-4">
            {trainingDays.map((day) => {
              const placeholder = placeholderByWeekday.get(day.weekday);
              const displayTitle = day.title.trim() || placeholder || "Training";
              const exerciseCount = day.exercises.length;
              const copyTargets = trainingDays.filter((item) => item.weekday !== day.weekday);

              return (
                <View
                  key={day.weekday}
                  className="w-96 gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <View className="gap-1">
                    <Text className="text-xs font-semibold text-text-tertiary">{day.label}</Text>
                    <Text className="text-lg font-semibold text-text-primary">{displayTitle}</Text>
                    <Text className="text-xs text-text-secondary">{exerciseCount} exercises</Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-semibold text-text-secondary">Exercises</Text>
                    <Pressable
                      onPress={() => onToggleCopyMenu(day.weekday)}
                      className="rounded-full border border-border px-2 py-1"
                    >
                      <Text className="text-[10px] font-semibold text-text-secondary">
                        Copy day
                      </Text>
                    </Pressable>
                  </View>

                  {copyMenuWeekday === day.weekday ? (
                    <View className="gap-2 rounded-xl border border-border bg-surface p-3">
                      <Text className="text-xs font-semibold text-text-secondary">
                        Copy exercises
                      </Text>
                      {copyTargets.length > 1 ? (
                        <Pressable
                          onPress={() => onCopyExercisesToAll(day.weekday)}
                          className="rounded-lg border border-border px-2 py-2"
                        >
                          <Text className="text-xs font-semibold text-text-secondary">
                            Copy to all
                          </Text>
                        </Pressable>
                      ) : null}
                      {copyTargets.length > 0 ? (
                        copyTargets.map((target) => (
                          <Pressable
                            key={target.weekday}
                            onPress={() => onCopyExercisesToDay(day.weekday, target.weekday)}
                            className="rounded-lg border border-border px-2 py-2"
                          >
                            <Text className="text-xs font-semibold text-text-secondary">
                              {`Copy to ${target.label}`}
                            </Text>
                          </Pressable>
                        ))
                      ) : (
                        <Text className="text-xs text-text-tertiary">
                          Add another training day to copy into.
                        </Text>
                      )}
                    </View>
                  ) : null}

                  {day.exercises.length === 0 ? (
                    <Text className="text-xs text-text-tertiary">No exercises yet.</Text>
                  ) : null}

                  <View className="gap-2">
                    {day.exercises.map((exercise, exerciseIndex) => {
                      const exerciseKey = `${day.weekday}-${exerciseIndex}`;
                      const validation = validationErrorsByExerciseKey.get(exerciseKey);
                      return (
                        <ExerciseRow
                          key={exerciseKey}
                          name={exercise.exerciseName}
                          setTargets={exercise.setTargets}
                          errors={validation?.errors}
                          invalidFieldCount={validation?.invalidFieldCount ?? 0}
                          isExpanded={expandedExerciseKey === exerciseKey}
                          onToggleExpanded={() => onToggleExpandedExercise(exerciseKey)}
                          onChange={(next) => onUpdateExercise(day.weekday, exerciseIndex, next)}
                          onRemove={() => onRemoveExercise(day.weekday, exerciseIndex)}
                        />
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
