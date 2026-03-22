import { Text, View } from "react-native";

type ScreenStateMessageProps = {
  title: string;
  description?: string;
};

export function ScreenStateMessage({ title, description }: ScreenStateMessageProps) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold text-text-primary">{title}</Text>
      {description ? <Text className="text-sm text-text-secondary">{description}</Text> : null}
    </View>
  );
}
