import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

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
import { useToast } from "@/hooks/use-toast";

const defaultValues = CircumferenceMapper.toFormValues(null);
const fieldGroups: Array<{
  title?: string;
  rows: Array<[CircumferenceField, CircumferenceField]>;
}> = [
  {
    rows: [
      ["neckCm", "chestCm"],
      ["waistCm", "hipsCm"],
    ],
  },
  {
    title: "Arms",
    rows: [
      ["upperArmLeftCm", "upperArmRightCm"],
      ["forearmLeftCm", "forearmRightCm"],
    ],
  },
  {
    title: "Legs",
    rows: [["thighLeftCm", "thighRightCm"]],
  },
  {
    title: "Calves",
    rows: [["calfLeftCm", "calfRightCm"]],
  },
];

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
  const { showError, showSuccess } = useToast();
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

  const clearFeedback = (name?: CircumferenceField) => {
    if (name) {
      clearErrors(name);
    }
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
      await addCircumferenceEntry(parsed.data);
      reset(defaultValues);
      showSuccess("Circumference measurements saved.");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Could not save your measurements.");
    }
  };

  const inputClassName = useMemo(
    () => "rounded-xl border border-border px-3 py-3 text-text-primary",
    []
  );

  return (
    <View className="gap-4 rounded-2xl border border-border bg-surface p-4">
      <Text className="text-lg font-semibold text-text-primary">Log circumferences</Text>

      {fieldGroups.map((group, groupIndex) => (
        <View key={group.title ?? "primary"} className="gap-3">
          {group.title ? <Text className="text-xs text-text-secondary">{group.title}</Text> : null}
          {group.rows.map((row, rowIndex) => (
            <View key={`${groupIndex}-${rowIndex}`} className="flex-row gap-3">
              {row.map((fieldName) => (
                <MeasurementField
                  key={fieldName}
                  control={control}
                  errorMessage={errors[fieldName]?.message}
                  inputClassName={inputClassName}
                  label={circumferenceLabels[fieldName]}
                  name={fieldName}
                  onEdit={clearFeedback}
                />
              ))}
            </View>
          ))}
        </View>
      ))}

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
