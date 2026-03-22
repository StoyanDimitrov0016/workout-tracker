import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SsoCallback() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={isSignedIn ? "/(tabs)/overview" : "/(auth)/sign-in"} />;
}
