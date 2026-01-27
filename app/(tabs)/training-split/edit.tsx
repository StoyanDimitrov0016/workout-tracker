import { useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { api } from "@/convex/_generated/api";
import { SplitBuilder } from "@/features/splits/components/split-builder";

export default function TrainingSplitEdit() {
  const router = useRouter();
  const split = useQuery(api.splits.getMine);

  if (split === undefined) {
    return (
      <ScreenWrapper>
        <Text className="text-text-secondary">Loading...</Text>
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
    <ScreenWrapper>
      <Stack.Screen options={{ title: "Edit plan" }} />
      <SplitBuilder
        initialSplit={split}
        submitLabel="Save changes"
        onSaved={() => router.replace("/training-split")}
      />
    </ScreenWrapper>
  );
}
