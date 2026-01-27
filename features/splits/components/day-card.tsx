import { Pressable, Text, View } from "react-native";

interface DayCardProps {
  label: string;
  title: string;
  summary: string;
  compact?: boolean;
  details?: string[];
  tag?: string;
  tagTone?: "train" | "rest";
  onPress: () => void;
}

export function DayCard({
  label,
  title,
  summary,
  compact = false,
  details,
  tag,
  tagTone = "train",
  onPress,
}: DayCardProps) {
  const tagStyles =
    tagTone === "rest"
      ? "bg-secondary-light text-secondary"
      : "bg-primary text-white";

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border border-border bg-card ${
        compact ? "px-4 py-3" : "p-4"
      }`}
    >
      <View className={compact ? "gap-1" : "gap-2"}>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-text-secondary">{label}</Text>
          {tag ? (
            <View className={`rounded-full px-2 py-0.5 ${tagStyles}`}>
              <Text className="text-[10px] font-semibold">{tag}</Text>
            </View>
          ) : null}
        </View>
        <Text className="text-lg font-semibold text-text-primary">{title}</Text>
        {summary ? <Text className="text-xs text-text-tertiary">{summary}</Text> : null}
        {details && details.length > 0 ? (
          <View className="gap-1 pt-2">
            {details.map((detail) => (
              <Text key={detail} className="text-xs text-text-secondary">
                {detail}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
