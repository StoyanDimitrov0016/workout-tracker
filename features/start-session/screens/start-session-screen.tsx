import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { ActiveSessionWorkspace } from "@/features/start-session/components/active-session-workspace";
import { PlannedSessionDayPicker } from "@/features/start-session/components/planned-session-day-picker";
import { StartSessionEmptyState } from "@/features/start-session/components/start-session-empty-state";
import { workoutSessionResource } from "@/features/start-session/data/workout-session-resource";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function StartSessionScreen() {
  const router = useRouter();
  const activeSession = workoutSessionResource.useActive();
  const plannedDayOptions = workoutSessionResource.usePlannedDayOptions();
  const startSession = workoutSessionResource.useStartPlannedDay();
  const [startErrorMessage, setStartErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [selectedWeekday, setSelectedWeekday] = useState<number | null>(null);

  useEffect(() => {
    if (plannedDayOptions?.status !== "ready") {
      return;
    }

    setSelectedWeekday((current) => {
      if (current !== null && plannedDayOptions.days.some((day) => day.weekday === current)) {
        return current;
      }

      const preferredDay =
        plannedDayOptions.days.find((day) => day.status === "available" && day.isRecommended) ??
        plannedDayOptions.days.find((day) => day.status === "available") ??
        plannedDayOptions.days[0];

      return preferredDay?.weekday ?? null;
    });
  }, [plannedDayOptions]);

  if (activeSession === undefined || plannedDayOptions === undefined) {
    return (
      <ScreenWrapper>
        <ScreenStateMessage title="Loading..." showSpinner />
      </ScreenWrapper>
    );
  }

  if (!activeSession && plannedDayOptions.status === "no_split") {
    return (
      <ScreenWrapper>
        <StartSessionEmptyState
          title="No training day yet"
          actionLabel="Create split"
          onAction={() => router.push("/training-split/create")}
        />
      </ScreenWrapper>
    );
  }

  if (!activeSession && plannedDayOptions.status === "no_training_day") {
    return (
      <ScreenWrapper>
        <StartSessionEmptyState
          title="No training day yet"
          description="Add at least one exercise to your split before starting a session."
          actionLabel="Edit split"
          onAction={() => router.push("/training-split/edit")}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {activeSession ? (
        <ActiveSessionWorkspace key={activeSession._id} session={activeSession} />
      ) : plannedDayOptions.status === "ready" && selectedWeekday !== null ? (
        <PlannedSessionDayPicker
          days={plannedDayOptions.days}
          selectedWeekday={selectedWeekday}
          onSelectWeekday={setSelectedWeekday}
          isStarting={isStarting}
          errorMessage={startErrorMessage}
          onOpenCompleted={(sessionId) =>
            router.push({
              pathname: "/start-session/summary/[sessionId]",
              params: { sessionId },
            })
          }
          onStart={async () => {
            setStartErrorMessage(null);
            setIsStarting(true);

            try {
              await startSession({ weekday: selectedWeekday });
            } catch (error) {
              setStartErrorMessage(getErrorMessage(error, "Could not start the session."));
            } finally {
              setIsStarting(false);
            }
          }}
        />
      ) : (
        <ScreenStateMessage title="Loading..." showSpinner />
      )}
    </ScreenWrapper>
  );
}
