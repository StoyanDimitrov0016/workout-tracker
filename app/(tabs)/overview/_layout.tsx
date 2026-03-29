import { Stack } from "expo-router";

import { useDefaultStackScreenOptions } from "@/components/navigation/use-default-stack-screen-options";

export default function OverviewStackLayout() {
  const screenOptions = useDefaultStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: "Overview" }} />
    </Stack>
  );
}
