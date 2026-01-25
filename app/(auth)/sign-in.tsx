import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

export default function SignIn() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const onGoogle = useCallback(async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "workouttracker",
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
    <View className="flex-1 bg-background px-6">
      {/* Hero Section */}
      <View className="flex-1 justify-center">
        {/* Icon/Logo */}
        <View className="mb-8 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
            <Ionicons name="barbell" size={40} color="rgb(239 68 68)" />
          </View>
        </View>

        {/* Heading */}
        <Text className="text-4xl font-bold text-text-primary">Welcome back</Text>
        <Text className="mt-3 text-lg text-text-secondary">
          Log your workouts and track your progress
        </Text>

        {/* Google Sign In Button */}
        <Pressable
          onPress={onGoogle}
          className="mt-8 flex-row items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 active:opacity-80"
        >
          <Ionicons name="logo-google" size={20} color="rgb(239 68 68)" />
          <Text className="text-base font-semibold text-text-primary">Continue with Google</Text>
        </Pressable>

        {/* Divider */}
        <View className="my-8 flex-row items-center">
          <View className="h-px flex-1 bg-border" />
          <Text className="px-4 text-sm text-text-tertiary">or</Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        {/* Sign Up Link */}
        <Pressable
          onPress={() => router.push("/(auth)/sign-up")}
          className="rounded-2xl bg-surface px-6 py-4 active:opacity-80"
        >
          <Text className="text-center text-base font-semibold text-text-primary">
            Create new account
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View className="pb-8">
        <Text className="text-center text-xs text-text-tertiary">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
