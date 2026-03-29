import { Text, View } from "react-native";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { MeasurementsSwitch } from "@/features/measurements/components/measurements-switch";
import { WeightEntryForm } from "@/features/measurements/components/weight-entry-form";
import { WeightEntryPreview } from "@/features/measurements/components/weight-entry-preview";
import { WeightTrendCard } from "@/features/measurements/components/weight-trend-card";

export function MeasurementsWeightScreen() {
  return (
    <ScreenWrapper>
      <View className="gap-6 py-4">
        <MeasurementsSwitch />
        <WeightEntryForm />
        <WeightEntryPreview />
        <WeightTrendCard />
      </View>
    </ScreenWrapper>
  );
}
