import { useQuery } from "convex/react";
import { useMemo } from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";

import { api } from "@/convex/_generated/api";
import { CIRCUMFERENCE_PREVIEW_LIMIT } from "@/features/measurements/constants/circumference";
import { formatMeasurementValue } from "@/features/measurements/utils/format-measurement";
import { formatDateTime } from "@/features/measurements/utils/format-date-time";

function formatSingle(value: number) {
  return `${formatMeasurementValue(value)} cm`;
}

function formatPair(left: number, right: number) {
  return `${formatMeasurementValue(left)} / ${formatMeasurementValue(right)} cm`;
}

export function CircumferenceEntryCarousel() {
  const entries = useQuery(api.circumferences.listRecent, {
    limit: CIRCUMFERENCE_PREVIEW_LIMIT,
  });
  const { width } = useWindowDimensions();

  const cardWidth = useMemo(() => Math.min(width - 48, 360), [width]);
  const snapInterval = cardWidth + 12;

  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold text-text-primary">Latest snapshots</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {entries === undefined && (
          <View className="rounded-2xl border border-border bg-card p-4" style={{ width: cardWidth }}>
            <Text className="text-text-tertiary">Loading...</Text>
          </View>
        )}
        {entries?.length === 0 && (
          <View className="rounded-2xl border border-border bg-card p-4" style={{ width: cardWidth }}>
            <Text className="text-sm text-text-tertiary">
              Your latest circumference measurements will appear here.
            </Text>
          </View>
        )}
        {entries?.map((entry, index) => (
          <View
            key={entry._id}
            className="rounded-2xl border border-border bg-card p-4"
            style={{ width: cardWidth, marginRight: index === entries.length - 1 ? 0 : 12 }}
          >
            <Text className="text-sm text-text-secondary">
              {formatDateTime(entry._creationTime)}
            </Text>
            <View className="mt-3 gap-2">
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Neck</Text>
                <Text className="text-text-primary">{formatSingle(entry.neckCm)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Chest</Text>
                <Text className="text-text-primary">{formatSingle(entry.chestCm)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Waist</Text>
                <Text className="text-text-primary">{formatSingle(entry.waistCm)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Hips</Text>
                <Text className="text-text-primary">{formatSingle(entry.hipsCm)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Upper arm (L/R)</Text>
                <Text className="text-text-primary">
                  {formatPair(entry.upperArmLeftCm, entry.upperArmRightCm)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Forearm (L/R)</Text>
                <Text className="text-text-primary">
                  {formatPair(entry.forearmLeftCm, entry.forearmRightCm)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Thigh (L/R)</Text>
                <Text className="text-text-primary">
                  {formatPair(entry.thighLeftCm, entry.thighRightCm)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Calf (L/R)</Text>
                <Text className="text-text-primary">
                  {formatPair(entry.calfLeftCm, entry.calfRightCm)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
