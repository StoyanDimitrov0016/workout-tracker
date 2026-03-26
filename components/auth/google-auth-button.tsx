import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text } from "react-native";

type GoogleAuthButtonProps = {
  label?: string;
  isLoading?: boolean;
  onPress: () => void;
};

export function GoogleAuthButton({
  label = "Continue with Google",
  isLoading = false,
  onPress,
}: GoogleAuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className="mt-8 flex-row items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4"
      style={({ pressed }) => [{ opacity: pressed || isLoading ? 0.8 : 1 }]}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Ionicons name="logo-google" size={20} color="white" />
      )}
      <Text className="text-base font-semibold text-white">
        {isLoading ? "Connecting..." : label}
      </Text>
    </Pressable>
  );
}
