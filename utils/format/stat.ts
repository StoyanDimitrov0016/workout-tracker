import { formatInteger } from "@/utils/format/number";

export function formatStatNumber(value: number) {
  return formatInteger(value);
}

export function formatVolumeKg(value: number) {
  return `${formatStatNumber(value)} kg`;
}

export function formatDurationMs(value: number | null) {
  if (value === null) return "N/A";

  const totalMinutes = Math.max(Math.round(value / 60000), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${minutes}m`;
}
