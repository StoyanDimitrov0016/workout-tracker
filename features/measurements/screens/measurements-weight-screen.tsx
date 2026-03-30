import { View } from "react-native";

import { MeasurementsWeightScreenSkeleton } from "@/components/feedback/loading-skeleton";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { MeasurementsSwitch } from "@/features/measurements/components/measurements-switch";
import { WeightEntryForm } from "@/features/measurements/components/weight-entry-form";
import { WeightEntryPreview } from "@/features/measurements/components/weight-entry-preview";
import { WeightTrendCard } from "@/features/measurements/components/weight-trend-card";
import { useMeasurementsData } from "@/features/measurements/data/measurements-data-context";

export function MeasurementsWeightScreen() {
  const { recentWeightEntries, weightTrend } = useMeasurementsData();

  if (recentWeightEntries === undefined || weightTrend === undefined) {
    return (
      <ScreenWrapper>
        <MeasurementsWeightScreenSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="gap-5 pb-4 pt-1">
        <MeasurementsSwitch />
        <WeightEntryForm latestWeightKg={recentWeightEntries[0]?.weightKg ?? null} />
        <WeightEntryPreview entries={recentWeightEntries} />
        <WeightTrendCard trend={weightTrend} />
      </View>
    </ScreenWrapper>
  );
}
