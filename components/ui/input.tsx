import { Text, TextInput, type TextInputProps, View } from "react-native";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
};

export function Input({
  label,
  error,
  helperText,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  placeholderTextColor = "#9ca3af",
  ...props
}: InputProps) {
  return (
    <View className={["gap-2", containerClassName ?? ""].filter(Boolean).join(" ")}>
      {label ? (
        <Text className={["text-xs text-text-secondary", labelClassName ?? ""].join(" ")}>
          {label}
        </Text>
      ) : null}
      <TextInput
        {...props}
        placeholderTextColor={placeholderTextColor}
        className={[
          "rounded-xl border border-border px-3 py-3 text-text-primary",
          error ? "border-status-error" : "",
          inputClassName ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {error ? (
        <Text className={["text-xs text-status-error", errorClassName ?? ""].join(" ")}>
          {error}
        </Text>
      ) : helperText ? (
        <Text className="text-xs text-text-tertiary">{helperText}</Text>
      ) : null}
    </View>
  );
}
