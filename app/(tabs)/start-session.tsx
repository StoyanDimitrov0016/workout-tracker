import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { RestTimer } from "@/features/start-session/components/rest-timer";
import { SessionExerciseCard } from "@/features/start-session/components/session-exercise-card";
import { TIMER_PRESETS } from "@/features/start-session/constants/timer";
import { getUpcomingTrainingDay } from "@/features/start-session/utils/session";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";

export default function StartSessionTab() {
  const router = useRouter();
  const split = useQuery(api.splits.getMine);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [entries, setEntries] = useState<
    Record<string, { isDone: boolean; sets: { reps: string; weightKg: string; restSec: string }[] }>
  >({});

  useEffect(() => {
    if (!isRunning || timerSeconds === null) return;
    if (timerSeconds <= 0) {
      setIsRunning(false);
      return;
    }
    const handle = setInterval(() => {
      setTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(handle);
  }, [isRunning, timerSeconds]);

  const upcomingDay = useMemo(() => {
    if (!split) return null;
    return getUpcomingTrainingDay(split.days);
  }, [split]);

  useEffect(() => {
    if (!upcomingDay) return;
    setEntries(() => {
      const next: Record<
        string,
        { isDone: boolean; sets: { reps: string; weightKg: string; restSec: string }[] }
      > = {};
      upcomingDay.exercises.forEach((exercise, index) => {
        const key = `${exercise.exerciseId}-${index}`;
        const firstTarget = exercise.setTargets[0];
        const firstSet = firstTarget
          ? {
              reps: String(firstTarget.reps),
              weightKg: "",
              restSec: String(firstTarget.restSec),
            }
          : { reps: "", weightKg: "", restSec: "" };
        next[key] = {
          isDone: false,
          sets: [firstSet],
        };
      });
      return next;
    });
  }, [upcomingDay]);

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
      </ScreenWrapper>
    );
  }

  if (!split || !upcomingDay) {
    return (
      <ScreenWrapper>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-text-primary">No training day yet</Text>
          <Pressable
            onPress={() => router.push("/training-split/create")}
            className="rounded-xl bg-primary px-4 py-3"
          >
            <Text className="font-semibold text-white">Create split</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  const dayTitle = upcomingDay.title?.trim() || "Training";

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-sm text-text-tertiary">Rest timer</Text>
            <RestTimer
              presets={TIMER_PRESETS}
              seconds={timerSeconds}
              onSelectPreset={(seconds) => {
                setIsRunning(false);
                setTimerSeconds(seconds);
              }}
              onStart={() => {
                if (timerSeconds === null) {
                  setTimerSeconds(TIMER_PRESETS[0].seconds);
                }
                setIsRunning(true);
              }}
              onPause={() => setIsRunning(false)}
              onReset={() => {
                setIsRunning(false);
                setTimerSeconds(null);
              }}
            />
          </View>

          <View className="gap-2">
            <View className="gap-1">
              <Text className="text-sm text-text-tertiary">Upcoming session</Text>
              <Text className="text-2xl font-semibold text-text-primary">{dayTitle}</Text>
              <Text className="text-sm text-text-secondary">
                {weekdayToLabel(upcomingDay.weekday)}
              </Text>
            </View>

            <View className="gap-3">
              {upcomingDay.exercises.map((exercise, index) => {
                const key = `${exercise.exerciseId}-${index}`;
                const entry = entries[key] ?? {
                  isDone: false,
                  sets: [{ reps: "", weightKg: "", restSec: "" }],
                };
                const targetSetCount = Math.max(1, exercise.setTargets.length);
                const canAddSet = entry.sets.length < targetSetCount;

                return (
                  <SessionExerciseCard
                    key={key}
                    name={exercise.exerciseName}
                    setTargets={exercise.setTargets}
                    sets={entry.sets}
                    isDone={entry.isDone}
                    onToggleDone={() =>
                      setEntries((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], isDone: !prev[key].isDone },
                      }))
                    }
                    onAddSet={() => {
                      if (!canAddSet) return;
                      const nextTarget = exercise.setTargets[entry.sets.length];
                      const nextSet = nextTarget
                        ? {
                            reps: String(nextTarget.reps),
                            weightKg: "",
                            restSec: String(nextTarget.restSec),
                          }
                        : { reps: "", weightKg: "", restSec: "" };
                      setEntries((prev) => ({
                        ...prev,
                        [key]: {
                          ...prev[key],
                          sets: [...prev[key].sets, nextSet],
                        },
                      }));
                    }}
                    onChangeSet={(setIndex, next) =>
                      setEntries((prev) => ({
                        ...prev,
                        [key]: {
                          ...prev[key],
                          sets: prev[key].sets.map((set, i) => (i === setIndex ? next : set)),
                        },
                      }))
                    }
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
