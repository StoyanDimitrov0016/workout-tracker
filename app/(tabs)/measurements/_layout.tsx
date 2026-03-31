import { Stack } from "expo-router";

import { getRootTabScreenOptions } from "@/components/navigation/get-root-tab-screen-options";
import { useDefaultStackScreenOptions } from "@/components/navigation/use-default-stack-screen-options";
import { MeasurementsDataProvider } from "@/features/measurements/data/measurements-data-context";

export default function MeasurementsStackLayout() {
  const screenOptions = useDefaultStackScreenOptions();

  return (
    <MeasurementsDataProvider>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="index" options={getRootTabScreenOptions()} />
        <Stack.Screen name="weight" options={getRootTabScreenOptions()} />
        <Stack.Screen name="circumferences" options={getRootTabScreenOptions()} />
      </Stack>
    </MeasurementsDataProvider>
  );
}
