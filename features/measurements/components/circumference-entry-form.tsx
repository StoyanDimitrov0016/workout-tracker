import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
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
import { formatMeasurementValue } from "@/utils/format/measurement";

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
  name: keyof CircumferenceFormValues;
  onEdit: (name: keyof CircumferenceFormValues) => void;
  label: string;
};

function MeasurementField({
  control,
  errorMessage,
  label,
  name,
  onEdit,
}: MeasurementFieldProps) {
  return (
    <View className="flex-1">
      <Controller
        control={control}
        name={name}
        render={({ field: { onBlur, onChange, value } }) => (
          <NumberInput
            label={label}
            value={value}
            onChangeNumber={(nextValue) => {
              onEdit(name);
              onChange(nextValue);
            }}
            onBlur={onBlur}
            formatValue={formatMeasurementValue}
            error={errorMessage}
          />
        )}
      />
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
                  label={circumferenceLabels[fieldName]}
                  name={fieldName}
                  onEdit={clearFeedback}
                />
              ))}
            </View>
          ))}
        </View>
      ))}

      <Button
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        label={isSubmitting ? "Saving..." : "Save measurements"}
      />
    </View>
  );
}
