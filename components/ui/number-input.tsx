import { useState } from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { NumberMapper, type NumberParseMode } from "@/utils/form/number-mapper";

type NumberInputProps = Omit<InputProps, "keyboardType" | "onChangeText" | "value"> & {
  value: number | null | undefined;
  onChangeNumber: (value: number | null) => void;
  mode?: NumberParseMode;
  formatValue?: (value: number) => string;
};

function defaultFormatValue(value: number) {
  return String(value);
}

function formatDraftValue(value: number | null | undefined, formatValue: (value: number) => string) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "";
  }

  return formatValue(value);
}

export function NumberInput({
  value,
  onChangeNumber,
  mode = "decimal",
  formatValue = defaultFormatValue,
  onFocus,
  onBlur,
  ...props
}: NumberInputProps) {
  const [draftValue, setDraftValue] = useState(() => formatDraftValue(value, formatValue));
  const [isFocused, setIsFocused] = useState(false);
  const displayValue = isFocused ? draftValue : formatDraftValue(value, formatValue);

  return (
    <Input
      {...props}
      value={displayValue}
      keyboardType={mode === "integer" ? "number-pad" : "decimal-pad"}
      onChangeText={(text) => {
        setDraftValue(text);
        onChangeNumber(NumberMapper.parseInput(text, mode));
      }}
      onFocus={(event) => {
        setDraftValue(formatDraftValue(value, formatValue));
        setIsFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);

        const nextValue = NumberMapper.parseInput(draftValue, mode);
        onChangeNumber(nextValue);
        setDraftValue(formatDraftValue(nextValue, formatValue));
        onBlur?.(event);
      }}
    />
  );
}
