import "react-native-reanimated";
import "../global.css";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { ScreenStateMessage } from "@/components/feedback/screen-state-message";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = { anchor: "(tabs)" };

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ScreenStateMessage
          title="Loading account..."
          description="Restoring your session."
          showSpinner
        />
      </View>
    );
  }

  return (
    <Stack>
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

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        tokenCache={tokenCache}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <RootNavigator />
          <StatusBar style="auto" />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ThemeProvider>
  );
}
