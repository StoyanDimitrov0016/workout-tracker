import { Stack } from "expo-router";

import { useDefaultStackScreenOptions } from "@/components/navigation/use-default-stack-screen-options";

export default function MeasurementsStackLayout() {
  const screenOptions = useDefaultStackScreenOptions();

  return <Stack screenOptions={screenOptions} />;
}
