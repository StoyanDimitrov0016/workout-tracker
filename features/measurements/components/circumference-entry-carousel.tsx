import { useMemo } from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";

import { formatDateTime } from "@/utils/format/date-time";
import { formatMeasurementValue } from "@/utils/format/measurement";

function formatSingle(value: number) {
  return `${formatMeasurementValue(value)} cm`;
}

function formatPair(left: number, right: number) {
  return `${formatMeasurementValue(left)} / ${formatMeasurementValue(right)} cm`;
}

type CircumferenceEntryCarouselProps = {
  entries: Array<{
    _creationTime: number;
    _id: string;
    calfLeftCm: number;
    calfRightCm: number;
    chestCm: number;
    forearmLeftCm: number;
    forearmRightCm: number;
    hipsCm: number;
    neckCm: number;
    thighLeftCm: number;
    thighRightCm: number;
    upperArmLeftCm: number;
    upperArmRightCm: number;
    waistCm: number;
  }>;
};

export function CircumferenceEntryCarousel({ entries }: CircumferenceEntryCarouselProps) {
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
        {entries.length === 0 && (
          <View
            className="rounded-2xl border border-border bg-card p-4"
            style={{ width: cardWidth }}
          >
            <Text className="text-sm text-text-tertiary">
              Your latest circumference measurements will appear here.
            </Text>
          </View>
        )}
        {entries.map((entry, index) => (
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
