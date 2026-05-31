import { View } from "react-native";

import { MeasurementsCircumferencesScreenSkeleton } from "@/components/feedback/loading-skeleton";
import { CircumferenceEntryCarousel } from "@/features/measurements/components/circumference-entry-carousel";
import { CircumferenceEntryForm } from "@/features/measurements/components/circumference-entry-form";
import { useMeasurementsData } from "@/features/measurements/data/measurements-data-context";

export function MeasurementsCircumferencesScreen() {
  const { circumferenceEntries } = useMeasurementsData();

  if (circumferenceEntries === undefined) {
    return <MeasurementsCircumferencesScreenSkeleton />;
  }

  return (
    <View className="gap-5 pb-4">
      <CircumferenceEntryForm />
      <CircumferenceEntryCarousel entries={circumferenceEntries} />
    </View>
  );
}
