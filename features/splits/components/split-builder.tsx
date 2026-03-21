import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import type { Id } from "@/convex/_generated/dataModel";
import {
  type BuilderDay,
  type BuilderExercise,
  type BuilderSetTarget,
  type SplitDayInput,
  type SplitInput,
} from "@/features/splits/components/split-builder-types";
import { SplitBuilderStepOne } from "@/features/splits/components/split-builder-step-one";
import { SplitBuilderStepTwo } from "@/features/splits/components/split-builder-step-two";
import { WEEKDAYS } from "@/features/splits/constants/weekdays";
import { splitResource } from "@/features/splits/data/split-resource";
import {
  parseValidatedPositiveInteger,
  validateTrainingDays,
} from "@/features/splits/utils/validation";

interface SplitBuilderProps {
  initialSplit: SplitInput | null;
  submitLabel: string;
  onSaved: () => void;
}

const DEFAULT_SET_TARGET: BuilderSetTarget = { reps: "", restSec: "120" };
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

function ensureSetTargets(setTargets: BuilderSetTarget[]) {
  return setTargets.length > 0 ? setTargets : createDefaultSetTargets(1);
}

function getPlaceholderForIndex(index: number) {
  return DAY_TITLE_PLACEHOLDERS[index % DAY_TITLE_PLACEHOLDERS.length];
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
        day?.exercises.map((exercise) => {
          const mappedTargets = exercise.setTargets.map((target) => ({
            reps: String(target.reps),
            restSec: String(target.restSec),
          }));
          const safeTargets = ensureSetTargets(mappedTargets);

          return {
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            setTargets: safeTargets,
          };
        }) ?? [],
    };
  });
}

export function SplitBuilder({ initialSplit, submitLabel, onSaved }: SplitBuilderProps) {
  const saveSplit = splitResource.useSave();
  const exercises = splitResource.useExercises();
  const [name, setName] = useState(initialSplit?.name ?? "");
  const [days, setDays] = useState<BuilderDay[]>(() => buildInitialDays(initialSplit));
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
    const payloadDays = days
      .filter((day) => day.isTraining)
      .map((day) => ({
        weekday: day.weekday,
        title: day.title.trim() || "Training",
        exercises: day.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          setTargets: ensureSetTargets(exercise.setTargets).map((set) => ({
            reps: parseValidatedPositiveInteger(set.reps),
            restSec: parseValidatedPositiveInteger(set.restSec),
          })),
        })),
      }));

    try {
      await saveSplit({ name: name.trim() || "My Split", days: payloadDays });
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
        canContinue={canContinue}
        hasTrainingDays={hasTrainingDays}
        hasExercises={hasExercises}
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
        onContinue={() => setStepAndReset(2)}
      />
    );
  }

  return (
    <SplitBuilderStepTwo
      trainingDays={trainingDays}
      placeholderByWeekday={placeholderByWeekday}
      expandedExerciseKey={expandedExerciseKey}
      copyMenuWeekday={copyMenuWeekday}
      submitLabel={submitLabel}
      isSaving={isSaving}
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
      onBack={() => setStepAndReset(1)}
      onSave={handleSave}
    />
  );
}
