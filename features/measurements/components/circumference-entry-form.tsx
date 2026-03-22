import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import { MeasurementSaveFeedback } from "@/features/measurements/components/measurement-save-feedback";
import { measurementsResource } from "@/features/measurements/data/measurements-resource";
import {
  CircumferenceMapper,
  type CircumferenceFormValues,
} from "@/features/measurements/mappers/circumference-mapper";
import {
  circumferenceLabels,
  type CircumferenceField,
  circumferenceFieldNames,
} from "@/features/measurements/constants/circumference-fields";
import { CircumferenceSchema } from "@/features/measurements/schemas/circumference-schema";

const defaultValues = CircumferenceMapper.toFormValues(null);

type MeasurementFieldProps = {
  control: ReturnType<typeof useForm<CircumferenceFormValues>>["control"];
  errorMessage?: string;
  inputClassName: string;
  name: keyof CircumferenceFormValues;
  onEdit: (name: keyof CircumferenceFormValues) => void;
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
              onEdit(name);
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
    clearErrors,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CircumferenceFormValues>({
    defaultValues,
  });
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearFeedback = (name?: CircumferenceField) => {
    if (name) {
      clearErrors(name);
    }
    setSaveErrorMessage(null);
    setSuccessMessage(null);
  };

  const onSubmit = async (values: CircumferenceFormValues) => {
    const parsed = CircumferenceSchema.safeParse(CircumferenceMapper.toInput(values));

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (!circumferenceFieldNames.includes(fieldName as CircumferenceField)) {
          return;
        }

        setError(fieldName as CircumferenceField, {
          type: "validate",
          message: issue.message,
        });
      });
      return;
    }

    try {
      setSaveErrorMessage(null);
      await addCircumferenceEntry(parsed.data);
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
