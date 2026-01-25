import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 bg-background px-6">
      {/* Modal Content Centered */}
      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-md rounded-3xl border border-border bg-card p-8">
          {/* Icon */}
          <View className="mb-6 items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="information-circle" size={32} color="rgb(239 68 68)" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-center text-2xl font-bold text-text-primary">This is a modal</Text>

          {/* Description */}
          <Text className="mt-3 text-center text-base text-text-secondary">
            Some content here. Styling is using your theme variables.
          </Text>

          {/* Primary Action */}
          <Link href="/(tabs)/overview" dismissTo asChild>
            <Pressable className="mt-8 rounded-2xl bg-primary px-4 py-4 active:opacity-80">
              <Text className="text-center text-base font-semibold text-white">Go to overview</Text>
            </Pressable>
          </Link>

          {/* Secondary Action */}
          <Link href="../" dismissTo asChild>
            <Pressable className="mt-3 py-3 active:opacity-70">
              <Text className="text-center text-base font-medium text-text-secondary">Close</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
