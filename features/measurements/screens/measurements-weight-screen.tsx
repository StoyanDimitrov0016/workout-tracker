import { View } from "react-native";

import { MeasurementsWeightScreenSkeleton } from "@/components/feedback/loading-skeleton";
import { WeightEntryForm } from "@/features/measurements/components/weight-entry-form";
import { WeightEntryPreview } from "@/features/measurements/components/weight-entry-preview";
import { WeightTrendCard } from "@/features/measurements/components/weight-trend-card";
import { useMeasurementsData } from "@/features/measurements/data/measurements-data-context";

export function MeasurementsWeightScreen() {
  const { recentWeightEntries, weightTrend } = useMeasurementsData();

  if (recentWeightEntries === undefined || weightTrend === undefined) {
    return <MeasurementsWeightScreenSkeleton />;
  }

  return (
    <View className="gap-5 pb-4">
      <WeightEntryForm latestWeightKg={recentWeightEntries[0]?.weightKg ?? null} />
      <WeightEntryPreview entries={recentWeightEntries} />
      <WeightTrendCard trend={weightTrend} />
    </View>
  );
}
