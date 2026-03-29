import { Stack } from "expo-router";

import { useDefaultStackScreenOptions } from "@/components/navigation/use-default-stack-screen-options";

export default function StartSessionStackLayout() {
  const screenOptions = useDefaultStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: "Start session" }} />
    </Stack>
  );
}
