import { Pressable, Text, TextInput, View } from "react-native";

type SetTargetInput = {
  reps: string;
  restSec: string;
};

interface ExerciseRowProps {
  name: string;
  setTargets: SetTargetInput[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onChange: (next: { setTargets: SetTargetInput[] }) => void;
  onRemove: () => void;
}

const DEFAULT_SET_TARGET: SetTargetInput = { reps: "", restSec: "120" };

function ensureSetTargets(setTargets: SetTargetInput[]) {
  if (setTargets.length > 0) return setTargets;
  return [{ ...DEFAULT_SET_TARGET }];
}

function formatUnitSummary(values: string[], unit: string) {
  const normalized = values.map((value) => (value.trim() === "" ? "?" : value.trim()));
  if (normalized.length === 0) return null;
  const allSame = normalized.every((value) => value === normalized[0]);
  const summary = allSame ? normalized[0] : normalized.join("/");
  return `${summary}${unit}`;
}

function buildSummary(setTargets: SetTargetInput[]) {
  if (setTargets.length === 0) return "No targets";
  const repsSummary = formatUnitSummary(
    setTargets.map((set) => set.reps),
    ""
  );
  const restSummary = formatUnitSummary(
    setTargets.map((set) => set.restSec),
    "s"
  );
  const parts = [`${setTargets.length} sets`];

  if (repsSummary) {
    parts.push(`reps ${repsSummary}`);
  }

  if (restSummary) {
    parts.push(`rest ${restSummary}`);
  }

  return parts.join(" | ");
}

export function ExerciseRow({
  name,
  setTargets,
  isExpanded,
  onToggleExpanded,
  onChange,
  onRemove,
}: ExerciseRowProps) {
  const safeTargets = ensureSetTargets(setTargets);
  const summary = buildSummary(safeTargets);

  const updateSet = (index: number, next: Partial<SetTargetInput>) => {
    onChange({
      setTargets: safeTargets.map((set, idx) => (idx === index ? { ...set, ...next } : set)),
    });
  };

  const addSet = () => {
    const last = safeTargets[safeTargets.length - 1] ?? DEFAULT_SET_TARGET;
    onChange({ setTargets: [...safeTargets, { ...last }] });
  };

  const removeSet = (index: number) => {
    if (safeTargets.length <= 1) return;
    onChange({ setTargets: safeTargets.filter((_, idx) => idx !== index) });
  };

  return (
    <View className="gap-3 rounded-xl border border-border bg-surface p-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-text-primary">{name}</Text>
        <Pressable onPress={onRemove} className="rounded-lg bg-status-error/10 px-2 py-1">
          <Text className="text-xs font-semibold text-status-error">Remove</Text>
        </Pressable>
      </View>

      <View className="gap-2">
        <Text className="text-xs text-text-tertiary">{summary}</Text>
        <Pressable onPress={onToggleExpanded} className="rounded-lg border border-border px-2 py-2">
          <Text className="text-center text-xs font-semibold text-text-secondary">
            {isExpanded ? "Hide sets" : "Edit sets"}
          </Text>
        </Pressable>
      </View>

      {isExpanded ? (
        <View className="gap-3">
          {safeTargets.map((set, index) => (
            <View key={`${name}-${index}`} className="gap-2 rounded-lg border border-border p-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-semibold text-text-secondary">Set {index + 1}</Text>
                {safeTargets.length > 1 ? (
                  <Pressable
                    onPress={() => removeSet(index)}
                    className="rounded-lg bg-status-error/10 px-2 py-1"
                  >
                    <Text className="text-[10px] font-semibold text-status-error">Remove</Text>
                  </Pressable>
                ) : null}
              </View>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Text className="text-xs text-text-tertiary">Reps</Text>
                  <TextInput
                    value={set.reps}
                    onChangeText={(text) => updateSet(index, { reps: text })}
                    keyboardType="number-pad"
                    className="rounded-lg border border-border px-2 py-2 text-text-primary"
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-text-tertiary">Rest (sec)</Text>
                  <TextInput
                    value={set.restSec}
                    onChangeText={(text) => updateSet(index, { restSec: text })}
                    keyboardType="number-pad"
                    className="rounded-lg border border-border px-2 py-2 text-text-primary"
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            </View>
          ))}

          <Pressable
            onPress={addSet}
            className="rounded-lg border border-dashed border-border px-3 py-2"
          >
            <Text className="text-center text-xs font-semibold text-text-secondary">Add set</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
