import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function AccountModal() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <View className="flex-1 bg-background px-6 pt-6">
      <Text className="text-2xl font-semibold text-text-primary">
        {user?.fullName ?? "Account"}
      </Text>

      <Pressable
        onPress={async () => {
          await signOut();
          router.replace("/(auth)/sign-in");
        }}
        className="mt-6 rounded-2xl bg-primary px-5 py-4"
      >
        <Text className="text-center font-semibold text-white">Sign out</Text>
      </Pressable>
    </View>
  );
}
