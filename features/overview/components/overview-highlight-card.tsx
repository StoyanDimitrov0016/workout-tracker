import { Pressable, Text, View } from "react-native";

type OverviewHighlightCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  meta?: string;
};

export function OverviewHighlightCard({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  meta,
}: OverviewHighlightCardProps) {
  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-4">
      <View className="gap-1">
        <Text className="text-xs font-semibold text-text-tertiary">{eyebrow}</Text>
        <Text className="text-lg font-semibold text-text-primary">{title}</Text>
        <Text className="text-sm text-text-secondary">{description}</Text>
      </View>

      {meta ? <Text className="text-xs text-text-tertiary">{meta}</Text> : null}

      <Pressable onPress={onAction} className="rounded-xl bg-primary px-4 py-3">
        <Text className="text-center font-semibold text-white">{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
