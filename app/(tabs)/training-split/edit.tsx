import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { RouteErrorBoundary } from "@/components/feedback/route-error-boundary";
import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { SplitBuilder } from "@/features/splits/components/split-builder";
import { splitResource } from "@/features/splits/data/split-resource";

export { RouteErrorBoundary as ErrorBoundary };

export default function TrainingSplitEdit() {
  const router = useRouter();
  const split = splitResource.useMine();

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <ScreenStateMessage title="Loading..." showSpinner />
      </ScreenWrapper>
    );
  }

  if (!split) {
    return (
      <ScreenWrapper>
        <Stack.Screen options={{ title: "Edit plan" }} />
        <View className="gap-3">
          <Text className="text-lg font-semibold text-text-primary">No plan yet</Text>
          <Pressable
            onPress={() => router.replace("/training-split/create")}
            className="rounded-xl bg-primary px-4 py-3"
          >
            <Text className="font-semibold text-white">Create split</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll={false}>
      <Stack.Screen options={{ title: "Edit plan" }} />
      <SplitBuilder
        initialSplit={split}
        submitLabel="Save changes"
        onSaved={() => router.replace("/training-split")}
      />
    </ScreenWrapper>
  );
}
