import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Doc } from "@/convex/_generated/dataModel";
import { preferencesResource } from "@/features/preferences/data/preferences-resource";
import { RestTimer } from "@/features/start-session/components/rest-timer";
import { SessionExerciseCard } from "@/features/start-session/components/session-exercise-card";
import { TIMER_PRESETS } from "@/features/start-session/constants/timer";
import { buildSessionEntryDrafts } from "@/features/start-session/utils/session-draft";
import { useActiveWorkoutSession } from "@/features/start-session/hooks/use-active-workout-session";
import { useRestTimer } from "@/features/start-session/hooks/use-rest-timer";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { formatDateTime } from "@/utils/format/date-time";

type ActiveSessionWorkspaceProps = {
  session: Doc<"workoutSessions">;
};

export function ActiveSessionWorkspace({ session }: ActiveSessionWorkspaceProps) {
  const router = useRouter();
  const timer = useRestTimer();
  const exercisePreferences = preferencesResource.useExercisePreferences();
  const {
    canFinish,
    entries,
    isFinishing,
    updateSetDraft,
    addSet,
    toggleDone,
    finish,
  } = useActiveWorkoutSession(session);
  const fallbackEntries = buildSessionEntryDrafts(session);
  const preferenceByExerciseId = new Map(
    (exercisePreferences ?? []).map((preference) => [String(preference.exerciseId), preference])
  );

  return (
    <View className="gap-6">
      <View className="gap-1">
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
          const entry = entries[String(exerciseIndex)] ?? fallbackEntries[String(exerciseIndex)];

          return (
            <SessionExerciseCard
              key={`${exercise.exerciseId}-${exerciseIndex}`}
              name={exercise.exerciseName}
              setTargets={exercise.targetSets}
              sets={entry.sets}
              isDone={entry.isDone}
              preference={preferenceByExerciseId.get(String(exercise.exerciseId))}
              onToggleDone={() => toggleDone(exerciseIndex)}
              onAddSet={() => addSet(exerciseIndex)}
              onChangeSet={(setIndex, next) => updateSetDraft(exerciseIndex, setIndex, next)}
              onOpenPreference={() =>
                router.push({
                  pathname: "/(modals)/exercise-preference",
                  params: { exerciseId: String(exercise.exerciseId) },
                })
              }
            />
          );
        })}
      </View>

      <Text className="text-xs text-text-tertiary">
        Session progress is now saved automatically while you train.
      </Text>

      {!canFinish ? (
        <Text className="text-xs text-text-tertiary">
          Log at least one set or mark an exercise done before finishing this workout.
        </Text>
      ) : null}

      <Pressable
        onPress={async () => {
          const finishedSessionId = await finish();
          if (!finishedSessionId) return;

          router.replace({
            pathname: "/start-session/summary/[sessionId]",
            params: { sessionId: finishedSessionId },
          });
        }}
        disabled={isFinishing || !canFinish}
        className={`rounded-xl py-3 ${isFinishing || !canFinish ? "bg-primary/60" : "bg-primary"}`}
      >
        <Text className="text-center font-semibold text-white">
          {isFinishing ? "Finishing..." : "Finish workout"}
        </Text>
      </Pressable>
    </View>
  );
}
