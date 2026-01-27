export const WEEKDAYS = [
  { weekday: 1, label: "Mon" },
  { weekday: 2, label: "Tue" },
  { weekday: 3, label: "Wed" },
  { weekday: 4, label: "Thu" },
  { weekday: 5, label: "Fri" },
  { weekday: 6, label: "Sat" },
  { weekday: 7, label: "Sun" },
];

export function jsDayToWeekday(day: number) {
  if (day === 0) return 7;
  return day + 1;
}

export function weekdayToLabel(weekday: number) {
  return WEEKDAYS.find((day) => day.weekday === weekday)?.label ?? "Day";
}
