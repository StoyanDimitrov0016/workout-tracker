import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import { api } from "@/convex/_generated/api";
import {
  circumferenceFieldNames,
  circumferenceLabels,
} from "@/features/measurements/constants/circumference-fields";
import { circumferenceSchema } from "@/features/measurements/schemas/circumference-schema";
import type { CircumferenceFormValues } from "@/features/measurements/schemas/circumference-schema";
import type { CircumferenceMutationInput } from "@/features/measurements/types/circumference";
import { parseMeasurementInput } from "@/features/measurements/utils/parse-measurement-input";

const defaultValues = circumferenceFieldNames.reduce((acc, key) => {
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
    const parsedValues = circumferenceFieldNames.reduce((acc, key) => {
      const { value } = parseMeasurementInput(values[key]);
      acc[key] = value;
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
            <FieldLabel text={circumferenceLabels.neckCm} />
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
            <FieldLabel text={circumferenceLabels.chestCm} />
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
            <FieldLabel text={circumferenceLabels.waistCm} />
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
            <FieldLabel text={circumferenceLabels.hipsCm} />
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
            <FieldLabel text={circumferenceLabels.upperArmLeftCm} />
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
            <FieldLabel text={circumferenceLabels.upperArmRightCm} />
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
            <FieldLabel text={circumferenceLabels.forearmLeftCm} />
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
            <FieldLabel text={circumferenceLabels.forearmRightCm} />
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
            <FieldLabel text={circumferenceLabels.thighLeftCm} />
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
            <FieldLabel text={circumferenceLabels.thighRightCm} />
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
            <FieldLabel text={circumferenceLabels.calfLeftCm} />
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
            <FieldLabel text={circumferenceLabels.calfRightCm} />
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
