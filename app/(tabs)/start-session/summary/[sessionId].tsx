import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import {
  convexIdParamSchema,
  useValidatedLocalSearchParam,
} from "@/hooks/use-validated-local-search-param";
import { formatDateTime } from "@/utils/format/date-time";
import { formatDurationMs, formatStatNumber, formatVolumeKg } from "@/utils/format/stat";

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  const sessionId = useValidatedLocalSearchParam("sessionId", convexIdParamSchema<"workoutSessions">());
  const reopenSession = useMutation(api.workoutSessions.reopen);
  const session = useQuery(
    api.workoutSessions.getCompletedById,
    sessionId !== null ? { sessionId } : "skip"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReopening, setIsReopening] = useState(false);

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: "Workout summary", headerTitle: "Workout summary" }} />

      {sessionId === null ? (
        <Text className="text-text-secondary">Invalid workout.</Text>
      ) : session === undefined ? (
        <Text className="text-text-secondary">Loading...</Text>
      ) : session === null ? (
        <Text className="text-text-secondary">Workout not found.</Text>
      ) : (
        <View className="gap-6">
          {errorMessage ? (
            <View className="rounded-2xl border border-status-error/20 bg-status-error/10 p-4">
              <Text className="text-sm text-status-error">{errorMessage}</Text>
            </View>
          ) : null}

          <View className="gap-1">
            <Text className="text-sm text-text-tertiary">Workout complete</Text>
            <Text className="text-2xl font-semibold text-text-primary">
              {session.title || "Training"}
            </Text>
            <Text className="text-sm text-text-secondary">
              {weekdayToLabel(session.weekday)}
              {session.completedAt !== null ? ` | ${formatDateTime(session.completedAt)}` : ""}
            </Text>
          </View>

          <View className="gap-3 rounded-2xl border border-border bg-card p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-text-secondary">Duration</Text>
              <Text className="text-sm font-semibold text-text-primary">
                {formatDurationMs(session.durationMs)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-text-secondary">Exercises done</Text>
              <Text className="text-sm font-semibold text-text-primary">
                {session.doneExercises}/{session.exerciseCount}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-text-secondary">Sets</Text>
              <Text className="text-sm font-semibold text-text-primary">
                {formatStatNumber(session.totalSets)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-text-secondary">Reps</Text>
              <Text className="text-sm font-semibold text-text-primary">
                {formatStatNumber(session.totalReps)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-text-secondary">Volume</Text>
              <Text className="text-sm font-semibold text-text-primary">
                {formatVolumeKg(session.totalVolumeKg)}
              </Text>
            </View>
          </View>

          <View className="gap-3">
            <Pressable
              onPress={async () => {
                if (!sessionId) return;
                setErrorMessage(null);
                setIsReopening(true);

                try {
                  await reopenSession({ sessionId });
                  router.replace("/start-session");
                } catch (error) {
                  setErrorMessage(
                    error instanceof Error ? error.message : "Could not reopen the workout."
                  );
                } finally {
                  setIsReopening(false);
                }
              }}
              disabled={isReopening}
              className={`rounded-xl px-4 py-3 ${isReopening ? "bg-primary/60" : "bg-primary"}`}
            >
              <Text className="text-center font-semibold text-white">
                {isReopening ? "Reopening..." : "Reopen workout"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.replace({
                  pathname: "/statistics/session/[sessionId]",
                  params: { sessionId: session._id },
                })
              }
              className="rounded-xl bg-primary px-4 py-3"
            >
              <Text className="text-center font-semibold text-white">View workout details</Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/overview")}
              className="rounded-xl border border-border px-4 py-3"
            >
              <Text className="text-center font-semibold text-text-primary">Back to overview</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}
