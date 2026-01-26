import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import { api } from "@/convex/_generated/api";
import { WeightEntryAdjuster } from "@/features/measurements/components/weight-entry-adjuster";
import type { WeightEntryFormValues } from "@/features/measurements/schemas/weight-entry-schema";
import { weightEntrySchema } from "@/features/measurements/schemas/weight-entry-schema";
import { clampWeight, formatWeightKg, parseWeightKg } from "@/features/measurements/utils/weight";

export function WeightEntryForm() {
  const addWeightEntry = useMutation(api.weights.create);
  const recentEntries = useQuery(api.weights.listRecent, { limit: 1 });
  const latestWeightKg = recentEntries?.[0]?.weightKg ?? null;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<WeightEntryFormValues>({
    defaultValues: { weightKg: "" },
    resolver: zodResolver(weightEntrySchema),
  });

  const [deltaKg, setDeltaKg] = useState(0);

  useEffect(() => {
    if (latestWeightKg === null || isDirty) return;

    setValue("weightKg", formatWeightKg(latestWeightKg), {
      shouldDirty: false,
      shouldValidate: true,
    });
    setDeltaKg(0);
  }, [latestWeightKg, isDirty, setValue]);

  const handleDeltaChange = (delta: number) => {
    if (latestWeightKg === null) return;

    const nextValue = clampWeight(latestWeightKg + delta);
    setDeltaKg(delta);
    setValue("weightKg", formatWeightKg(nextValue), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: WeightEntryFormValues) => {
    const parsed = parseWeightKg(values.weightKg);
    if (parsed === null) return;

    try {
      await addWeightEntry({ weightKg: parsed });
      setValue("weightKg", formatWeightKg(parsed), {
        shouldDirty: false,
        shouldValidate: true,
      });
      setDeltaKg(0);
    } catch {
      setValue("weightKg", values.weightKg, { shouldValidate: true });
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
              setDeltaKg(0);
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
