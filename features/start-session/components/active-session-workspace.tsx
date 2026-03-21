import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Doc } from "@/convex/_generated/dataModel";
import { formatDateTime } from "@/features/measurements/utils/format-date-time";
import { formatWeightKg } from "@/features/measurements/utils/weight";
import { RestTimer } from "@/features/start-session/components/rest-timer";
import { SessionExerciseCard } from "@/features/start-session/components/session-exercise-card";
import { TIMER_PRESETS } from "@/features/start-session/constants/timer";
import { useActiveWorkoutSession } from "@/features/start-session/hooks/use-active-workout-session";
import { useRestTimer } from "@/features/start-session/hooks/use-rest-timer";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";

type ActiveSessionWorkspaceProps = {
  session: Doc<"workoutSessions">;
};

function formatDraftNumber(value: number | null) {
  if (value === null) return "";
  return String(value);
}

export function ActiveSessionWorkspace({ session }: ActiveSessionWorkspaceProps) {
  const router = useRouter();
  const timer = useRestTimer();
  const { entries, errorMessage, isFinishing, updateSetDraft, addSet, toggleDone, finish } =
    useActiveWorkoutSession(session);

  return (
    <View className="gap-6">
      {errorMessage ? (
        <View className="rounded-2xl border border-status-error/20 bg-status-error/10 p-4">
          <Text className="text-sm text-status-error">{errorMessage}</Text>
        </View>
      ) : null}

      <View className="gap-1">
        <Text className="text-sm text-text-tertiary">Active session</Text>
        <Text className="text-2xl font-semibold text-text-primary">
          {session.title.trim() || "Training"}
        </Text>
        <Text className="text-sm text-text-secondary">
          {weekdayToLabel(session.weekday)} | Started {formatDateTime(session.startedAt)}
        </Text>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-text-tertiary">Rest timer</Text>
        <RestTimer
          presets={TIMER_PRESETS}
          seconds={timer.seconds}
          onSelectPreset={timer.selectPreset}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
        />
      </View>

      <View className="gap-3">
        {session.exercises.map((exercise, exerciseIndex) => {
          const entry = entries[String(exerciseIndex)] ?? {
            isDone: exercise.isDone,
            sets: exercise.performedSets.map((set) => ({
              reps: formatDraftNumber(set.reps),
              weightKg: set.weightKg === null ? "" : formatWeightKg(set.weightKg),
              restSec: formatDraftNumber(set.restSec),
            })),
          };

          return (
            <SessionExerciseCard
              key={`${exercise.exerciseId}-${exerciseIndex}`}
              name={exercise.exerciseName}
              setTargets={exercise.targetSets}
              sets={entry.sets}
              isDone={entry.isDone}
              onToggleDone={() => toggleDone(exerciseIndex)}
              onAddSet={() => addSet(exerciseIndex)}
              onChangeSet={(setIndex, next) => updateSetDraft(exerciseIndex, setIndex, next)}
            />
          );
        })}
      </View>

      <Text className="text-xs text-text-tertiary">
        Session progress is now saved automatically while you train.
      </Text>

      <Pressable
        onPress={async () => {
          const finishedSessionId = await finish();
          if (!finishedSessionId) return;

          router.replace({
            pathname: "/start-session/summary/[sessionId]",
            params: { sessionId: finishedSessionId },
          });
        }}
        disabled={isFinishing}
        className={`rounded-xl py-3 ${isFinishing ? "bg-primary/60" : "bg-primary"}`}
      >
        <Text className="text-center font-semibold text-white">
          {isFinishing ? "Finishing..." : "Finish workout"}
        </Text>
      </Pressable>
    </View>
  );
}
