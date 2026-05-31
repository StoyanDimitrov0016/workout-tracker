import { useState } from "react";
import { ActivityIndicator, Pressable, type PressableProps, Text, View } from "react-native";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<PressableProps, "children"> & {
  children?: ReactNode;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  outline: "border border-border bg-transparent",
  ghost: "bg-transparent",
  danger: "bg-status-error",
};

const labelClasses: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-text-primary",
  ghost: "text-text-primary",
  danger: "text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-2",
  md: "min-h-11 px-4 py-3",
  lg: "min-h-12 px-5 py-3",
};

export function Button({
  children,
  label,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const isDisabled = disabled || loading;
  const content = children ?? label;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      onPressIn={(event) => {
        setIsPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setIsPressed(false);
        onPressOut?.(event);
      }}
      className={
        [
          "items-center justify-center rounded-xl",
          sizeClasses[size],
          variantClasses[variant],
          fullWidth ? "w-full" : "",
          isDisabled ? "opacity-60" : "",
          isPressed && !isDisabled ? "opacity-80" : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      <View className="flex-row items-center justify-center gap-2">
        {loading ? (
          <ActivityIndicator
            color={variant === "outline" || variant === "ghost" ? "#111827" : "#ffffff"}
          />
        ) : (
          leftIcon
        )}
        {typeof content === "string" || typeof content === "number" ? (
          <Text className={`text-center font-semibold ${labelClasses[variant]}`}>{content}</Text>
        ) : (
          content
        )}
        {!loading ? rightIcon : null}
      </View>
    </Pressable>
  );
}
