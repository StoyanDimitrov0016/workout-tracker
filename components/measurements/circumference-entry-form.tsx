import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { z } from "zod";

import { api } from "@/convex/_generated/api";

const fieldNames = [
  "neckCm",
  "chestCm",
  "waistCm",
  "hipsCm",
  "upperArmLeftCm",
  "upperArmRightCm",
  "thighLeftCm",
  "thighRightCm",
  "forearmLeftCm",
  "forearmRightCm",
  "calfLeftCm",
  "calfRightCm",
] as const;

type CircumferenceField = (typeof fieldNames)[number];

const labels: Record<CircumferenceField, string> = {
  neckCm: "Neck (cm)",
  chestCm: "Chest (cm)",
  waistCm: "Waist (cm)",
  hipsCm: "Hips (cm)",
  upperArmLeftCm: "Upper arm L (cm)",
  upperArmRightCm: "Upper arm R (cm)",
  thighLeftCm: "Thigh L (cm)",
  thighRightCm: "Thigh R (cm)",
  forearmLeftCm: "Forearm L (cm)",
  forearmRightCm: "Forearm R (cm)",
  calfLeftCm: "Calf L (cm)",
  calfRightCm: "Calf R (cm)",
};

const circumferenceSchema = z
  .object({
    neckCm: z.string().min(1, "Required"),
    chestCm: z.string().min(1, "Required"),
    waistCm: z.string().min(1, "Required"),
    hipsCm: z.string().min(1, "Required"),
    upperArmLeftCm: z.string().min(1, "Required"),
    upperArmRightCm: z.string().min(1, "Required"),
    thighLeftCm: z.string().min(1, "Required"),
    thighRightCm: z.string().min(1, "Required"),
    forearmLeftCm: z.string().min(1, "Required"),
    forearmRightCm: z.string().min(1, "Required"),
    calfLeftCm: z.string().min(1, "Required"),
    calfRightCm: z.string().min(1, "Required"),
  })
  .superRefine((values, ctx) => {
    fieldNames.forEach((name) => {
      const raw = values[name];
      const normalized = raw.replace(",", ".").trim();
      const parsed = Number.parseFloat(normalized);
      if (Number.isNaN(parsed) || parsed <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [name],
          message: "Enter a valid number",
        });
      }
    });
  });

type CircumferenceFormValues = z.infer<typeof circumferenceSchema>;

type CircumferenceMutationInput = {
  [Key in CircumferenceField]: number;
};

const defaultValues = fieldNames.reduce((acc, key) => {
  acc[key] = "";
  return acc;
}, {} as CircumferenceFormValues);

function FieldLabel({ text }: { text: string }) {
  return <Text className="text-xs text-text-secondary">{text}</Text>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="text-xs text-status-error">{message}</Text>;
}

export function CircumferenceEntryForm() {
  const addCircumferenceEntry = useMutation(api.circumferences.create);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CircumferenceFormValues>({
    defaultValues,
    resolver: zodResolver(circumferenceSchema),
  });

  const onSubmit = async (values: CircumferenceFormValues) => {
    const parsedValues = fieldNames.reduce((acc, key) => {
      const normalized = values[key].replace(",", ".").trim();
      acc[key] = Number.parseFloat(normalized);
      return acc;
    }, {} as CircumferenceMutationInput);

    await addCircumferenceEntry(parsedValues);
    reset(defaultValues);
  };

  const inputClassName = useMemo(
    () => "rounded-xl border border-border px-3 py-3 text-text-primary",
    []
  );

  return (
    <View className="gap-4 rounded-2xl border border-border bg-surface p-4">
      <Text className="text-lg font-semibold text-text-primary">Log circumferences</Text>

      <View className="gap-3">
        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.neckCm} />
            <Controller
              control={control}
              name="neckCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.neckCm?.message} />
          </View>
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.chestCm} />
            <Controller
              control={control}
              name="chestCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.chestCm?.message} />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.waistCm} />
            <Controller
              control={control}
              name="waistCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.waistCm?.message} />
          </View>
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.hipsCm} />
            <Controller
              control={control}
              name="hipsCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.hipsCm?.message} />
          </View>
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-xs text-text-secondary">Arms</Text>
        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.upperArmLeftCm} />
            <Controller
              control={control}
              name="upperArmLeftCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.upperArmLeftCm?.message} />
          </View>
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.upperArmRightCm} />
            <Controller
              control={control}
              name="upperArmRightCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.upperArmRightCm?.message} />
          </View>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.forearmLeftCm} />
            <Controller
              control={control}
              name="forearmLeftCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.forearmLeftCm?.message} />
          </View>
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.forearmRightCm} />
            <Controller
              control={control}
              name="forearmRightCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.forearmRightCm?.message} />
          </View>
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-xs text-text-secondary">Legs</Text>
        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.thighLeftCm} />
            <Controller
              control={control}
              name="thighLeftCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.thighLeftCm?.message} />
          </View>
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.thighRightCm} />
            <Controller
              control={control}
              name="thighRightCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.thighRightCm?.message} />
          </View>
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-xs text-text-secondary">Calves</Text>
        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.calfLeftCm} />
            <Controller
              control={control}
              name="calfLeftCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.calfLeftCm?.message} />
          </View>
          <View className="flex-1 gap-2">
            <FieldLabel text={labels.calfRightCm} />
            <Controller
              control={control}
              name="calfRightCm"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  className={inputClassName}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            <FieldError message={errors.calfRightCm?.message} />
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className={`rounded-xl py-3 ${isSubmitting ? "bg-primary/60" : "bg-primary"}`}
      >
        <Text className="text-center font-semibold text-white">
          {isSubmitting ? "Saving..." : "Save measurements"}
        </Text>
      </Pressable>
    </View>
  );
}
