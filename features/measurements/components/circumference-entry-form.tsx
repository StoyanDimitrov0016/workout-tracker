import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import { MeasurementSaveFeedback } from "@/features/measurements/components/measurement-save-feedback";
import { measurementsResource } from "@/features/measurements/data/measurements-resource";
import {
  circumferenceFieldNames,
  circumferenceLabels,
} from "@/features/measurements/constants/circumference-fields";
import {
  circumferenceSchema,
  type CircumferenceFormValues,
} from "@/features/measurements/schemas/circumference-schema";
import type { CircumferenceMutationInput } from "@/features/measurements/types/circumference";
import { parseMeasurementInput } from "@/features/measurements/utils/parse-measurement-input";

const defaultValues = circumferenceFieldNames.reduce((acc, key) => {
  acc[key] = "";
  return acc;
}, {} as CircumferenceFormValues);

type MeasurementFieldProps = {
  control: ReturnType<typeof useForm<CircumferenceFormValues>>["control"];
  errorMessage?: string;
  inputClassName: string;
  name: keyof CircumferenceFormValues;
  onEdit: () => void;
  label: string;
};

function FieldLabel({ text }: { text: string }) {
  return <Text className="text-xs text-text-secondary">{text}</Text>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="text-xs text-status-error">{message}</Text>;
}

function MeasurementField({
  control,
  errorMessage,
  inputClassName,
  label,
  name,
  onEdit,
}: MeasurementFieldProps) {
  return (
    <View className="flex-1 gap-2">
      <FieldLabel text={label} />
      <Controller
        control={control}
        name={name}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={(text) => {
              onEdit();
              onChange(text);
            }}
            onBlur={onBlur}
            keyboardType="decimal-pad"
            className={inputClassName}
            placeholderTextColor="#9ca3af"
          />
        )}
      />
      <FieldError message={errorMessage} />
    </View>
  );
}

export function CircumferenceEntryForm() {
  const addCircumferenceEntry = measurementsResource.circumferences.useCreate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CircumferenceFormValues>({
    defaultValues,
    resolver: zodResolver(circumferenceSchema),
  });
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearFeedback = () => {
    setSaveErrorMessage(null);
    setSuccessMessage(null);
  };

  const onSubmit = async (values: CircumferenceFormValues) => {
    const parsedValues = circumferenceFieldNames.reduce((acc, key) => {
      const { value } = parseMeasurementInput(values[key]);
      acc[key] = value;
      return acc;
    }, {} as CircumferenceMutationInput);

    try {
      setSaveErrorMessage(null);
      await addCircumferenceEntry(parsedValues);
      reset(defaultValues);
      setSuccessMessage("Circumference measurements saved.");
    } catch (error) {
      setSuccessMessage(null);
      setSaveErrorMessage(
        error instanceof Error ? error.message : "Could not save your measurements."
      );
    }
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
          <MeasurementField
            control={control}
            errorMessage={errors.neckCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.neckCm}
            name="neckCm"
            onEdit={clearFeedback}
          />
          <MeasurementField
            control={control}
            errorMessage={errors.chestCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.chestCm}
            name="chestCm"
            onEdit={clearFeedback}
          />
        </View>

        <View className="flex-row gap-3">
          <MeasurementField
            control={control}
            errorMessage={errors.waistCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.waistCm}
            name="waistCm"
            onEdit={clearFeedback}
          />
          <MeasurementField
            control={control}
            errorMessage={errors.hipsCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.hipsCm}
            name="hipsCm"
            onEdit={clearFeedback}
          />
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-xs text-text-secondary">Arms</Text>
        <View className="flex-row gap-3">
          <MeasurementField
            control={control}
            errorMessage={errors.upperArmLeftCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.upperArmLeftCm}
            name="upperArmLeftCm"
            onEdit={clearFeedback}
          />
          <MeasurementField
            control={control}
            errorMessage={errors.upperArmRightCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.upperArmRightCm}
            name="upperArmRightCm"
            onEdit={clearFeedback}
          />
        </View>
        <View className="flex-row gap-3">
          <MeasurementField
            control={control}
            errorMessage={errors.forearmLeftCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.forearmLeftCm}
            name="forearmLeftCm"
            onEdit={clearFeedback}
          />
          <MeasurementField
            control={control}
            errorMessage={errors.forearmRightCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.forearmRightCm}
            name="forearmRightCm"
            onEdit={clearFeedback}
          />
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-xs text-text-secondary">Legs</Text>
        <View className="flex-row gap-3">
          <MeasurementField
            control={control}
            errorMessage={errors.thighLeftCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.thighLeftCm}
            name="thighLeftCm"
            onEdit={clearFeedback}
          />
          <MeasurementField
            control={control}
            errorMessage={errors.thighRightCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.thighRightCm}
            name="thighRightCm"
            onEdit={clearFeedback}
          />
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-xs text-text-secondary">Calves</Text>
        <View className="flex-row gap-3">
          <MeasurementField
            control={control}
            errorMessage={errors.calfLeftCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.calfLeftCm}
            name="calfLeftCm"
            onEdit={clearFeedback}
          />
          <MeasurementField
            control={control}
            errorMessage={errors.calfRightCm?.message}
            inputClassName={inputClassName}
            label={circumferenceLabels.calfRightCm}
            name="calfRightCm"
            onEdit={clearFeedback}
          />
        </View>
      </View>

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
          {isSubmitting ? "Saving..." : "Save measurements"}
        </Text>
      </Pressable>
    </View>
  );
}
