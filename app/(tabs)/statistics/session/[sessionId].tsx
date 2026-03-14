import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { formatDateTime } from "@/features/measurements/utils/format-date-time";
import {
  formatDurationMs,
  formatStatNumber,
  formatVolumeKg,
} from "@/features/statistics/utils/format-stat";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { formatSetTargetsSummary } from "@/features/splits/utils/targets";

function formatPerformedValue(value: number | null, suffix = "") {
  if (value === null) return "Not logged";
  return `${value}${suffix}`;
}

export default function WorkoutSessionDetailScreen() {
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const sessionId = params.sessionId as Id<"workoutSessions"> | undefined;
  const session = useQuery(
    api.workoutSessions.getCompletedById,
    sessionId ? { sessionId } : "skip"
  );

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: "Workout", headerTitle: "Workout" }} />

      {sessionId === undefined ? (
        <Text className="text-text-secondary">Invalid session.</Text>
      ) : session === undefined ? (
        <Text className="text-text-secondary">Loading...</Text>
      ) : session === null ? (
        <Text className="text-text-secondary">Workout not found.</Text>
      ) : (
        <View className="gap-6">
          <View className="gap-1">
            <Text className="text-sm text-text-tertiary">Workout detail</Text>
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
              <Text className="text-sm text-text-secondary">Exercises</Text>
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
            <Text className="text-base font-semibold text-text-primary">Exercises</Text>
            <View className="gap-3">
              {session.exercises.map((exercise, exerciseIndex) => (
                <View
                  key={`${exercise.exerciseId}-${exerciseIndex}`}
                  className="gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <View className="gap-1">
                    <Text className="text-base font-semibold text-text-primary">
                      {exercise.exerciseName}
                    </Text>
                    <Text className="text-xs text-text-tertiary">
                      Target: {formatSetTargetsSummary(exercise.targetSets)}
                    </Text>
                  </View>

                  <View className="flex-row flex-wrap gap-2">
                    <View className="rounded-full bg-surface px-2 py-1">
                      <Text className="text-[11px] font-semibold text-text-secondary">
                        {exercise.isDone ? "Done" : "Open"}
                      </Text>
                    </View>
                    <View className="rounded-full bg-surface px-2 py-1">
                      <Text className="text-[11px] font-semibold text-text-secondary">
                        {formatStatNumber(exercise.totalSets)} sets
                      </Text>
                    </View>
                    <View className="rounded-full bg-surface px-2 py-1">
                      <Text className="text-[11px] font-semibold text-text-secondary">
                        {formatStatNumber(exercise.totalReps)} reps
                      </Text>
                    </View>
                    <View className="rounded-full bg-surface px-2 py-1">
                      <Text className="text-[11px] font-semibold text-text-secondary">
                        {formatVolumeKg(exercise.totalVolumeKg)}
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    {exercise.performedSets.map((set, setIndex) => (
                      <View
                        key={`${exercise.exerciseId}-${setIndex}`}
                        className="gap-2 rounded-xl bg-surface p-3"
                      >
                        <Text className="text-xs font-semibold text-text-secondary">
                          Set {setIndex + 1}
                        </Text>
                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-text-secondary">Reps</Text>
                          <Text className="text-xs font-semibold text-text-primary">
                            {formatPerformedValue(set.reps)}
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-text-secondary">Weight</Text>
                          <Text className="text-xs font-semibold text-text-primary">
                            {formatPerformedValue(set.weightKg, " kg")}
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-text-secondary">Rest</Text>
                          <Text className="text-xs font-semibold text-text-primary">
                            {formatPerformedValue(set.restSec, " sec")}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}
