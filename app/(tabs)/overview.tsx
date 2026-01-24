import { ScreenWrapper } from "@/components/wrappers/screen-wrapper";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OverviewTab() {
  return (
    <ScreenWrapper>
      <Text className="text-text-primary text-xl">Overview Tab</Text>
    </ScreenWrapper>
  );
}
