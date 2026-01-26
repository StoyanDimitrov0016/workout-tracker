import { Text, View } from "react-native";

import { formatDateTime } from "@/features/measurements/utils/format-date-time";

interface WeightEntryItemProps {
  weightKg: number;
  createdAt: number;
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
