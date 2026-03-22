import { useHeaderHeight } from "@react-navigation/elements";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: ReactNode;
  scroll?: boolean;
}

export function ScreenWrapper({ children, scroll = true }: ScreenWrapperProps) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const effectiveHeaderHeight = headerHeight > 0 ? headerHeight : 56 + insets.top;
  const contentPadding = {
    paddingTop: effectiveHeaderHeight + 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentInsetAdjustmentBehavior="never"
            contentContainerStyle={{ ...contentPadding, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1" style={contentPadding}>
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
