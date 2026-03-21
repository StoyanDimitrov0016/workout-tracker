import { Stack, useRouter } from "expo-router";
import { Text } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { SplitBuilder } from "@/features/splits/components/split-builder";
import { splitResource } from "@/features/splits/data/split-resource";

export default function TrainingSplitCreate() {
  const router = useRouter();
  const split = splitResource.useMine();

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: "Create plan" }} />
      <SplitBuilder
        initialSplit={split}
        submitLabel="Save split"
        onSaved={() => router.replace("/training-split")}
      />
    </ScreenWrapper>
  );
}
