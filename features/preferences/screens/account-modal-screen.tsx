import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExercisePreferenceListItem } from "@/features/preferences/components/exercise-preference-list-item";
import { preferencesResource } from "@/features/preferences/data/preferences-resource";

type AccountScreenKey = "account" | "preferences" | "exercisePreferences";

type MenuRowProps = {
  label: string;
  description: string;
  onPress: () => void;
};

type DisabledOptionCardProps = {
  title: string;
  description: string;
  value: string;
};

const screenMeta: Record<AccountScreenKey, { title: string; subtitle: string }> = {
  account: {
    title: "Account",
    subtitle: "Your profile, preferences, and app defaults.",
  },
  preferences: {
    title: "Preferences",
    subtitle: "Keep user-level settings separate from any individual training split.",
  },
  exercisePreferences: {
    title: "Exercise Preferences",
    subtitle: "One reference URL and one note per exercise for this user.",
  },
};

function MenuRow({ label, description, onPress }: MenuRowProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <Pressable onPress={onPress} className="rounded-2xl border border-border bg-surface p-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-text-primary">{label}</Text>
          <Text className="text-sm text-text-secondary">{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={isDark ? "#9ca3af" : "#6b7280"} />
      </View>
    </Pressable>
  );
}

function DisabledOptionCard({ title, description, value }: DisabledOptionCardProps) {
  return (
    <View className="rounded-2xl border border-border bg-surface p-4 opacity-60">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-text-primary">{title}</Text>
          <Text className="text-sm text-text-secondary">{description}</Text>
        </View>
        <View className="rounded-full border border-border bg-card px-2.5 py-1">
          <Text className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            Soon
          </Text>
        </View>
      </View>
      <Text className="mt-3 text-sm font-medium text-text-secondary">{value}</Text>
    </View>
  );
}

export function AccountModalScreen() {
  const isDark = useColorScheme() === "dark";
  const { signOut } = useAuth();
  const { user } = useUser();
  const exercisePreferences = preferencesResource.useExercisePreferences();
  const [searchText, setSearchText] = useState("");
  const [screenHistory, setScreenHistory] = useState<AccountScreenKey[]>(["account"]);
  const currentScreen = screenHistory[screenHistory.length - 1] ?? "account";
  const visibleExercisePreferences = useMemo(() => {
    if (!exercisePreferences) return [];

    const normalizedSearch = searchText.trim().toLowerCase();
    const filtered = normalizedSearch
      ? exercisePreferences.filter((preference) => {
          const haystack = `${preference.exerciseName} ${preference.muscleName}`.toLowerCase();
          return haystack.includes(normalizedSearch);
        })
      : exercisePreferences;

    return [...filtered].sort((left, right) => {
      if (left.hasPreference !== right.hasPreference) {
        return left.hasPreference ? -1 : 1;
      }

      return left.exerciseName.localeCompare(right.exerciseName);
    });
  }, [exercisePreferences, searchText]);
  const savedPreferenceCount =
    exercisePreferences?.filter((preference) => preference.hasPreference).length ?? 0;
  const iconColor = isDark ? "#f3f4f6" : "#111827";

  const pushScreen = (screen: AccountScreenKey) => {
    setScreenHistory((current) => {
      if (current[current.length - 1] === screen) {
        return current;
      }

      return [...current, screen];
    });
  };

  const popScreen = () => {
    setScreenHistory((current) => (current.length > 1 ? current.slice(0, -1) : current));
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const renderBody = () => {
    if (currentScreen === "account") {
      return (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ gap: 16, padding: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-2 rounded-2xl border border-border bg-surface p-4">
            <Text className="text-xl font-semibold text-text-primary">
              {user?.fullName ?? "Account"}
            </Text>
            <Text className="text-sm text-text-secondary">
              {user?.primaryEmailAddress?.emailAddress ?? "Signed in"}
            </Text>
          </View>

          <MenuRow
            label="Preferences"
            description="User-level settings, including exercise-specific preferences."
            onPress={() => pushScreen("preferences")}
          />

          <Pressable
            onPress={() => void handleSignOut()}
            className="rounded-2xl bg-primary px-5 py-4"
          >
            <Text className="text-center font-semibold text-white">Sign out</Text>
          </Pressable>
        </ScrollView>
      );
    }

    if (currentScreen === "preferences") {
      return (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ gap: 16, padding: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <MenuRow
            label="Exercise Preferences"
            description="Reference URL, notes, machine setup, and technique reminders for each exercise."
            onPress={() => pushScreen("exercisePreferences")}
          />

          <Text className="text-lg font-semibold text-text-primary">Upcoming user preferences</Text>

          <DisabledOptionCard
            title="Weight unit"
            description="Choose whether the app presents weights in kilograms or pounds."
            value="Kilograms (default for now)"
          />

          <DisabledOptionCard
            title="Session prefill strategy"
            description="Choose whether weight and reps come from the latest exercise globally or the latest matching training day."
            value="Most recent matching weekday"
          />
        </ScrollView>
      );
    }

    return (
      <View className="flex-1">
        <View className="gap-3 border-b border-border px-4 pb-4 pt-4">
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by exercise or muscle"
            placeholderTextColor="#9ca3af"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-text-primary"
          />
          <Text className="text-sm text-text-secondary">
            Saved for {savedPreferenceCount} exercise{savedPreferenceCount === 1 ? "" : "s"}.
            {visibleExercisePreferences.length !== (exercisePreferences?.length ?? 0)
              ? ` Showing ${visibleExercisePreferences.length} filtered result${
                  visibleExercisePreferences.length === 1 ? "" : "s"
                }.`
              : ""}
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ gap: 12, padding: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {exercisePreferences === undefined ? (
            <View className="rounded-2xl border border-border bg-surface p-4">
              <Text className="text-sm text-text-secondary">Loading exercise preferences...</Text>
            </View>
          ) : visibleExercisePreferences.length === 0 ? (
            <View className="rounded-2xl border border-border bg-surface p-4">
              <Text className="text-sm font-semibold text-text-primary">No matching exercises</Text>
              <Text className="mt-1 text-sm text-text-secondary">
                Adjust the search to find the exercise you want to configure.
              </Text>
            </View>
          ) : (
            visibleExercisePreferences.map((preference) => (
              <ExercisePreferenceListItem
                key={preference.exerciseId}
                exerciseName={preference.exerciseName}
                muscleName={preference.muscleName}
                referenceUrl={preference.referenceUrl}
                notes={preference.notes}
                hasPreference={preference.hasPreference}
                onPress={() =>
                  router.push({
                    pathname: "/(modals)/exercise-preference",
                    params: { exerciseId: String(preference.exerciseId) },
                  })
                }
              />
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-row items-center gap-3 border-b border-border px-4 py-3">
          {currentScreen === "account" ? (
            <View className="h-10 w-10" />
          ) : (
            <Pressable
              onPress={popScreen}
              className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
            >
              <Ionicons name="chevron-back" size={20} color={iconColor} />
            </Pressable>
          )}

          <View className="flex-1 gap-0.5">
            <Text className="text-lg font-semibold text-text-primary">
              {screenMeta[currentScreen].title}
            </Text>
            <Text className="text-sm text-text-secondary">
              {screenMeta[currentScreen].subtitle}
            </Text>
          </View>

          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
          >
            <Ionicons name="close" size={20} color={iconColor} />
          </Pressable>
        </View>

        {renderBody()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
