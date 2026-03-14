import { useQuery } from "convex/react";
import { Text, View } from "react-native";

import { api } from "@/convex/_generated/api";
import { formatDateTime } from "@/utils/format/date-time";
import { formatWeightKg } from "@/utils/format/weight";

const TREND_LIMIT = 14;
const CHART_HEIGHT = 120;

function formatDelta(deltaKg: number | null) {
  if (deltaKg === null) return "N/A";
  const prefix = deltaKg > 0 ? "+" : "";
  return `${prefix}${formatWeightKg(deltaKg)} kg`;
}

export function WeightTrendCard() {
  const trend = useQuery(api.weights.getTrend, { limit: TREND_LIMIT });

  if (trend === undefined) {
    return (
      <View className="gap-3 rounded-2xl border border-border bg-surface p-4">
        <Text className="text-lg font-semibold text-text-primary">Weight trend</Text>
        <Text className="text-sm text-text-secondary">Loading trend...</Text>
      </View>
    );
  }

  if (trend.entries.length === 0) {
    return (
      <View className="gap-3 rounded-2xl border border-border bg-surface p-4">
        <Text className="text-lg font-semibold text-text-primary">Weight trend</Text>
        <Text className="text-sm text-text-secondary">
          Add a few entries and your recent trend will appear here.
        </Text>
      </View>
    );
  }

  const minWeight = trend.minWeightKg ?? trend.entries[0]!.weightKg;
  const maxWeight = trend.maxWeightKg ?? trend.entries[0]!.weightKg;
  const weightRange = Math.max(maxWeight - minWeight, 0.5);
  const latestEntry = trend.entries[trend.entries.length - 1] ?? null;

  return (
    <View className="gap-4 rounded-2xl border border-border bg-surface p-4">
      <View className="gap-1">
        <Text className="text-lg font-semibold text-text-primary">Weight trend</Text>
        <Text className="text-sm text-text-secondary">
          Based on your last {trend.entries.length} entries.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        <View className="min-w-28 flex-1 gap-1 rounded-xl bg-card p-3">
          <Text className="text-xs font-semibold text-text-tertiary">Latest</Text>
          <Text className="text-base font-semibold text-text-primary">
            {trend.latestWeightKg !== null ? `${formatWeightKg(trend.latestWeightKg)} kg` : "N/A"}
          </Text>
        </View>
        <View className="min-w-28 flex-1 gap-1 rounded-xl bg-card p-3">
          <Text className="text-xs font-semibold text-text-tertiary">Change</Text>
          <Text className="text-base font-semibold text-text-primary">
            {formatDelta(trend.deltaKg)}
          </Text>
        </View>
        <View className="min-w-28 flex-1 gap-1 rounded-xl bg-card p-3">
          <Text className="text-xs font-semibold text-text-tertiary">Range</Text>
          <Text className="text-base font-semibold text-text-primary">
            {formatWeightKg(minWeight)} - {formatWeightKg(maxWeight)} kg
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <View
          className="flex-row items-end gap-2 rounded-2xl bg-card px-3 pb-3 pt-4"
          style={{ height: CHART_HEIGHT + 24 }}
        >
          {trend.entries.map((entry) => {
            const normalizedHeight = ((entry.weightKg - minWeight) / weightRange) * CHART_HEIGHT;
            const height = Math.max(normalizedHeight, 10);

            return (
              <View key={entry._id} className="flex-1 items-center gap-2">
                <View
                  className="w-full rounded-full bg-primary/80"
                  style={{ height }}
                />
                <Text className="text-[10px] text-text-tertiary">
                  {new Date(entry.createdAt).toLocaleDateString([], {
                    month: "numeric",
                    day: "numeric",
                  })}
                </Text>
              </View>
            );
          })}
        </View>
        {latestEntry ? (
          <Text className="text-xs text-text-tertiary">
            Latest entry logged {formatDateTime(latestEntry.createdAt)}.
          </Text>
        ) : null}
      </View>
    </View>
  );
}
