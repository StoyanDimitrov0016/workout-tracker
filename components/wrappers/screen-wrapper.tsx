import { ReactNode } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: ReactNode;
}

export function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView className="flex-1 px-4">{children}</ScrollView>
    </SafeAreaView>
  );
}
