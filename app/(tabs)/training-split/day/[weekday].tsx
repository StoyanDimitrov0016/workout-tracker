import { Stack, useRouter } from "expo-router";
import { TrainingSplitDaySkeleton } from "@/components/feedback/loading-skeleton";
import { RouteErrorBoundary } from "@/components/feedback/route-error-boundary";
import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
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
      <ScreenWrapper>
        <TrainingSplitDaySkeleton />
      </ScreenWrapper>
    );
  }

  if (weekday === null) {
    return (
      <ScreenWrapper>
        <ScreenStateMessage title="Invalid weekday." />
      </ScreenWrapper>
    );
  }

  if (!split) {
    return (
      <ScreenWrapper>
        <Stack.Screen options={{ title: weekdayToLabel(weekday) }} />
        <ScreenStateMessage title="No plan yet" actionLabel="Create split" onAction={() => router.push("/training-split/create")} />
      </ScreenWrapper>
    );
  }

  const day = split.days.find((item) => item.weekday === weekday);

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: weekdayToLabel(weekday) }} />
      <TrainingSplitDayContent weekday={weekday} day={day} />
    </ScreenWrapper>
  );
}
