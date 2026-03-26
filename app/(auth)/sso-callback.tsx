import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { View } from "react-native";

import { ScreenStateMessage } from "@/components/feedback/screen-state-message";

export default function SsoCallback() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ScreenStateMessage
          title="Completing sign-in..."
          description="Finishing your Google authentication."
          showSpinner
        />
      </View>
    );
  }

  return <Redirect href={isSignedIn ? "/(tabs)/overview" : "/(auth)/sign-in"} />;
}
