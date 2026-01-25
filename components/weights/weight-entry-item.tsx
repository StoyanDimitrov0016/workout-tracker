import { Text, View } from "react-native";

interface WeightEntryItemProps {
  weightKg: number;
  createdAt: number;
}

function formatDateTime(timestamp: number) {
  const date = new Date(timestamp);
  const dateLabel = date.toLocaleDateString();
  const timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dateLabel} - ${timeLabel}`;
}

export function WeightEntryItem({ weightKg, createdAt }: WeightEntryItemProps) {
  return (
    <View className="flex-row items-center justify-between rounded-xl border border-border px-3 py-3">
      <View>
        <Text className="text-base font-semibold text-text-primary">{weightKg} kg</Text>
        <Text className="text-xs text-text-tertiary">{formatDateTime(createdAt)}</Text>
      </View>
    </View>
  );
}
