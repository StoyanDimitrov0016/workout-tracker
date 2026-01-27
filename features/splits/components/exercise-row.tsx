import { Pressable, Text, TextInput, View } from "react-native";

interface ExerciseRowProps {
  name: string;
  sets: string;
  reps: string;
  restSec: string;
  onChange: (next: { sets: string; reps: string; restSec: string }) => void;
  onRemove: () => void;
}

export function ExerciseRow({
  name,
  sets,
  reps,
  restSec,
  onChange,
  onRemove,
}: ExerciseRowProps) {
  return (
    <View className="gap-3 rounded-xl border border-border bg-surface p-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-text-primary">{name}</Text>
        <Pressable onPress={onRemove} className="rounded-lg bg-status-error/10 px-2 py-1">
          <Text className="text-xs font-semibold text-status-error">Remove</Text>
        </Pressable>
      </View>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Text className="text-xs text-text-tertiary">Sets</Text>
          <TextInput
            value={sets}
            onChangeText={(text) => onChange({ sets: text, reps, restSec })}
            keyboardType="number-pad"
            className="rounded-lg border border-border px-2 py-2 text-text-primary"
            placeholder="0"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-text-tertiary">Reps</Text>
          <TextInput
            value={reps}
            onChangeText={(text) => onChange({ sets, reps: text, restSec })}
            keyboardType="number-pad"
            className="rounded-lg border border-border px-2 py-2 text-text-primary"
            placeholder="0"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-text-tertiary">Rest (sec)</Text>
          <TextInput
            value={restSec}
            onChangeText={(text) => onChange({ sets, reps, restSec: text })}
            keyboardType="number-pad"
            className="rounded-lg border border-border px-2 py-2 text-text-primary"
            placeholder="0"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>
    </View>
  );
}
