import { Stack, useRouter } from "expo-router";
import { SplitBuilderSkeleton } from "@/components/feedback/loading-skeleton";
import { RouteErrorBoundary } from "@/components/feedback/route-error-boundary";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { SplitBuilder } from "@/features/splits/components/split-builder";
import { splitResource } from "@/features/splits/data/split-resource";

export { RouteErrorBoundary as ErrorBoundary };

export default function TrainingSplitCreate() {
  const router = useRouter();
  const split = splitResource.useMine();

  if (split === undefined) {
    return (
      <ScreenWrapper scroll={false}>
        <SplitBuilderSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll={false}>
      <Stack.Screen options={{ title: "Create plan" }} />
      <SplitBuilder
        initialSplit={split}
        submitLabel="Save split"
        onSaved={() => router.replace("/training-split")}
      />
    </ScreenWrapper>
  );
}
