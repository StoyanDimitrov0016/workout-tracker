import { Text, View } from "react-native";

type SplitBuilderStepHeaderProps = {
  stepLabel: string;
  title: string;
  description: string;
};

export function SplitBuilderStepHeader({
  stepLabel,
  title,
  description,
}: SplitBuilderStepHeaderProps) {
  return (
    <View className="gap-1">
      <Text className="text-xs font-semibold text-text-tertiary">{stepLabel}</Text>
      <Text className="text-2xl font-semibold text-text-primary">{title}</Text>
      <Text className="text-sm text-text-secondary">{description}</Text>
    </View>
  );
}
