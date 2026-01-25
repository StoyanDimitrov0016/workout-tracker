import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

export default function SignUp() {
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
      {/* Back Button */}
      <View className="pt-4">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface active:opacity-80"
        >
          <Ionicons name="arrow-back" size={20} color="rgb(17 24 39)" />
        </Pressable>
      </View>

      {/* Hero Section */}
      <View className="flex-1 justify-center">
        {/* Icon/Logo */}
        <View className="mb-8 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
            <Ionicons name="barbell" size={40} color="rgb(239 68 68)" />
          </View>
        </View>

        {/* Heading */}
        <Text className="text-4xl font-bold text-text-primary">Start your journey</Text>
        <Text className="mt-3 text-lg text-text-secondary">
          Track workouts, measure progress, achieve goals
        </Text>

        {/* Features List */}
        <View className="mt-8 gap-3">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Ionicons name="checkmark" size={20} color="rgb(34 197 94)" />
            </View>
            <Text className="flex-1 text-base text-text-secondary">
              Log workouts and track progress
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Ionicons name="checkmark" size={20} color="rgb(34 197 94)" />
            </View>
            <Text className="flex-1 text-base text-text-secondary">Monitor body measurements</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Ionicons name="checkmark" size={20} color="rgb(34 197 94)" />
            </View>
            <Text className="flex-1 text-base text-text-secondary">
              Visualize your fitness journey
            </Text>
          </View>
        </View>

        {/* Google Sign Up Button */}
        <Pressable
          onPress={onGoogle}
          className="mt-8 flex-row items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 active:opacity-80"
        >
          <Ionicons name="logo-google" size={20} color="white" />
          <Text className="text-base font-semibold text-white">Continue with Google</Text>
        </Pressable>

        {/* Sign In Link */}
        <View className="mt-6 flex-row items-center justify-center gap-1">
          <Text className="text-base text-text-secondary">Already have an account?</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-base font-semibold text-primary">Sign in</Text>
          </Pressable>
        </View>
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
