import { Text, View } from "react-native";

type StatisticsSummaryCardProps = {
  label: string;
  value: string;
};

export function StatisticsSummaryCard({ label, value }: StatisticsSummaryCardProps) {
  return (
    <View className="min-w-40 flex-1 gap-1 rounded-2xl border border-border bg-card p-4">
      <Text className="text-xs font-semibold text-text-tertiary">{label}</Text>
      <Text className="text-2xl font-semibold text-text-primary">{value}</Text>
    </View>
  );
}
