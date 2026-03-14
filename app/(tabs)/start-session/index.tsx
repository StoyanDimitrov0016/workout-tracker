import { useMemo, useState } from "react";
import { Text } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { ActiveSessionWorkspace } from "@/features/start-session/components/active-session-workspace";
import { StartSessionEmptyState } from "@/features/start-session/components/start-session-empty-state";
import { UpcomingSessionPreview } from "@/features/start-session/components/upcoming-session-preview";
import { getUpcomingTrainingDay } from "@/features/start-session/utils/session";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function StartSessionTab() {
  const router = useRouter();
  const split = useQuery(api.splits.getMine);
  const activeSession = useQuery(api.workoutSessions.getActive);
  const startSession = useMutation(api.workoutSessions.startFromUpcomingDay);
  const [startErrorMessage, setStartErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const upcomingDay = useMemo(() => {
    if (!split) return null;
    return getUpcomingTrainingDay(split.days);
  }, [split]);

  if (split === undefined || activeSession === undefined) {
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

  if (!activeSession && !upcomingDay) {
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
      ) : upcomingDay ? (
        <UpcomingSessionPreview
          day={upcomingDay}
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
