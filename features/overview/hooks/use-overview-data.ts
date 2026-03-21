import { measurementsResource } from "@/features/measurements/data/measurements-resource";
import { splitResource } from "@/features/splits/data/split-resource";
import { statisticsResource } from "@/features/statistics/data/statistics-resource";
import { workoutSessionResource } from "@/features/start-session/data/workout-session-resource";
import { jsDayToWeekday } from "@/features/splits/constants/weekdays";

export function useOverviewData() {
  const split = splitResource.useMineWithDailyMuscleVolume();
  const weightSummary = measurementsResource.weight.useLatestAndAverage(7);
  const activeSession = workoutSessionResource.useActive();
  const statistics = statisticsResource.useOverview();

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
  const sameWeekdaySession = workoutSessionResource.useLatestCompletedForWeekday(
    primaryDay?.weekday ?? null
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
