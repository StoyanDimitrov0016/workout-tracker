export function formatDateTime(timestamp: number) {
  const date = new Date(timestamp);
  const dateLabel = date.toLocaleDateString();
  const timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dateLabel} - ${timeLabel}`;
}
