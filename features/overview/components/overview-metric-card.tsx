import { Text, View } from "react-native";

type OverviewMetricCardProps = {
  label: string;
  value: string;
};

export function OverviewMetricCard({ label, value }: OverviewMetricCardProps) {
  return (
    <View className="min-w-36 flex-1 gap-1 rounded-2xl border border-border bg-card p-4">
      <Text className="text-xs font-semibold text-text-tertiary">{label}</Text>
      <Text className="text-xl font-semibold text-text-primary">{value}</Text>
    </View>
  );
}
