import { Stack } from "expo-router";

import { useDefaultStackScreenOptions } from "@/components/navigation/use-default-stack-screen-options";

export default function MeasurementsStackLayout() {
  const screenOptions = useDefaultStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: "Measurements" }} />
      <Stack.Screen name="weight" options={{ title: "Measurements" }} />
      <Stack.Screen name="circumferences" options={{ title: "Measurements" }} />
    </Stack>
  );
}
