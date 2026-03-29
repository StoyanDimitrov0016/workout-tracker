import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { Id } from "@/convex/_generated/dataModel";
import {
  type BuilderDay,
  type BuilderExercise,
  type BuilderSetTarget,
  type SplitFormValues,
  type SplitInput,
} from "@/features/splits/components/split-builder-types";
import { SplitBuilderStepOne } from "@/features/splits/components/split-builder-step-one";
import { SplitBuilderStepTwo } from "@/features/splits/components/split-builder-step-two";
import { WEEKDAYS } from "@/features/splits/constants/weekdays";
import { splitResource } from "@/features/splits/data/split-resource";
import { SplitMapper } from "@/features/splits/mappers/split-mapper";
import { SplitSchema } from "@/features/splits/schemas/split-schema";
import { validateTrainingDays } from "@/features/splits/utils/validation";

interface SplitBuilderProps {
  initialSplit: SplitInput | null;
  submitLabel: string;
  onSaved: () => void;
}

const DEFAULT_SET_TARGET: BuilderSetTarget = { reps: "", weightKg: "0", restSec: "120" };
const DEFAULT_SET_COUNT = 3;
const DAY_TITLE_PLACEHOLDERS = [
  "Upper A",
  "Lower A",
  "Push Midweek",
  "Pull",
  "Legs",
  "Upper B",
  "Lower B",
];

function createDefaultSetTargets(count: number) {
  const safeCount = Math.max(1, count);
  return Array.from({ length: safeCount }, () => ({ ...DEFAULT_SET_TARGET }));
}

function getPlaceholderForIndex(index: number) {
  return DAY_TITLE_PLACEHOLDERS[index % DAY_TITLE_PLACEHOLDERS.length];
}

export function SplitBuilder({ initialSplit, submitLabel, onSaved }: SplitBuilderProps) {
  const saveSplit = splitResource.useSave();
  const exercises = splitResource.useExercises();
  const initialFormValues = SplitMapper.toFormValues(initialSplit);
  const [name, setName] = useState(initialFormValues.name);
  const [days, setDays] = useState<BuilderDay[]>(initialFormValues.days);
  const [step, setStep] = useState<1 | 2>(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [expandedWeekday, setExpandedWeekday] = useState<number | null>(null);
  const [expandedExerciseKey, setExpandedExerciseKey] = useState<string | null>(null);
  const [copyMenuWeekday, setCopyMenuWeekday] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const searchResults = splitResource.useExerciseSearch(debouncedText, 20);

  const trainingDays = useMemo(() => days.filter((day) => day.isTraining), [days]);
  const placeholderByWeekday = useMemo(
    () =>
      new Map(WEEKDAYS.map((weekday, index) => [weekday.weekday, getPlaceholderForIndex(index)])),
    []
  );
  const hasTrainingDays = trainingDays.length > 0;
  const hasExercises = trainingDays.some((day) => day.exercises.length > 0);
  const canContinue = hasTrainingDays && hasExercises;
  const validationSummary = useMemo(() => validateTrainingDays(days), [days]);

  const setStepAndReset = (nextStep: 1 | 2) => {
    setStep(nextStep);
    setExpandedWeekday(null);
    setExpandedExerciseKey(null);
    setCopyMenuWeekday(null);
    setSearchText("");
    setShowAllExercises(false);
    setSaveErrorMessage(null);
  };

  const toggleTraining = (weekday: number) => {
    setDays((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? {
              ...day,
              isTraining: !day.isTraining,
              title: day.isTraining ? "" : day.title || "",
              exercises: day.isTraining ? [] : day.exercises,
            }
          : day
      )
    );
  };

  const updateTitle = (weekday: number, title: string) => {
    setSaveErrorMessage(null);
    setDays((prev) => prev.map((day) => (day.weekday === weekday ? { ...day, title } : day)));
  };

  const updateExercise = (weekday: number, index: number, next: Partial<BuilderExercise>) => {
    setSaveErrorMessage(null);
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
    const exerciseKey = `${weekday}-${index}`;
    setSaveErrorMessage(null);
    setDays((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? { ...day, exercises: day.exercises.filter((_, idx) => idx !== index) }
          : day
      )
    );
    if (expandedExerciseKey === exerciseKey) {
      setExpandedExerciseKey(null);
    }
  };

  const addExercise = (weekday: number, exercise: { _id: Id<"exercises">; name: string }) => {
    setSaveErrorMessage(null);
    setDays((prev) =>
      prev.map((day) => {
        if (day.weekday !== weekday) return day;
        return {
          ...day,
          exercises: [
            ...day.exercises,
            {
              exerciseId: exercise._id,
              exerciseName: exercise.name,
              setTargets: createDefaultSetTargets(DEFAULT_SET_COUNT),
            },
          ],
        };
      })
    );
  };

  const cloneExercises = (items: BuilderExercise[]) =>
    items.map((exercise) => ({
      ...exercise,
      setTargets: exercise.setTargets.map((target) => ({ ...target })),
    }));

  const copyExercisesToDay = (sourceWeekday: number, targetWeekday: number) => {
    setSaveErrorMessage(null);
    setDays((prev) =>
      prev.map((day) => {
        if (day.weekday === sourceWeekday) return day;
        if (day.weekday !== targetWeekday) return day;

        const source = prev.find((item) => item.weekday === sourceWeekday);
        if (!source) return day;

        return {
          ...day,
          exercises: cloneExercises(source.exercises),
        };
      })
    );
    setExpandedExerciseKey(null);
    setCopyMenuWeekday(null);
  };

  const copyExercisesToAll = (sourceWeekday: number) => {
    setSaveErrorMessage(null);
    setDays((prev) => {
      const source = prev.find((day) => day.weekday === sourceWeekday);
      if (!source) return prev;
      return prev.map((day) =>
        day.weekday === sourceWeekday || !day.isTraining
          ? day
          : { ...day, exercises: cloneExercises(source.exercises) }
      );
    });
    setExpandedExerciseKey(null);
    setCopyMenuWeekday(null);
  };

  const handleSave = async () => {
    if (validationSummary.hasErrors) {
      setSaveErrorMessage("Fix the highlighted set targets before saving your split.");
      return;
    }

    setSaveErrorMessage(null);
    setIsSaving(true);
    const input = SplitMapper.toInput({ name, days } satisfies SplitFormValues);
    const parsed = SplitSchema.safeParse(input);
    if (!parsed.success) {
      setSaveErrorMessage("Fix the highlighted set targets before saving your split.");
      setIsSaving(false);
      return;
    }

    try {
      await saveSplit(input);
      onSaved();
    } catch (error) {
      setSaveErrorMessage(error instanceof Error ? error.message : "Could not save your split.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setShowAllExercises(false);
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedText(searchText.trim());
    }, 300);
    return () => clearTimeout(handle);
  }, [searchText]);

  const toggleShowAll = () => {
    setShowAllExercises(true);
  };

  if (step === 1) {
    return (
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <SplitBuilderStepOne
            name={name}
            days={days}
            placeholderByWeekday={placeholderByWeekday}
            expandedWeekday={expandedWeekday}
            searchText={searchText}
            debouncedText={debouncedText}
            showAllExercises={showAllExercises}
            exercises={exercises}
            searchResults={searchResults}
            onNameChange={(value) => {
              setSaveErrorMessage(null);
              setName(value);
            }}
            onToggleTraining={toggleTraining}
            onUpdateTitle={updateTitle}
            onRemoveExercise={removeExercise}
            onToggleExercises={(weekday) =>
              setExpandedWeekday((prev) => {
                const next = prev === weekday ? null : weekday;
                if (next === null) {
                  setSearchText("");
                  setShowAllExercises(false);
                }
                return next;
              })
            }
            onSearchChange={handleSearchChange}
            onShowAllExercises={toggleShowAll}
            onAddExercise={addExercise}
          />
        </ScrollView>

        <View className="gap-3 border-t border-border bg-background pt-4">
          <Pressable
            onPress={() => setStepAndReset(2)}
            disabled={!canContinue}
            className={`rounded-xl py-3 ${canContinue ? "bg-primary" : "bg-primary/40"}`}
          >
            <Text className="text-center font-semibold text-white">Continue to details</Text>
          </Pressable>
          {!hasTrainingDays ? (
            <Text className="text-center text-xs text-text-tertiary">
              Select at least one training day to continue.
            </Text>
          ) : !hasExercises ? (
            <Text className="text-center text-xs text-text-tertiary">
              Add at least one exercise to continue.
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <SplitBuilderStepTwo
          trainingDays={trainingDays}
          placeholderByWeekday={placeholderByWeekday}
          expandedExerciseKey={expandedExerciseKey}
          copyMenuWeekday={copyMenuWeekday}
          saveErrorMessage={saveErrorMessage}
          validationErrorsByExerciseKey={validationSummary.errorsByExerciseKey}
          totalInvalidFields={validationSummary.totalInvalidFields}
          onToggleExpandedExercise={(exerciseKey) =>
            setExpandedExerciseKey((prev) => (prev === exerciseKey ? null : exerciseKey))
          }
          onUpdateExercise={updateExercise}
          onRemoveExercise={removeExercise}
          onToggleCopyMenu={(weekday) =>
            setCopyMenuWeekday((prev) => (prev === weekday ? null : weekday))
          }
          onCopyExercisesToDay={copyExercisesToDay}
          onCopyExercisesToAll={copyExercisesToAll}
        />
      </ScrollView>

      <View className="flex-row gap-2 border-t border-border bg-background pt-4">
        <Pressable
          onPress={() => setStepAndReset(1)}
          className="flex-1 rounded-xl border border-border px-3 py-3"
        >
          <Text className="text-center font-semibold text-text-primary">Back</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          disabled={isSaving || validationSummary.totalInvalidFields > 0}
          className={`flex-1 rounded-xl py-3 ${
            isSaving || validationSummary.totalInvalidFields > 0 ? "bg-primary/60" : "bg-primary"
          }`}
        >
          <Text className="text-center font-semibold text-white">
            {isSaving ? "Saving..." : submitLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
