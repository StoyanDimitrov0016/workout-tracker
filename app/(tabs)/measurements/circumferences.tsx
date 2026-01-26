import { Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { CircumferenceEntryCarousel } from "@/features/measurements/components/circumference-entry-carousel";
import { CircumferenceEntryForm } from "@/features/measurements/components/circumference-entry-form";
import { MeasurementsSwitch } from "@/features/measurements/components/measurements-switch";

export default function MeasurementsCircumferencesScreen() {
  return (
    <ScreenWrapper>
      <View className="gap-6 py-4">
        <Text className="text-2xl font-semibold text-text-primary">Measurements</Text>
        <MeasurementsSwitch />
        <CircumferenceEntryForm />
        <CircumferenceEntryCarousel />
      </View>
    </ScreenWrapper>
  );
}
