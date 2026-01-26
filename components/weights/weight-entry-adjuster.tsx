import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";

const MIN_DELTA_KG = -1.5;
const MAX_DELTA_KG = 1.5;

interface WeightEntryAdjusterProps {
  baseWeightKg: number | null;
  deltaKg: number;
  onDeltaChange: (value: number) => void;
}

function formatDelta(delta: number) {
  const rounded = Math.round(delta * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(1)} kg`;
}

export function WeightEntryAdjuster({
  baseWeightKg,
  deltaKg,
  onDeltaChange,
}: WeightEntryAdjusterProps) {
  const isEnabled = baseWeightKg !== null;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-text-primary">Quick adjust</Text>
        <Text className="text-sm text-text-secondary">{formatDelta(deltaKg)}</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <Text className="text-xs text-text-tertiary">-1.5 kg</Text>
        <View className="flex-1">
          <Slider
            value={deltaKg}
            minimumValue={MIN_DELTA_KG}
            maximumValue={MAX_DELTA_KG}
            step={0.1}
            onValueChange={onDeltaChange}
            disabled={!isEnabled}
            minimumTrackTintColor={isEnabled ? "#3b82f6" : "#9ca3af"}
            maximumTrackTintColor="#e5e7eb"
            thumbTintColor={isEnabled ? "#3b82f6" : "#9ca3af"}
          />
        </View>
        <Text className="text-xs text-text-tertiary">+1.5 kg</Text>
      </View>
      {!isEnabled ? (
        <Text className="text-xs text-text-tertiary">
          Log your first weight to enable quick adjustments.
        </Text>
      ) : null}
    </View>
  );
}
