import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
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
    defaultValues: WeightEntryMapper.toFormValues(null),
  });

  const [deltaKg, setDeltaKg] = useState(0);

  useEffect(() => {
    if (latestWeightKg === null || isDirty) return;

    setValue("weightKg", latestWeightKg, { shouldDirty: false });
    setDeltaKg(0);
  }, [latestWeightKg, isDirty, setValue]);

  const handleDeltaChange = (delta: number) => {
    if (latestWeightKg === null) return;

    const nextValue = clampWeight(latestWeightKg + delta);
    clearErrors("weightKg");
    setDeltaKg(delta);
    setValue("weightKg", nextValue, { shouldDirty: true });
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
          <NumberInput
            value={value}
            onChangeNumber={(nextValue) => {
              clearErrors("weightKg");
              setDeltaKg(0);
              onChange(nextValue);
            }}
            onBlur={onBlur}
            placeholder="Enter your weight"
            formatValue={formatWeightKg}
            error={errors.weightKg?.message}
          />
        )}
      />
      <WeightEntryAdjuster
        baseWeightKg={latestWeightKg}
        deltaKg={deltaKg}
        onDeltaChange={handleDeltaChange}
      />
      <Button
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        label={isSubmitting ? "Saving..." : "Save entry"}
      />
    </View>
  );
}
