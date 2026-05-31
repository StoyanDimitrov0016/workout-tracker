import "react-native-reanimated";
import "../global.css";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastPosition, Toasts } from "@backpackapp-io/react-native-toast";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { getNavigationColors } from "@/constants/navigation";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = { anchor: "(tabs)" };

void SplashScreen.preventAutoHideAsync().catch(() => null);

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

// Keep these in sync with the NativeWind CSS variables in global.css. The toast
// host only accepts React Native style objects, and NativeWind variable reads use
// an unstable runtime API.
const toastColors = {
  light: {
    border: "#e5e7eb",
    surface: "#ffffff",
    text: "#111827",
  },
  dark: {
    border: "#374151",
    surface: "#1f2937",
    text: "#f3f4f6",
  },
};

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  const colorScheme = useColorScheme();
  const { backgroundColor } = getNavigationColors(colorScheme === "dark");

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    void SplashScreen.hideAsync();
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor } }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = toastColors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <ClerkProvider
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
            tokenCache={tokenCache}
          >
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
              <RootNavigator />
              <StatusBar style="auto" />
              <Toasts
                defaultPosition={ToastPosition.TOP}
                defaultDuration={3000}
                defaultStyle={{
                  pressable: {
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                  },
                  view: {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: 12,
                    borderWidth: 1,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                  },
                  text: {
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: "600",
                  },
                }}
              />
            </ConvexProviderWithClerk>
          </ClerkProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
