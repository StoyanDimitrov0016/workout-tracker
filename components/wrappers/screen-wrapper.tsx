import { useHeaderHeight } from "@react-navigation/elements";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: ReactNode;
}

export function ScreenWrapper({ children }: ScreenWrapperProps) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const effectiveHeaderHeight = headerHeight > 0 ? headerHeight : 56 + insets.top;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{
            paddingTop: effectiveHeaderHeight + 12,
            paddingBottom: 24,
            paddingHorizontal: 16,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
