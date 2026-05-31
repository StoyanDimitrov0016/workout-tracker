import { useRouter } from "expo-router";
import { useMemo } from "react";
import { View, useColorScheme } from "react-native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { AppHeaderActions } from "@/components/app-header-actions";
import { getNavigationColors } from "@/constants/navigation";

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
    const { backgroundColor, headerTintColor } = getNavigationColors(isDark);

    const options: NativeStackNavigationOptions = {
      contentStyle: { backgroundColor },
      headerTitleAlign: "left",
      headerTransparent: false,
      headerStyle: {
        backgroundColor,
      },
      headerTintColor,
      headerBackButtonDisplayMode: "minimal",
      headerTitleStyle: { color: headerTintColor, fontWeight: "600" },
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
