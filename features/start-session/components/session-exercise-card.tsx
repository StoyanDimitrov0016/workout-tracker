import { Pressable, Text, TextInput, View } from "react-native";

interface SessionExerciseCardProps {
  name: string;
  targetSets: number;
  targetReps: number;
  targetRestSec: number;
  sets: Array<{ reps: string; weightKg: string; restSec: string }>;
  isDone: boolean;
  onToggleDone: () => void;
  onAddSet: () => void;
  onChangeSet: (index: number, next: { reps: string; weightKg: string; restSec: string }) => void;
}

export function SessionExerciseCard({
  name,
  targetSets,
  targetReps,
  targetRestSec,
  sets,
  isDone,
  onToggleDone,
  onAddSet,
  onChangeSet,
}: SessionExerciseCardProps) {
  const totalReps = sets.reduce((sum, set) => sum + Number.parseInt(set.reps || "0", 10), 0);
  const totalWeight = sets.reduce(
    (sum, set) => sum + Number.parseFloat(set.weightKg || "0"),
    0
  );
  const averageWeight = sets.length > 0 ? totalWeight / sets.length : 0;

  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-4">
      <View className="gap-1">
        <Text className="text-base font-semibold text-text-primary">{name}</Text>
        <Text className="text-xs text-text-tertiary">
          Target: {targetSets} x {targetReps} • {targetRestSec}s rest
        </Text>
      </View>
      {isDone ? (
        <View className="gap-3">
          <View className="rounded-xl bg-surface px-3 py-2">
            <Text className="text-xs text-text-secondary">Summary</Text>
            <Text className="text-sm font-semibold text-text-primary">
              {sets.length} sets • {totalReps} reps • {averageWeight.toFixed(1)} kg avg
            </Text>
          </View>
          <Pressable onPress={onToggleDone} className="rounded-xl border border-border px-3 py-2">
            <Text className="text-center text-sm font-semibold text-text-primary">Edit sets</Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-3">
          <View className="gap-3">
            {sets.map((set, index) => (
              <View key={`${name}-${index}`} className="gap-2 rounded-xl bg-surface p-3">
                <Text className="text-xs font-semibold text-text-secondary">Set {index + 1}</Text>
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text className="text-xs text-text-tertiary">Reps</Text>
                    <TextInput
                      value={set.reps}
                      onChangeText={(text) =>
                        onChangeSet(index, { ...set, reps: text })
                      }
                      keyboardType="number-pad"
                      className="rounded-lg border border-border px-3 py-2 text-text-primary"
                      placeholder={String(targetReps)}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-text-tertiary">Weight (kg)</Text>
                    <TextInput
                      value={set.weightKg}
                      onChangeText={(text) =>
                        onChangeSet(index, { ...set, weightKg: text })
                      }
                      keyboardType="decimal-pad"
                      className="rounded-lg border border-border px-3 py-2 text-text-primary"
                      placeholder="kg"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-text-tertiary">Rest (sec)</Text>
                    <TextInput
                      value={set.restSec}
                      onChangeText={(text) =>
                        onChangeSet(index, { ...set, restSec: text })
                      }
                      keyboardType="number-pad"
                      className="rounded-lg border border-border px-3 py-2 text-text-primary"
                      placeholder={String(targetRestSec)}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={onAddSet}
              className={`flex-1 rounded-xl px-3 py-2 ${
                sets.length >= targetSets
                  ? "border border-border opacity-40"
                  : "bg-primary"
              }`}
              disabled={sets.length >= targetSets}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  sets.length >= targetSets ? "text-text-primary" : "text-white"
                }`}
              >
                Add set
              </Text>
            </Pressable>
            <Pressable onPress={onToggleDone} className="flex-1 rounded-xl border border-border px-3 py-2">
              <Text className="text-center text-sm font-semibold text-text-primary">
                Mark done
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
