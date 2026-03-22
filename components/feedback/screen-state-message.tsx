import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ScreenStateMessageProps = {
  title: string;
  description?: string;
  showSpinner?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

export function ScreenStateMessage({
  title,
  description,
  showSpinner = false,
  actionLabel,
  onAction,
}: ScreenStateMessageProps) {
  return (
    <View className="gap-3">
      {showSpinner ? (
        <View className="items-start">
          <ActivityIndicator />
        </View>
      ) : null}
      <Text className="text-lg font-semibold text-text-primary">{title}</Text>
      {description ? <Text className="text-sm text-text-secondary">{description}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} className="self-start rounded-xl bg-primary px-4 py-3">
          <Text className="font-semibold text-white">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
