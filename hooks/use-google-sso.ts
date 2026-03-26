import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

const AUTH_SCHEME = "workouttracker";
const SSO_CALLBACK_PATH = "sso-callback";
const GOOGLE_STRATEGY = "oauth_google";
const GOOGLE_SSO_ERROR_MESSAGE = "Google sign-in could not be completed. Please try again.";

type ClerkErrorLike = {
  code?: string | number;
  message?: string;
  errors?: Array<{
    message?: string;
    longMessage?: string;
  }>;
};

function isCancellationError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const { code } = error as ClerkErrorLike;
  return code === "SIGN_IN_CANCELLED" || code === "SIGN_UP_CANCELLED" || code === -5;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const clerkError = error as ClerkErrorLike;
  const firstError = clerkError.errors?.[0];
  const errorMessage = firstError?.longMessage ?? firstError?.message ?? clerkError.message;

  return errorMessage?.trim() ? errorMessage : fallback;
}

export function getGoogleSsoRedirectUrl() {
  return AuthSession.makeRedirectUri({
    scheme: AUTH_SCHEME,
    path: SSO_CALLBACK_PATH,
  });
}

export function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    void WebBrowser.warmUpAsync();

    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

export function useGoogleSso() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useWarmUpBrowser();

  const startGoogleSso = useCallback(async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: GOOGLE_STRATEGY,
        redirectUrl: getGoogleSsoRedirectUrl(),
      });

      if (!createdSessionId || !setActive) {
        setErrorMessage(GOOGLE_SSO_ERROR_MESSAGE);
        return;
      }

      await setActive({ session: createdSessionId });
      router.replace("/(tabs)/overview");
    } catch (error) {
      if (!isCancellationError(error)) {
        console.error("Google SSO failed", error);
        setErrorMessage(getErrorMessage(error, GOOGLE_SSO_ERROR_MESSAGE));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [router, startSSOFlow]);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    clearError,
    errorMessage,
    isSubmitting,
    startGoogleSso,
  };
}
