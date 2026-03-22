import { useUser } from "@clerk/expo";
import { Image, Pressable, Text, View } from "react-native";

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function AppHeaderActions({ onPress }: { onPress?: () => void }) {
  const { user } = useUser();
  const initials = getInitials(
    user?.fullName ?? user?.username ?? user?.firstName ?? user?.lastName
  );
  const avatarUrl = user?.imageUrl;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={12}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="h-full w-full" />
        ) : (
          <Text className="text-xs font-semibold text-text-secondary">{initials}</Text>
        )}
      </View>
    </Pressable>
  );
}
