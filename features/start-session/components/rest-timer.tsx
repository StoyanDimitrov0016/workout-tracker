import { Pressable, Text, View } from "react-native";

import { formatTimer } from "@/features/start-session/utils/timer";

interface TimerPreset {
  label: string;
  seconds: number;
}

interface RestTimerProps {
  presets: TimerPreset[];
  seconds: number | null;
  onSelectPreset: (seconds: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function RestTimer({
  presets,
  seconds,
  onSelectPreset,
  onStart,
  onPause,
  onReset,
}: RestTimerProps) {
  const displaySeconds = seconds ?? presets[0]?.seconds ?? 0;

  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-4">
      <Text className="text-4xl font-semibold text-text-primary">
        {formatTimer(displaySeconds)}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {presets.map((preset) => (
          <Pressable
            key={preset.label}
            onPress={() => onSelectPreset(preset.seconds)}
            className="rounded-full border border-border px-3 py-1.5"
          >
            <Text className="text-xs font-semibold text-text-primary">{preset.label}</Text>
          </Pressable>
        ))}
      </View>
      <View className="flex-row gap-2">
        <Pressable onPress={onStart} className="flex-1 rounded-xl bg-primary px-4 py-3">
          <Text className="text-center font-semibold text-white">Start</Text>
        </Pressable>
        <Pressable onPress={onPause} className="flex-1 rounded-xl border border-border px-4 py-3">
          <Text className="text-center font-semibold text-text-primary">Pause</Text>
        </Pressable>
        <Pressable onPress={onReset} className="flex-1 rounded-xl border border-border px-4 py-3">
          <Text className="text-center font-semibold text-text-primary">Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
