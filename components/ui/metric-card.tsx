import { Text, View } from "react-native";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string | number;
  helperText?: string;
  className?: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, helperText, className, icon }: MetricCardProps) {
  return (
    <Card className={["min-w-36 flex-1 gap-1", className ?? ""].filter(Boolean).join(" ")}>
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-xs font-semibold text-text-tertiary">{label}</Text>
        {icon}
      </View>
      <Text className="text-2xl font-semibold text-text-primary">{value}</Text>
      {helperText ? <Text className="text-xs text-text-tertiary">{helperText}</Text> : null}
    </Card>
  );
}
