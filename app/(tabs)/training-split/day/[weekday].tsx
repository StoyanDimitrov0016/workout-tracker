import { Stack, useRouter } from "expo-router";
import { TrainingSplitDaySkeleton } from "@/components/feedback/loading-skeleton";
import { RouteErrorBoundary } from "@/components/feedback/route-error-boundary";
import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { Screen } from "@/components/ui/screen";
import { weekdayToLabel } from "@/features/splits/constants/weekdays";
import { splitResource } from "@/features/splits/data/split-resource";
import { TrainingSplitDayContent } from "@/features/splits/components/training-split-day-content";
import {
  useValidatedLocalSearchParam,
  WeekdayParamSchema,
} from "@/hooks/use-validated-local-search-param";

export { RouteErrorBoundary as ErrorBoundary };

export default function TrainingSplitDay() {
  const router = useRouter();
  const weekday = useValidatedLocalSearchParam("weekday", WeekdayParamSchema);
  const split = splitResource.useMine();

  if (split === undefined) {
    return (
      <Screen>
        <TrainingSplitDaySkeleton />
      </Screen>
    );
  }

  if (weekday === null) {
    return (
      <Screen>
        <ScreenStateMessage title="Invalid weekday." />
      </Screen>
    );
  }

  if (!split) {
    return (
      <Screen>
        <Stack.Screen options={{ title: weekdayToLabel(weekday) }} />
        <ScreenStateMessage
          title="No plan yet"
          actionLabel="Create split"
          onAction={() => router.push("/training-split/create")}
        />
      </Screen>
    );
  }

  const day = split.days.find((item) => item.weekday === weekday);

  return (
    <Screen>
      <Stack.Screen options={{ title: weekdayToLabel(weekday) }} />
      <TrainingSplitDayContent weekday={weekday} day={day} />
    </Screen>
  );
}
