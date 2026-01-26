import { View, Text } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { MeasurementsSwitch } from "@/features/measurements/components/measurements-switch";
import { WeightEntryForm } from "@/features/measurements/components/weight-entry-form";
import { WeightEntryPreview } from "@/features/measurements/components/weight-entry-preview";

export default function MeasurementsWeightScreen() {
  return (
    <ScreenWrapper>
      <View className="gap-6 py-4">
        <Text className="text-2xl font-semibold text-text-primary">Measurements</Text>
        <MeasurementsSwitch />
        <WeightEntryForm />
        <WeightEntryPreview />
        {/* TODO: Weight chart + stats section */}
      </View>
    </ScreenWrapper>
  );
}
