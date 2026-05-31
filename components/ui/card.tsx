import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import type { ReactNode } from "react";

type CardVariant = "default" | "surface" | "outline";

type CardProps = {
  variant?: CardVariant;
  onPress?: () => void;
  className?: string;
  children: ReactNode;
} & Pick<ViewProps, "style"> &
  Pick<PressableProps, "disabled">;

const variantClasses: Record<CardVariant, string> = {
  default: "border border-border bg-card",
  surface: "border border-border bg-surface",
  outline: "border border-border bg-transparent",
};

export function Card({
  variant = "default",
  onPress,
  className,
  children,
  style,
  disabled,
}: CardProps) {
  const classes = ["rounded-2xl p-4", variantClasses[variant], className ?? ""]
    .filter(Boolean)
    .join(" ");

  if (onPress) {
    return (
      <Pressable onPress={onPress} disabled={disabled} style={style} className={classes}>
        {children}
      </Pressable>
    );
  }

  return (
    <View style={style} className={classes}>
      {children}
    </View>
  );
}
