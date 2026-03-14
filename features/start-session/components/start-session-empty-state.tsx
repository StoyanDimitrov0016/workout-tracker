import { Pressable, Text, View } from "react-native";

type StartSessionEmptyStateProps = {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
};

export function StartSessionEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: StartSessionEmptyStateProps) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold text-text-primary">{title}</Text>
      {description ? <Text className="text-sm text-text-secondary">{description}</Text> : null}
      <Pressable onPress={onAction} className="rounded-xl bg-primary px-4 py-3">
        <Text className="font-semibold text-white">{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
