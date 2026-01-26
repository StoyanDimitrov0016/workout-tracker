import { useQuery } from "convex/react";
import { Text, View } from "react-native";

import { CircumferenceEntryForm } from "@/components/measurements/circumference-entry-form";
import { MeasurementsSwitch } from "@/components/measurements/measurements-switch";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";

function formatValue(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
}

export default function MeasurementsCircumferencesScreen() {
  const latestEntry = useQuery(api.circumferences.mostRecent);

  return (
    <ScreenWrapper>
      <View className="gap-6 py-4">
        <Text className="text-2xl font-semibold text-text-primary">Measurements</Text>
        <MeasurementsSwitch />
        <CircumferenceEntryForm />
        <View className="gap-3 rounded-2xl border border-border bg-card p-4">
          <Text className="text-lg font-semibold text-text-primary">Latest snapshot</Text>
          {latestEntry ? (
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Neck</Text>
                <Text className="text-text-primary">{formatValue(latestEntry.neckCm)} cm</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Chest</Text>
                <Text className="text-text-primary">{formatValue(latestEntry.chestCm)} cm</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Waist</Text>
                <Text className="text-text-primary">{formatValue(latestEntry.waistCm)} cm</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Hips</Text>
                <Text className="text-text-primary">{formatValue(latestEntry.hipsCm)} cm</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Upper arm (L/R)</Text>
                <Text className="text-text-primary">
                  {formatValue(latestEntry.upperArmLeftCm)} /{" "}
                  {formatValue(latestEntry.upperArmRightCm)} cm
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Thigh (L/R)</Text>
                <Text className="text-text-primary">
                  {formatValue(latestEntry.thighLeftCm)} / {formatValue(latestEntry.thighRightCm)}{" "}
                  cm
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Calf (L/R)</Text>
                <Text className="text-text-primary">
                  {formatValue(latestEntry.calfLeftCm)} / {formatValue(latestEntry.calfRightCm)} cm
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-sm text-text-tertiary">
              Your latest circumference measurements will appear here.
            </Text>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
