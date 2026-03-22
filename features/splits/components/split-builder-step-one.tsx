import { Pressable, Text, TextInput, View } from "react-native";

import type { Id } from "@/convex/_generated/dataModel";
import type { BuilderDay } from "@/features/splits/components/split-builder-types";
import { SplitBuilderStepHeader } from "@/features/splits/components/split-builder-step-header";

type ExerciseOption = {
  _id: Id<"exercises">;
  name: string;
};

type SplitBuilderStepOneProps = {
  name: string;
  days: BuilderDay[];
  placeholderByWeekday: Map<number, string>;
  expandedWeekday: number | null;
  searchText: string;
  debouncedText: string;
  showAllExercises: boolean;
  exercises: ExerciseOption[] | undefined;
  searchResults: ExerciseOption[] | undefined;
  onNameChange: (value: string) => void;
  onToggleTraining: (weekday: number) => void;
  onUpdateTitle: (weekday: number, title: string) => void;
  onRemoveExercise: (weekday: number, index: number) => void;
  onToggleExercises: (weekday: number) => void;
  onSearchChange: (value: string) => void;
  onShowAllExercises: () => void;
  onAddExercise: (weekday: number, exercise: ExerciseOption) => void;
};

export function SplitBuilderStepOne({
  name,
  days,
  placeholderByWeekday,
  expandedWeekday,
  searchText,
  debouncedText,
  showAllExercises,
  exercises,
  searchResults,
  onNameChange,
  onToggleTraining,
  onUpdateTitle,
  onRemoveExercise,
  onToggleExercises,
  onSearchChange,
  onShowAllExercises,
  onAddExercise,
}: SplitBuilderStepOneProps) {
  return (
    <View className="gap-6">
      <SplitBuilderStepHeader
        stepLabel="Step 1 of 2"
        title="Plan and pick exercises"
        description="Name the split, choose training days, and pick the exercises for each day."
      />

      <View className="gap-2">
        <Text className="text-base font-semibold text-text-primary">Split name</Text>
        <TextInput
          value={name}
          onChangeText={onNameChange}
          placeholder="e.g. Push Pull Legs"
          placeholderTextColor="#9ca3af"
          className="rounded-xl border border-border px-3 py-3 text-text-primary"
        />
      </View>

      <View className="gap-4">
        <Text className="text-base font-semibold text-text-primary">Training days</Text>
        {days.map((day) => (
          <View key={day.weekday} className="gap-2 rounded-2xl border border-border bg-card p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-text-primary">{day.label}</Text>
              <Pressable
                onPress={() => onToggleTraining(day.weekday)}
                className={`rounded-full px-3 py-1 ${
                  day.isTraining ? "bg-primary/15" : "bg-border"
                }`}
              >
                <Text className="text-xs font-semibold text-text-primary">
                  {day.isTraining ? "Training" : "Rest"}
                </Text>
              </Pressable>
            </View>

            {day.isTraining ? (
              <View className="gap-3">
                <View className="gap-2">
                  <Text className="text-xs text-text-tertiary">Day title</Text>
                  <TextInput
                    value={day.title}
                    onChangeText={(text) => onUpdateTitle(day.weekday, text)}
                    placeholder={`e.g. ${placeholderByWeekday.get(day.weekday) ?? "Training"}`}
                    placeholderTextColor="#9ca3af"
                    className="rounded-lg border border-border px-3 py-2 text-text-primary"
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-xs font-semibold text-text-secondary">Exercises</Text>
                  {day.exercises.length === 0 ? (
                    <Text className="text-xs text-text-tertiary">No exercises yet.</Text>
                  ) : (
                    <View className="gap-2">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <View
                          key={`${day.weekday}-${exerciseIndex}`}
                          className="flex-row items-center justify-between rounded-lg border border-border px-3 py-2"
                        >
                          <Text className="text-sm font-semibold text-text-primary">
                            {exercise.exerciseName}
                          </Text>
                          <Pressable
                            onPress={() => onRemoveExercise(day.weekday, exerciseIndex)}
                            className="rounded-lg bg-status-error/10 px-2 py-1"
                          >
                            <Text className="text-xs font-semibold text-status-error">Remove</Text>
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <Pressable
                  onPress={() => onToggleExercises(day.weekday)}
                  className="rounded-lg border border-dashed border-primary/60 bg-primary/10 px-3 py-2"
                >
                  <Text className="text-center text-sm font-semibold text-primary">
                    {expandedWeekday === day.weekday ? "Hide exercises" : "Add exercises"}
                  </Text>
                </Pressable>

                {expandedWeekday === day.weekday ? (
                  <View className="gap-2 rounded-lg border border-border bg-surface/60 p-2">
                    <TextInput
                      value={searchText}
                      onChangeText={onSearchChange}
                      placeholder="Search exercises"
                      placeholderTextColor="#9ca3af"
                      className="rounded-lg border border-secondary/60 bg-surface px-3 py-2 text-text-primary"
                    />
                    {debouncedText.length === 0 ? (
                      exercises ? (
                        <>
                          {(showAllExercises ? exercises : exercises.slice(0, 20)).map(
                            (exercise) => (
                              <Pressable
                                key={exercise._id}
                                onPress={() => onAddExercise(day.weekday, exercise)}
                                className="flex-row items-center justify-between rounded-lg border border-border px-3 py-2"
                              >
                                <Text className="text-sm text-text-primary">{exercise.name}</Text>
                                <View className="rounded-full bg-secondary px-2 py-0.5">
                                  <Text className="text-[10px] font-semibold text-white">Add</Text>
                                </View>
                              </Pressable>
                            )
                          )}
                          {!showAllExercises && exercises.length > 20 ? (
                            <Pressable
                              onPress={onShowAllExercises}
                              className="rounded-lg border border-border px-3 py-2"
                            >
                              <Text className="text-center text-xs font-semibold text-text-secondary">
                                Show more
                              </Text>
                            </Pressable>
                          ) : null}
                        </>
                      ) : (
                        <Text className="text-xs text-text-tertiary">Loading exercises...</Text>
                      )
                    ) : searchResults ? (
                      searchResults.length > 0 ? (
                        searchResults.map((exercise) => (
                          <Pressable
                            key={exercise._id}
                            onPress={() => onAddExercise(day.weekday, exercise)}
                            className="flex-row items-center justify-between rounded-lg border border-border px-3 py-2"
                          >
                            <Text className="text-sm text-text-primary">{exercise.name}</Text>
                            <View className="rounded-full bg-secondary px-2 py-0.5">
                              <Text className="text-[10px] font-semibold text-white">Add</Text>
                            </View>
                          </Pressable>
                        ))
                      ) : (
                        <Text className="text-xs text-text-tertiary">No matches found.</Text>
                      )
                    ) : (
                      <Text className="text-xs text-text-tertiary">Loading exercises...</Text>
                    )}
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
