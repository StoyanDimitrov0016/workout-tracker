import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SplitBuilderSkeleton } from "@/components/feedback/loading-skeleton";
import { RouteErrorBoundary } from "@/components/feedback/route-error-boundary";
import { Screen } from "@/components/ui/screen";
import { SplitBuilder } from "@/features/splits/components/split-builder";
import { splitResource } from "@/features/splits/data/split-resource";

export { RouteErrorBoundary as ErrorBoundary };

export default function TrainingSplitEdit() {
  const router = useRouter();
  const split = splitResource.useMine();

  if (split === undefined) {
    return (
      <Screen scroll={false}>
        <SplitBuilderSkeleton />
      </Screen>
    );
  }

  if (!split) {
    return (
      <Screen>
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
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <Stack.Screen options={{ title: "Edit plan" }} />
      <SplitBuilder
        initialSplit={split}
        submitLabel="Save changes"
        onSaved={() => router.replace("/training-split")}
      />
    </Screen>
  );
}
