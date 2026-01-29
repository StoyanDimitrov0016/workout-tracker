import { jsDayToWeekday } from "@/features/splits/constants/weekdays";

type SplitDay = {
  weekday: number;
  title: string;
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    restSec: number;
  }>;
};

export function getUpcomingTrainingDay(days: SplitDay[]) {
  const trainingDays = days.filter((day) => day.exercises.length > 0);
  if (trainingDays.length === 0) return null;

  const today = jsDayToWeekday(new Date().getDay());
  let candidate = trainingDays[0];
  let bestDelta = 7;

  trainingDays.forEach((day) => {
    const delta = (day.weekday - today + 7) % 7;
    if (delta < bestDelta) {
      candidate = day;
      bestDelta = delta;
    }
  });

  return candidate;
}
