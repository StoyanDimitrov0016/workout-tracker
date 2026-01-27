import { useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { Text } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { SplitBuilder } from "@/features/splits/components/split-builder";

export default function TrainingSplitCreate() {
  const router = useRouter();
  const split = useQuery(api.splits.getMine);

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
