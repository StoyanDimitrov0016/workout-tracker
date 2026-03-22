import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import { MeasurementSaveFeedback } from "@/features/measurements/components/measurement-save-feedback";
import { WeightEntryAdjuster } from "@/features/measurements/components/weight-entry-adjuster";
import { measurementsResource } from "@/features/measurements/data/measurements-resource";
import {
  WeightEntryMapper,
  type WeightEntryFormValues,
} from "@/features/measurements/mappers/weight-entry-mapper";
import { WeightEntrySchema } from "@/features/measurements/schemas/weight-entry-schema";
import { clampWeight, formatWeightKg } from "@/features/measurements/utils/weight";

export function WeightEntryForm() {
  const addWeightEntry = measurementsResource.weight.useCreate();
  const recentEntries = measurementsResource.weight.useRecent(1);
  const latestWeightKg = recentEntries?.[0]?.weightKg ?? null;

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<WeightEntryFormValues>({
    defaultValues: { weightKg: "" },
  });

  const [deltaKg, setDeltaKg] = useState(0);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (latestWeightKg === null || isDirty) return;

    setValue("weightKg", formatWeightKg(latestWeightKg), { shouldDirty: false });
    setDeltaKg(0);
  }, [latestWeightKg, isDirty, setValue]);

  const handleDeltaChange = (delta: number) => {
    if (latestWeightKg === null) return;

    const nextValue = clampWeight(latestWeightKg + delta);
    clearErrors("weightKg");
    setSaveErrorMessage(null);
    setSuccessMessage(null);
    setDeltaKg(delta);
    setValue("weightKg", formatWeightKg(nextValue), { shouldDirty: true });
  };

  const onSubmit = async (values: WeightEntryFormValues) => {
    const parsed = WeightEntrySchema.safeParse(WeightEntryMapper.toInput(values));

    if (!parsed.success) {
      const issue = parsed.error.issues.find((candidate) => candidate.path[0] === "weightKg");
      setError("weightKg", {
        type: "validate",
        message: issue?.message ?? "Enter a valid number.",
      });
      return;
    }

    try {
      setSaveErrorMessage(null);
      await addWeightEntry(parsed.data);
      setValue("weightKg", WeightEntryMapper.toFormValues(parsed.data).weightKg, {
        shouldDirty: false,
      });
      setDeltaKg(0);
      setSuccessMessage("Weight entry saved.");
    } catch (error) {
      setSuccessMessage(null);
      setSaveErrorMessage(
        error instanceof Error ? error.message : "Could not save your weight entry."
      );
    }
  };

  return (
    <View className="gap-3 rounded-2xl border border-border bg-surface p-4">
      <Text className="text-lg font-semibold text-text-primary">Log your weight</Text>
      <Controller
        control={control}
        name="weightKg"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            value={value ?? ""}
            onChangeText={(text) => {
              clearErrors("weightKg");
              setDeltaKg(0);
              setSaveErrorMessage(null);
              setSuccessMessage(null);
              onChange(text);
            }}
            onBlur={onBlur}
            placeholder="enter your weigh"
            keyboardType="decimal-pad"
            className="rounded-xl border border-border px-3 py-3 text-text-primary"
            placeholderTextColor="#9ca3af"
          />
        )}
      />
      <WeightEntryAdjuster
        baseWeightKg={latestWeightKg}
        deltaKg={deltaKg}
        onDeltaChange={handleDeltaChange}
      />
      {errors.weightKg ? (
        <Text className="text-sm text-status-error">{errors.weightKg.message}</Text>
      ) : null}
      {saveErrorMessage ? (
        <MeasurementSaveFeedback kind="error" message={saveErrorMessage} />
      ) : null}
      {successMessage ? (
        <MeasurementSaveFeedback kind="success" message={successMessage} />
      ) : null}
      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className={`rounded-xl py-3 ${isSubmitting ? "bg-primary/60" : "bg-primary"}`}
      >
        <Text className="text-center font-semibold text-white">
          {isSubmitting ? "Saving..." : "Save entry"}
        </Text>
      </Pressable>
    </View>
  );
}
