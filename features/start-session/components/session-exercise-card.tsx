import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, Pressable, Text, TextInput, View, useColorScheme } from "react-native";

import { formatSetTargetsSummary } from "@/features/splits/utils/targets";
import { NumberMapper } from "@/utils/form/number-mapper";

type ExercisePreferencePreview = {
  referenceUrl: string;
  notes: string;
  hasPreference: boolean;
};

interface SessionExerciseCardProps {
  name: string;
  setTargets: Array<{ reps: number; weightKg: number; restSec: number }>;
  sets: Array<{ reps: string; weightKg: string; restSec: string }>;
  isDone: boolean;
  preference?: ExercisePreferencePreview;
  onToggleDone: () => void;
  onAddSet: () => void | Promise<void>;
  onChangeSet: (index: number, next: { reps: string; weightKg: string; restSec: string }) => void;
  onOpenPreference: () => void;
}

export function SessionExerciseCard({
  name,
  setTargets,
  sets,
  isDone,
  preference,
  onToggleDone,
  onAddSet,
  onChangeSet,
  onOpenPreference,
}: SessionExerciseCardProps) {
  const isDark = useColorScheme() === "dark";
  const [isPreferenceExpanded, setIsPreferenceExpanded] = useState(false);
  const [completedSets, setCompletedSets] = useState<boolean[]>(() => sets.map(() => false));
  const totalReps = sets.reduce((sum, set) => sum + Number.parseInt(set.reps || "0", 10), 0);
  const totalWeight = sets.reduce(
    (sum, set) => sum + NumberMapper.toNumber(set.weightKg || "0"),
    0
  );
  const averageWeight = sets.length > 0 ? totalWeight / sets.length : 0;
  const targetSummary = formatSetTargetsSummary(setTargets);
  const referenceUrl = preference?.referenceUrl.trim() ?? "";
  const notes = preference?.notes.trim() ?? "";
  const hasReferenceUrl = referenceUrl.length > 0;
  const hasNotes = notes.length > 0;
  const hasPreference = Boolean(preference?.hasPreference && (hasReferenceUrl || hasNotes));
  const iconColor = isDark ? "#9ca3af" : "#6b7280";
  const completionColor = isDark ? "#4ade80" : "#16a34a";

  const toggleSetCompleted = (setIndex: number) => {
    setCompletedSets((current) =>
      current.map((item, index) => (index === setIndex ? !item : item))
    );
  };

  const handleAddSet = async () => {
    setCompletedSets((current) => [...current, false]);

    try {
      await onAddSet();
    } catch (error) {
      setCompletedSets((current) => current.slice(0, -1));
      throw error;
    }
  };

  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-4">
      <View className="gap-1">
        <Text className="text-base font-semibold text-text-primary">{name}</Text>
        <Text className="text-xs text-text-tertiary">Target: {targetSummary}</Text>
      </View>
      {hasPreference ? (
        <View className="gap-3">
          <View className="flex-row items-center justify-between gap-3">
            <Pressable
              onPress={() => setIsPreferenceExpanded((current) => !current)}
              className="flex-row items-center gap-2 py-1"
            >
              <Ionicons
                name={isPreferenceExpanded ? "bulb" : "bulb-outline"}
                size={16}
                color={iconColor}
              />
              <Text className="text-sm font-medium text-text-secondary">Preferences</Text>
              <Ionicons
                name={isPreferenceExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color={iconColor}
              />
            </Pressable>

            {isPreferenceExpanded ? (
              <Pressable onPress={onOpenPreference} className="p-1">
                <Ionicons name="create-outline" size={18} color={iconColor} />
              </Pressable>
            ) : null}
          </View>

          {isPreferenceExpanded ? (
            <View className="ml-1 gap-3 border-l border-border pl-3">
              {hasReferenceUrl ? (
                <View className="gap-1">
                  <Text className="text-xs text-text-tertiary">Reference</Text>
                  <Pressable onPress={() => void Linking.openURL(referenceUrl)} className="py-1">
                    <Text className="text-sm font-medium text-primary" numberOfLines={1}>
                      {referenceUrl}
                    </Text>
                  </Pressable>
                </View>
              ) : null}

              {hasNotes ? (
                <View className="gap-1">
                  <Text className="text-xs text-text-tertiary">Notes</Text>
                  <Text className="text-sm leading-5 text-text-primary">{notes}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : (
        <Pressable
          onPress={onOpenPreference}
          className="flex-row items-center gap-2 self-start py-1"
        >
          <Ionicons name="bulb-outline" size={16} color={iconColor} />
          <Text className="text-xs font-medium text-text-secondary">Add exercise preference</Text>
        </Pressable>
      )}
      {isDone ? (
        <View className="gap-3">
          <View className="rounded-xl bg-surface px-3 py-2">
            <Text className="text-xs text-text-secondary">Summary</Text>
            <Text className="text-sm font-semibold text-text-primary">
              {sets.length} sets | {totalReps} reps | {averageWeight.toFixed(1)} kg avg
            </Text>
          </View>
          <Pressable onPress={onToggleDone} className="rounded-xl border border-border px-3 py-2">
            <Text className="text-center text-sm font-semibold text-text-primary">Edit sets</Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-3">
          <View className="gap-3">
            {sets.map((set, index) => {
              const target = setTargets[index];
              const isSetCompleted = completedSets[index] ?? false;

              return (
                <View
                  key={`${name}-${index}`}
                  className={`gap-2 rounded-xl p-3 ${isSetCompleted ? "bg-accent/10" : "bg-surface"}`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-semibold text-text-secondary">
                      Set {index + 1}
                    </Text>
                    <Pressable onPress={() => toggleSetCompleted(index)} className="p-1">
                      <Ionicons
                        name={isSetCompleted ? "checkbox" : "square-outline"}
                        size={20}
                        color={isSetCompleted ? completionColor : iconColor}
                      />
                    </Pressable>
                  </View>
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      <Text className="text-xs text-text-tertiary">Reps</Text>
                      <TextInput
                        value={set.reps}
                        onChangeText={(text) => onChangeSet(index, { ...set, reps: text })}
                        keyboardType="number-pad"
                        className="rounded-lg border border-border px-3 py-2 text-text-primary"
                        placeholder={target ? String(target.reps) : "0"}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-text-tertiary">Weight (kg)</Text>
                      <TextInput
                        value={set.weightKg}
                        onChangeText={(text) => onChangeSet(index, { ...set, weightKg: text })}
                        keyboardType="decimal-pad"
                        className="rounded-lg border border-border px-3 py-2 text-text-primary"
                        placeholder={target ? String(target.weightKg) : "0"}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-text-tertiary">Rest (sec)</Text>
                      <TextInput
                        value={set.restSec}
                        onChangeText={(text) => onChangeSet(index, { ...set, restSec: text })}
                        keyboardType="number-pad"
                        className="rounded-lg border border-border px-3 py-2 text-text-primary"
                        placeholder={target ? String(target.restSec) : "0"}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => void handleAddSet()}
              className="flex-1 rounded-xl bg-primary px-3 py-2"
            >
              <Text className="text-center text-sm font-semibold text-white">Add set</Text>
            </Pressable>
            <Pressable
              onPress={onToggleDone}
              className="flex-1 rounded-xl border border-border px-3 py-2"
            >
              <Text className="text-center text-sm font-semibold text-text-primary">Mark done</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
