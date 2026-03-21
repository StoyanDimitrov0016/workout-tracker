import { useState } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { ActiveSessionWorkspace } from "@/features/start-session/components/active-session-workspace";
import { StartSessionEmptyState } from "@/features/start-session/components/start-session-empty-state";
import { UpcomingSessionPreview } from "@/features/start-session/components/upcoming-session-preview";
import { workoutSessionResource } from "@/features/start-session/data/workout-session-resource";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function StartSessionScreen() {
  const router = useRouter();
  const split = useQuery(api.splits.getMine);
  const activeSession = workoutSessionResource.useActive();
  const upcomingAvailability = workoutSessionResource.useUpcomingAvailability();
  const startSession = workoutSessionResource.useStart();
  const [startErrorMessage, setStartErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  if (split === undefined || activeSession === undefined || upcomingAvailability === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
      </ScreenWrapper>
    );
  }

  if (!activeSession && !split) {
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

  if (!activeSession && upcomingAvailability?.status === "no_training_day") {
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
      ) : upcomingAvailability?.status === "completed_today" ? (
        <StartSessionEmptyState
          title="Today's planned workout is already completed"
          description="Review the summary or come back on your next scheduled training day."
          actionLabel="View summary"
          onAction={() =>
            router.push({
              pathname: "/start-session/summary/[sessionId]",
              params: { sessionId: upcomingAvailability.sessionId },
            })
          }
        />
      ) : upcomingAvailability?.status === "available" ? (
        <UpcomingSessionPreview
          day={upcomingAvailability.day}
          isStarting={isStarting}
          errorMessage={startErrorMessage}
          onStart={async () => {
            setStartErrorMessage(null);
            setIsStarting(true);

            try {
              await startSession({});
            } catch (error) {
              setStartErrorMessage(getErrorMessage(error, "Could not start the session."));
            } finally {
              setIsStarting(false);
            }
          }}
        />
      ) : (
        <Text className="text-text-secondary">Loading...</Text>
      )}
    </ScreenWrapper>
  );
}
