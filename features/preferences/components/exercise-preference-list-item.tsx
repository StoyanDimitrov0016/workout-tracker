import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View, useColorScheme } from "react-native";

type ExercisePreferenceListItemProps = {
  exerciseName: string;
  muscleName: string;
  referenceUrl: string;
  notes: string;
  hasPreference: boolean;
  onPress: () => void;
};

export function ExercisePreferenceListItem({
  exerciseName,
  muscleName,
  referenceUrl,
  notes,
  hasPreference,
  onPress,
}: ExercisePreferenceListItemProps) {
  const isDark = useColorScheme() === "dark";
  const savedReferenceUrl = referenceUrl.trim();
  const savedNotes = notes.trim();
  const preview = savedNotes || savedReferenceUrl || "No notes or reference URL yet.";

  return (
    <Pressable onPress={onPress} className="rounded-2xl border border-border bg-surface p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-semibold text-text-primary">{exerciseName}</Text>
            {hasPreference ? (
              <View className="rounded-full bg-primary/10 px-2 py-1">
                <Text className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Saved
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="text-sm text-text-secondary">{muscleName}</Text>
          <Text
            className={hasPreference ? "text-sm text-text-secondary" : "text-sm text-text-tertiary"}
            numberOfLines={2}
          >
            {preview}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={isDark ? "#9ca3af" : "#6b7280"} />
      </View>
    </Pressable>
  );
}
