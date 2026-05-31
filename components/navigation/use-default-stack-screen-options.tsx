import { useRouter } from "expo-router";
import { useMemo } from "react";
import { View, useColorScheme } from "react-native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { AppHeaderActions } from "@/components/app-header-actions";

/**
 * One source of truth for header look/behavior across the app.
 *
 * Important: we intentionally DO NOT set header height manually.
 * Let React Navigation manage safe areas + platform-specific sizing.
 */
export function useDefaultStackScreenOptions(): NativeStackNavigationOptions {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  return useMemo(() => {
    const backgroundColor = isDark ? "rgb(17 24 39)" : "rgb(255 255 255)";
    const tintColor = isDark ? "rgb(243 244 246)" : "rgb(17 24 39)";

    const options: NativeStackNavigationOptions = {
      headerTitleAlign: "left",
      headerTransparent: false,
      headerStyle: {
        backgroundColor,
      },
      headerTintColor: tintColor,
      headerBackButtonDisplayMode: "minimal",
      headerTitleStyle: { color: tintColor, fontWeight: "600" },
      headerShadowVisible: true,
      headerRight: () => (
        <View style={{ paddingRight: 12, paddingVertical: 6 }}>
          <AppHeaderActions onPress={() => router.push("/(modals)/account")} />
        </View>
      ),
    };
    return options;
  }, [isDark, router]);
}
