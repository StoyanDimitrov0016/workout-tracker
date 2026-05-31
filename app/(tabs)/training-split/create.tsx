import { Stack, useRouter } from "expo-router";
import { SplitBuilderSkeleton } from "@/components/feedback/loading-skeleton";
import { RouteErrorBoundary } from "@/components/feedback/route-error-boundary";
import { Screen } from "@/components/ui/screen";
import { SplitBuilder } from "@/features/splits/components/split-builder";
import { splitResource } from "@/features/splits/data/split-resource";

export { RouteErrorBoundary as ErrorBoundary };

export default function TrainingSplitCreate() {
  const router = useRouter();
  const split = splitResource.useMine();

  if (split === undefined) {
    return (
      <Screen scroll={false}>
        <SplitBuilderSkeleton />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <Stack.Screen options={{ title: "Create plan" }} />
      <SplitBuilder
        initialSplit={split}
        submitLabel="Save split"
        onSaved={() => router.replace("/training-split")}
      />
    </Screen>
  );
}
