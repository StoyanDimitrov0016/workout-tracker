import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: ReactNode;
  scroll?: boolean;
}

export function ScreenWrapper({ children, scroll = true }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const contentPadding = {
    paddingTop: 12,
    paddingBottom: 24 + tabBarHeight,
    paddingLeft: 16 + insets.left,
    paddingRight: 16 + insets.right,
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentInsetAdjustmentBehavior="automatic"
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
    </View>
  );
}
