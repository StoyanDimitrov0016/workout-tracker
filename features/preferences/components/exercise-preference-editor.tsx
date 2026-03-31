import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Linking, Pressable, Text, TextInput, View } from "react-native";

import type { Id } from "@/convex/_generated/dataModel";
import { MeasurementSaveFeedback } from "@/features/measurements/components/measurement-save-feedback";
import {
  MAX_EXERCISE_NOTES_LENGTH,
  MAX_EXERCISE_REFERENCE_URL_LENGTH,
} from "@/features/preferences/constants/exercise-preferences";
import {
  ExercisePreferenceMapper,
  type ExercisePreferenceFormValues,
} from "@/features/preferences/mappers/exercise-preference-mapper";
import {
  ExercisePreferenceSchema,
  type ExercisePreferenceInput,
} from "@/features/preferences/schemas/exercise-preference-schema";

type ExercisePreferenceEditorProps = {
  exerciseId: Id<"exercises">;
  exerciseName: string;
  muscleName: string;
  referenceUrl: string;
  notes: string;
  hasPreference: boolean;
  onSave: (input: { exerciseId: Id<"exercises"> } & ExercisePreferenceInput) => Promise<unknown>;
};

export function ExercisePreferenceEditor({
  exerciseId,
  exerciseName,
  muscleName,
  referenceUrl,
  notes,
  hasPreference,
  onSave,
}: ExercisePreferenceEditorProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    setError,
    formState: { errors, isDirty, isSubmitting },
    watch,
  } = useForm<ExercisePreferenceFormValues>({
    defaultValues: ExercisePreferenceMapper.toFormValues({
      referenceUrl,
      notes,
    }),
  });

  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (isDirty) return;

    reset(
      ExercisePreferenceMapper.toFormValues({
        referenceUrl,
        notes,
      }),
      { keepDirty: false }
    );
  }, [exerciseId, isDirty, notes, referenceUrl, reset]);

  const savedReferenceUrl = referenceUrl.trim();
  const savedNotes = notes.trim();
  const watchedReferenceUrl = watch("referenceUrl") ?? "";
  const watchedNotes = watch("notes") ?? "";

  const handleReset = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    clearErrors();
    reset(
      ExercisePreferenceMapper.toFormValues({
        referenceUrl,
        notes,
      }),
      { keepDirty: false }
    );
  };

  const onSubmit = async (values: ExercisePreferenceFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const parsed = ExercisePreferenceSchema.safeParse(ExercisePreferenceMapper.toInput(values));

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (field === "referenceUrl" || field === "notes") {
          setError(field, {
            type: "validate",
            message: issue.message,
          });
        }
      });
      return;
    }

    try {
      await onSave({
        exerciseId,
        referenceUrl: parsed.data.referenceUrl,
        notes: parsed.data.notes,
      });
      reset(ExercisePreferenceMapper.toFormValues(parsed.data), { keepDirty: false });
      setSuccessMessage(
        parsed.data.referenceUrl || parsed.data.notes
          ? "Exercise preference saved."
          : "Exercise preference cleared."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not save the exercise preference."
      );
    }
  };

  return (
    <View className="gap-4 rounded-2xl border border-border bg-surface p-4">
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-semibold text-text-primary">{exerciseName}</Text>
          {hasPreference ? (
            <View className="rounded-full bg-primary/10 px-2 py-1">
              <Text className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Saved
              </Text>
            </View>
          ) : null}
        </View>
        <Text className="text-sm text-text-secondary">{muscleName}</Text>
      </View>

      {savedReferenceUrl ? (
        <Pressable
          onPress={() => void Linking.openURL(savedReferenceUrl)}
          className="self-start rounded-full border border-border bg-card px-3 py-2"
        >
          <Text className="text-xs font-semibold text-text-secondary">Open saved reference</Text>
        </Pressable>
      ) : null}

      <View className="gap-1">
        <Text className="text-sm font-semibold text-text-primary">Reference URL</Text>
        <Controller
          control={control}
          name="referenceUrl"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              value={value ?? ""}
              onChangeText={(nextValue) => {
                clearErrors("referenceUrl");
                setErrorMessage(null);
                setSuccessMessage(null);
                onChange(nextValue);
              }}
              onBlur={onBlur}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              placeholder="https://youtube.com/shorts/..."
              placeholderTextColor="#9ca3af"
              className="rounded-xl border border-border px-3 py-3 text-text-primary"
            />
          )}
        />
        <Text className="text-xs text-text-tertiary">
          {watchedReferenceUrl.trim().length}/{MAX_EXERCISE_REFERENCE_URL_LENGTH}
        </Text>
        {errors.referenceUrl ? (
          <Text className="text-sm text-status-error">{errors.referenceUrl.message}</Text>
        ) : null}
      </View>

      <View className="gap-1">
        <Text className="text-sm font-semibold text-text-primary">Notes</Text>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              value={value ?? ""}
              onChangeText={(nextValue) => {
                clearErrors("notes");
                setErrorMessage(null);
                setSuccessMessage(null);
                onChange(nextValue);
              }}
              onBlur={onBlur}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Seat position, grip, setup, reminders, or technique cues..."
              placeholderTextColor="#9ca3af"
              className="min-h-32 rounded-xl border border-border px-3 py-3 text-text-primary"
            />
          )}
        />
        <Text className="text-xs text-text-tertiary">
          {watchedNotes.trim().length}/{MAX_EXERCISE_NOTES_LENGTH}
        </Text>
        {errors.notes ? (
          <Text className="text-sm text-status-error">{errors.notes.message}</Text>
        ) : null}
      </View>

      {savedNotes ? (
        <View className="gap-1 rounded-xl border border-border bg-card p-3">
          <Text className="text-xs text-text-tertiary">Current saved notes</Text>
          <Text className="text-sm text-text-primary">{savedNotes}</Text>
        </View>
      ) : null}

      {errorMessage ? <MeasurementSaveFeedback kind="error" message={errorMessage} /> : null}
      {successMessage ? <MeasurementSaveFeedback kind="success" message={successMessage} /> : null}

      <View className="flex-row gap-3">
        <Pressable
          onPress={handleReset}
          disabled={isSubmitting || !isDirty}
          className={`flex-1 rounded-xl border border-border py-3 ${
            isSubmitting || !isDirty ? "opacity-50" : ""
          }`}
        >
          <Text className="text-center font-semibold text-text-secondary">Reset</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isDirty}
          className={`flex-1 rounded-xl py-3 ${
            isSubmitting || !isDirty ? "bg-primary/60" : "bg-primary"
          }`}
        >
          <Text className="text-center font-semibold text-white">
            {isSubmitting ? "Saving..." : "Save preference"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
