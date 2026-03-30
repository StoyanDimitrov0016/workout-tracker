import { View } from "react-native";

import { MeasurementsCircumferencesScreenSkeleton } from "@/components/feedback/loading-skeleton";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { CircumferenceEntryCarousel } from "@/features/measurements/components/circumference-entry-carousel";
import { CircumferenceEntryForm } from "@/features/measurements/components/circumference-entry-form";
import { MeasurementsSwitch } from "@/features/measurements/components/measurements-switch";
import { useMeasurementsData } from "@/features/measurements/data/measurements-data-context";

export function MeasurementsCircumferencesScreen() {
  const { circumferenceEntries } = useMeasurementsData();

  if (circumferenceEntries === undefined) {
    return (
      <ScreenWrapper>
        <MeasurementsCircumferencesScreenSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="gap-5 pb-4 pt-1">
        <MeasurementsSwitch />
        <CircumferenceEntryForm />
        <CircumferenceEntryCarousel entries={circumferenceEntries} />
      </View>
    </ScreenWrapper>
  );
}
