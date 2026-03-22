import { Text, View } from "react-native";

type InlineErrorBannerProps = {
  message: string;
};

export function InlineErrorBanner({ message }: InlineErrorBannerProps) {
  return (
    <View className="rounded-2xl border border-status-error/20 bg-status-error/10 p-4">
      <Text className="text-sm text-status-error">{message}</Text>
    </View>
  );
}
