import { createContext, type ReactNode, use } from "react";

import { CIRCUMFERENCE_PREVIEW_LIMIT } from "@/features/measurements/constants/circumference";
import {
  WEIGHT_PREVIEW_LIMIT,
  WEIGHT_TREND_LIMIT,
} from "@/features/measurements/constants/weight";
import { measurementsResource } from "@/features/measurements/data/measurements-resource";

type MeasurementsDataContextValue = {
  circumferenceEntries: ReturnType<typeof measurementsResource.circumferences.useRecent>;
  recentWeightEntries: ReturnType<typeof measurementsResource.weight.useRecent>;
  weightTrend: ReturnType<typeof measurementsResource.weight.useTrend>;
};

export const MeasurementsDataContext = createContext<MeasurementsDataContextValue | null>(null);

export function MeasurementsDataProvider({ children }: { children: ReactNode }) {
  const recentWeightEntries = measurementsResource.weight.useRecent(WEIGHT_PREVIEW_LIMIT);
  const weightTrend = measurementsResource.weight.useTrend(WEIGHT_TREND_LIMIT);
  const circumferenceEntries =
    measurementsResource.circumferences.useRecent(CIRCUMFERENCE_PREVIEW_LIMIT);

  return (
    <MeasurementsDataContext.Provider
      value={{
        circumferenceEntries,
        recentWeightEntries,
        weightTrend,
      }}
    >
      {children}
    </MeasurementsDataContext.Provider>
  );
}

export function useMeasurementsData() {
  const context = use(MeasurementsDataContext);

  if (context === null) {
    throw new Error("useMeasurementsData must be used within MeasurementsDataProvider.");
  }

  return context;
}
