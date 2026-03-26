import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, useColorScheme } from "react-native";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { InlineErrorBanner } from "@/components/feedback/inline-error-banner";
import { useGoogleSso } from "@/hooks/use-google-sso";

export default function SignUp() {
  const { errorMessage, isSubmitting, startGoogleSso } = useGoogleSso();
  const isDark = useColorScheme() === "dark";
  const accentColor = isDark ? "rgb(248 113 113)" : "rgb(239 68 68)";
  const successColor = isDark ? "rgb(74 222 128)" : "rgb(34 197 94)";

  return (
    <View className="flex-1 bg-background px-6 pt-8">
      <View className="absolute -right-20 -top-28 h-64 w-64 rounded-full bg-primary/10" />
      <View className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-secondary/10" />

      <View className="relative z-10 flex-1">
        <AuthTabs active="sign-up" />

        <View className="mt-10 flex-1 justify-center">
          <View className="rounded-3xl border border-border bg-card p-6">
            <View className="items-center">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Ionicons name="barbell" size={36} color={accentColor} />
              </View>
              <Text className="mt-6 text-3xl font-bold text-text-primary">Start your journey</Text>
              <Text className="mt-2 text-center text-base text-text-secondary">
                Track workouts, measure progress, and hit new PRs.
              </Text>
            </View>

            <View className="mt-6 gap-3">
              <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
                <Ionicons name="checkmark-circle" size={20} color={successColor} />
                <Text className="flex-1 text-sm font-semibold text-text-secondary">
                  Log workouts and track progress
                </Text>
              </View>
              <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
                <Ionicons name="checkmark-circle" size={20} color={successColor} />
                <Text className="flex-1 text-sm font-semibold text-text-secondary">
                  Monitor body measurements
                </Text>
              </View>
              <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
                <Ionicons name="checkmark-circle" size={20} color={successColor} />
                <Text className="flex-1 text-sm font-semibold text-text-secondary">
                  Visualize your fitness journey
                </Text>
              </View>
            </View>

            {errorMessage ? <InlineErrorBanner message={errorMessage} /> : null}

            <GoogleAuthButton isLoading={isSubmitting} onPress={startGoogleSso} />

            <Text className="mt-4 text-center text-xs text-text-tertiary">
              One tap to create your account with Google.
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
