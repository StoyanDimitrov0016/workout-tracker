import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { WeightEntryAdjuster } from "@/components/weights/weight-entry-adjuster";
import { api } from "@/convex/_generated/api";

const MIN_WEIGHT_KG = 30;
const MAX_WEIGHT_KG = 200;
const STEP_KG = 0.1;

function clampWeight(value: number) {
  return Math.min(Math.max(value, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
}

function formatWeightKg(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
}

function parseWeightKg(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);

  if (Number.isNaN(parsed)) return null;
  return parsed;
}

function validateWeight(value: string) {
  const parsed = parseWeightKg(value);
  if (parsed === null) return "Enter a valid number.";
  if (parsed < MIN_WEIGHT_KG || parsed > MAX_WEIGHT_KG) {
    return `Enter a weight between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg.`;
  }
  if (Math.round(parsed * 10) / 10 !== parsed) {
    return `Use ${STEP_KG} kg precision (e.g. 72.4).`;
  }
  return null;
}

const weightEntrySchema = z.object({
  weightKg: z
    .string()
    .min(1, "Enter your weight.")
    .superRefine((value, ctx) => {
      const error = validateWeight(value);
      if (error) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
      }
    }),
});

type WeightEntryFormValues = z.infer<typeof weightEntrySchema>;

export function WeightEntryForm() {
  const addWeightEntry = useMutation(api.weightEntries.add);
  const recentEntries = useQuery(api.weightEntries.listRecent, { limit: 1 });
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
    } catch (submissionError) {
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
            placeholder="e.g. 72.4"
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
