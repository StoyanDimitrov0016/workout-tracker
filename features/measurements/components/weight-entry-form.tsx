import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import { WeightEntryAdjuster } from "@/features/measurements/components/weight-entry-adjuster";
import { measurementsResource } from "@/features/measurements/data/measurements-resource";
import {
  WeightEntryMapper,
  type WeightEntryFormValues,
} from "@/features/measurements/mappers/weight-entry-mapper";
import { WeightEntrySchema } from "@/features/measurements/schemas/weight-entry-schema";
import { clampWeight, formatWeightKg } from "@/features/measurements/utils/weight";
import { useToast } from "@/hooks/use-toast";

type WeightEntryFormProps = {
  latestWeightKg: number | null;
};

export function WeightEntryForm({ latestWeightKg }: WeightEntryFormProps) {
  const addWeightEntry = measurementsResource.weight.useCreate();
  const { showError, showSuccess } = useToast();

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

  useEffect(() => {
    if (latestWeightKg === null || isDirty) return;

    setValue("weightKg", formatWeightKg(latestWeightKg), { shouldDirty: false });
    setDeltaKg(0);
  }, [latestWeightKg, isDirty, setValue]);

  const handleDeltaChange = (delta: number) => {
    if (latestWeightKg === null) return;

    const nextValue = clampWeight(latestWeightKg + delta);
    clearErrors("weightKg");
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
      await addWeightEntry(parsed.data);
      setValue("weightKg", WeightEntryMapper.toFormValues(parsed.data).weightKg, {
        shouldDirty: false,
      });
      setDeltaKg(0);
      showSuccess("Weight entry saved.");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Could not save your weight entry.");
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
              onChange(text);
            }}
            onBlur={onBlur}
            placeholder="Enter your weight"
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
