import { Text, View } from "react-native";

type MeasurementSaveFeedbackProps = {
  kind: "error" | "success";
  message: string;
};

export function MeasurementSaveFeedback({
  kind,
  message,
}: MeasurementSaveFeedbackProps) {
  const containerClassName =
    kind === "error"
      ? "rounded-xl border border-status-error/20 bg-status-error/10 p-3"
      : "rounded-xl border border-status-success/20 bg-status-success/10 p-3";
  const textClassName =
    kind === "error" ? "text-sm text-status-error" : "text-sm text-status-success";

  return (
    <View className={containerClassName}>
      <Text className={textClassName}>{message}</Text>
    </View>
  );
}
