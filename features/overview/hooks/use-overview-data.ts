import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { jsDayToWeekday } from "@/features/splits/constants/weekdays";

export function useOverviewData() {
  const split = useQuery(api.splits.getMineWithDailyMuscleVolume);
  const weightSummary = useQuery(api.weights.getLatestAndAverage, { days: 7 });
  const activeSession = useQuery(api.workoutSessions.getActive);
  const statistics = useQuery(api.workoutSessions.getStatisticsOverview);

  const today = jsDayToWeekday(new Date().getDay());
  const trainingDays = split?.days.filter((day) => day.exercises.length > 0) ?? [];

  let upcomingWeekday = today;
  let upcomingDelta = 7;

  trainingDays.forEach((day) => {
    const delta = (day.weekday - today + 7) % 7;
    if (delta < upcomingDelta) {
      upcomingWeekday = day.weekday;
      upcomingDelta = delta;
    }
  });

  const focusWeekday = activeSession?.weekday ?? upcomingWeekday;
  const orderedDays = trainingDays
    .map((day) => ({
      day,
      delta: (day.weekday - focusWeekday + 7) % 7,
    }))
    .sort((a, b) => a.delta - b.delta)
    .map((entry) => entry.day);

  const primaryDay = orderedDays[0] ?? null;
  const sameWeekdaySession = useQuery(
    api.workoutSessions.getLatestCompletedForWeekday,
    primaryDay ? { weekday: primaryDay.weekday } : "skip"
  );

  const isLoading =
    split === undefined ||
    activeSession === undefined ||
    statistics === undefined ||
    (primaryDay !== null && sameWeekdaySession === undefined);

  return {
    activeSession,
    isLoading,
    orderedDays,
    primaryDay,
    sameWeekdaySession,
    split,
    statistics,
    upcomingDelta,
    weightSummary,
  };
}
