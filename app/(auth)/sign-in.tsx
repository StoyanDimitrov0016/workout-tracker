import { useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";

import { AuthTabs } from "@/components/auth/auth-tabs";

export default function SignIn() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const isDark = useColorScheme() === "dark";
  const accentColor = isDark ? "rgb(248 113 113)" : "rgb(239 68 68)";

  const onGoogle = useCallback(async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "workouttracker",
        path: "sso-callback",
      });

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        router.replace("/(tabs)/overview");
      }
    } catch (e) {
      console.error(e);
    }
  }, [router, startSSOFlow]);

  return (
    <View className="flex-1 bg-background px-6 pt-8">
      <View className="absolute -left-16 -top-24 h-56 w-56 rounded-full bg-primary/10" />
      <View className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-secondary/10" />

      <View className="relative z-10 flex-1">
        <AuthTabs active="sign-in" />

        <View className="mt-10 flex-1 justify-center">
          <View className="rounded-3xl border border-border bg-card p-6">
            <View className="items-center">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Ionicons name="barbell" size={36} color={accentColor} />
              </View>
              <Text className="mt-6 text-3xl font-bold text-text-primary">Welcome back</Text>
              <Text className="mt-2 text-center text-base text-text-secondary">
                Log your workouts and keep your momentum going.
              </Text>
            </View>

            <Pressable
              onPress={onGoogle}
              className="mt-8 flex-row items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 active:opacity-80"
            >
              <Ionicons name="logo-google" size={20} color="white" />
              <Text className="text-base font-semibold text-white">Continue with Google</Text>
            </Pressable>

            <View className="my-6 flex-row items-center">
              <View className="h-px flex-1 bg-border" />
              <Text className="px-4 text-xs font-semibold text-text-tertiary">or</Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            <Pressable
              onPress={() => router.replace("/(auth)/sign-up")}
              className="rounded-2xl border border-border bg-surface px-6 py-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-text-primary">
                Create new account
              </Text>
            </Pressable>

            <Text className="mt-4 text-center text-xs text-text-tertiary">
              Use your Google account to continue.
            </Text>
          </View>
        </View>

        <View className="pb-8">
          <Text className="text-center text-xs text-text-tertiary">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
}
