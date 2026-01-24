import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MeasurementsTab() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-xl text-black dark:text-white">Measurements Tab</Text>
    </SafeAreaView>
  );
}
