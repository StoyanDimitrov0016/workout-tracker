import { Stack } from "expo-router";

import { getRootTabScreenOptions } from "@/components/navigation/get-root-tab-screen-options";
import { useDefaultStackScreenOptions } from "@/components/navigation/use-default-stack-screen-options";

export default function StatisticsStackLayout() {
  const screenOptions = useDefaultStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={getRootTabScreenOptions()} />
      <Stack.Screen name="history" options={{ title: "Workout history" }} />
      <Stack.Screen name="session/[sessionId]" options={{ title: "Workout detail" }} />
    </Stack>
  );
}
