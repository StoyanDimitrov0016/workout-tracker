import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import {
  ConvexIdParamSchema,
  useValidatedLocalSearchParam,
} from "@/hooks/use-validated-local-search-param";
import { ExercisePreferenceEditor } from "@/features/preferences/components/exercise-preference-editor";
import { preferencesResource } from "@/features/preferences/data/preferences-resource";

export function ExercisePreferenceModalScreen() {
  const isDark = useColorScheme() === "dark";
  const exerciseId = useValidatedLocalSearchParam("exerciseId", ConvexIdParamSchema<"exercises">());
  const exercisePreferences = preferencesResource.useExercisePreferences();
  const saveExercisePreference = preferencesResource.useSaveExercisePreference();
  const iconColor = isDark ? "#f3f4f6" : "#111827";
  const exercisePreference = exercisePreferences?.find(
    (preference) => preference.exerciseId === exerciseId
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-row items-center gap-3 border-b border-border px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
          >
            <Ionicons name="chevron-back" size={20} color={iconColor} />
          </Pressable>

          <View className="flex-1 gap-0.5">
            <Text className="text-lg font-semibold text-text-primary">Exercise Preference</Text>
            <Text className="text-sm text-text-secondary">
              Edit the saved note and reference URL for this exercise.
            </Text>
          </View>
        </View>

        {exerciseId === null ? (
          <View className="flex-1 px-4 py-6">
            <ScreenStateMessage
              title="Exercise not found"
              description="Open this modal from a specific exercise card or the preferences feed."
            />
          </View>
        ) : exercisePreferences === undefined ? (
          <View className="flex-1 px-4 py-6">
            <ScreenStateMessage
              title="Loading preference"
              description="Fetching the selected exercise."
            />
          </View>
        ) : !exercisePreference ? (
          <View className="flex-1 px-4 py-6">
            <ScreenStateMessage
              title="Exercise not found"
              description="This exercise could not be loaded from your preferences feed."
            />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            <ExercisePreferenceEditor
              exerciseId={exercisePreference.exerciseId}
              exerciseName={exercisePreference.exerciseName}
              muscleName={exercisePreference.muscleName}
              referenceUrl={exercisePreference.referenceUrl}
              notes={exercisePreference.notes}
              hasPreference={exercisePreference.hasPreference}
              onSave={saveExercisePreference}
            />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
