import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ExerciseRow } from "@/features/splits/components/exercise-row";
import { WEEKDAYS } from "@/features/splits/constants/weekdays";

type SplitExerciseInput = {
  exerciseId: Id<"exercises">;
  exerciseName: string;
  sets: number;
  reps: number;
  restSec: number;
};

type SplitDayInput = {
  weekday: number;
  title: string;
  exercises: SplitExerciseInput[];
};

type SplitInput = {
  name: string;
  days: SplitDayInput[];
};

type BuilderExercise = {
  exerciseId: Id<"exercises">;
  exerciseName: string;
  sets: string;
  reps: string;
  restSec: string;
};

type BuilderDay = {
  weekday: number;
  label: string;
  isTraining: boolean;
  title: string;
  exercises: BuilderExercise[];
};

interface SplitBuilderProps {
  initialSplit: SplitInput | null;
  submitLabel: string;
  onSaved: () => void;
}

function buildInitialDays(split: SplitInput | null): BuilderDay[] {
  const lookup = new Map<number, SplitDayInput>(split?.days.map((day) => [day.weekday, day]) ?? []);

  return WEEKDAYS.map((weekday) => {
    const day = lookup.get(weekday.weekday);
    return {
      weekday: weekday.weekday,
      label: weekday.label,
      isTraining: Boolean(day),
      title: day?.title ?? "",
      exercises:
        day?.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          sets: String(exercise.sets),
          reps: String(exercise.reps),
          restSec: String(exercise.restSec),
        })) ?? [],
    };
  });
}

function parseNumber(value: string) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, parsed);
}

export function SplitBuilder({ initialSplit, submitLabel, onSaved }: SplitBuilderProps) {
  const saveSplit = useMutation(api.splits.saveMine);
  const exercises = useQuery(api.exercises.list);

  const [name, setName] = useState(initialSplit?.name ?? "");
  const [days, setDays] = useState<BuilderDay[]>(() => buildInitialDays(initialSplit));
  const [expandedWeekday, setExpandedWeekday] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const toggleTraining = (weekday: number) => {
    setDays((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? {
              ...day,
              isTraining: !day.isTraining,
              title: day.isTraining ? "" : day.title || "Workout",
              exercises: day.isTraining ? [] : day.exercises,
            }
          : day
      )
    );
  };

  const updateTitle = (weekday: number, title: string) => {
    setDays((prev) => prev.map((day) => (day.weekday === weekday ? { ...day, title } : day)));
  };

  const updateExercise = (
    weekday: number,
    index: number,
    next: { sets: string; reps: string; restSec: string }
  ) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.weekday !== weekday) return day;
        const exercisesNext = [...day.exercises];
        exercisesNext[index] = { ...exercisesNext[index], ...next };
        return { ...day, exercises: exercisesNext };
      })
    );
  };

  const removeExercise = (weekday: number, index: number) => {
    setDays((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? { ...day, exercises: day.exercises.filter((_, idx) => idx !== index) }
          : day
      )
    );
  };

  const addExercise = (weekday: number, exercise: { _id: Id<"exercises">; name: string }) => {
    setDays((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? {
              ...day,
              exercises: [
                ...day.exercises,
                {
                  exerciseId: exercise._id,
                  exerciseName: exercise.name,
                  sets: "3",
                  reps: "10",
                  restSec: "90",
                },
              ],
            }
          : day
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payloadDays = days
      .filter((day) => day.isTraining)
      .map((day) => ({
        weekday: day.weekday,
        title: day.title.trim() || "Training",
        exercises: day.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          sets: parseNumber(exercise.sets),
          reps: parseNumber(exercise.reps),
          restSec: parseNumber(exercise.restSec),
        })),
      }));

    try {
      await saveSplit({ name: name.trim() || "My Split", days: payloadDays });
      onSaved();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-base font-semibold text-text-primary">Split name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Push Pull Legs"
          placeholderTextColor="#9ca3af"
          className="rounded-xl border border-border px-3 py-3 text-text-primary"
        />
      </View>

      <View className="gap-4">
        {days.map((day) => (
          <View key={day.weekday} className="gap-3 rounded-2xl border border-border bg-card p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-text-primary">
                {day.label} - {day.isTraining ? "Training" : "Rest"}
              </Text>
              <Pressable
                onPress={() => toggleTraining(day.weekday)}
                className={`rounded-full px-3 py-1 ${
                  day.isTraining ? "bg-primary/15" : "bg-border"
                }`}
              >
                <Text className="text-xs font-semibold text-text-primary">
                  {day.isTraining ? "Set Rest" : "Set Training"}
                </Text>
              </Pressable>
            </View>

            {day.isTraining ? (
              <View className="gap-3">
                <View className="gap-2">
                  <Text className="text-xs text-text-tertiary">Day title</Text>
                  <TextInput
                    value={day.title}
                    onChangeText={(text) => updateTitle(day.weekday, text)}
                    placeholder="e.g. Push"
                    placeholderTextColor="#9ca3af"
                    className="rounded-lg border border-border px-3 py-2 text-text-primary"
                  />
                </View>

                <View className="gap-2">
                  {day.exercises.length === 0 ? (
                    <Text className="text-xs text-text-tertiary">No exercises yet.</Text>
                  ) : null}
                  {day.exercises.map((exercise, index) => (
                    <ExerciseRow
                      key={`${exercise.exerciseId}-${exercise.exerciseName}-${index}`}
                      name={exercise.exerciseName}
                      sets={exercise.sets}
                      reps={exercise.reps}
                      restSec={exercise.restSec}
                      onChange={(next) => updateExercise(day.weekday, index, next)}
                      onRemove={() => removeExercise(day.weekday, index)}
                    />
                  ))}
                </View>

                <Pressable
                  onPress={() =>
                    setExpandedWeekday((prev) => (prev === day.weekday ? null : day.weekday))
                  }
                  className="rounded-lg border border-dashed border-border px-3 py-2"
                >
                  <Text className="text-center text-sm text-text-secondary">Add exercise</Text>
                </Pressable>

                {expandedWeekday === day.weekday ? (
                  <View className="gap-2">
                    {exercises?.map((exercise) => (
                      <Pressable
                        key={exercise._id}
                        onPress={() => addExercise(day.weekday, exercise)}
                        className="flex-row items-center justify-between rounded-lg border border-border px-3 py-2"
                      >
                        <Text className="text-sm text-text-primary">{exercise.name}</Text>
                        <Text className="text-xs font-semibold text-primary">Add</Text>
                      </Pressable>
                    )) ?? <Text className="text-xs text-text-tertiary">Loading exercises...</Text>}
                  </View>
                ) : null}
              </View>
            ) : (
              <Text className="text-xs text-text-tertiary">Rest day.</Text>
            )}
          </View>
        ))}
      </View>

      <Pressable
        onPress={handleSave}
        disabled={isSaving}
        className={`rounded-xl py-3 ${isSaving ? "bg-primary/60" : "bg-primary"}`}
      >
        <Text className="text-center font-semibold text-white">
          {isSaving ? "Saving..." : submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}
