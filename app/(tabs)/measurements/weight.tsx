import { View, Text } from "react-native";

import { WeightEntryForm } from "@/components/weights/weight-entry-form";
import { WeightEntryPreview } from "@/components/weights/weight-entry-preview";
import { MeasurementsSwitch } from "@/components/measurements/measurements-switch";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";

export default function MeasurementsWeightScreen() {
  return (
    <ScreenWrapper>
      <View className="gap-6 py-4">
        <Text className="text-text-primary text-2xl font-semibold">Measurements</Text>
        <MeasurementsSwitch />
        <WeightEntryForm />
        <WeightEntryPreview />
        {/* TODO: Weight chart + stats section */}
      </View>
    </ScreenWrapper>
  );
}
