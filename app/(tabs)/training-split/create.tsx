import { Stack, useRouter } from "expo-router";
import { RouteErrorBoundary } from "@/components/feedback/route-error-boundary";
import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { SplitBuilder } from "@/features/splits/components/split-builder";
import { splitResource } from "@/features/splits/data/split-resource";

export { RouteErrorBoundary as ErrorBoundary };

export default function TrainingSplitCreate() {
  const router = useRouter();
  const split = splitResource.useMine();

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <ScreenStateMessage title="Loading..." showSpinner />
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
