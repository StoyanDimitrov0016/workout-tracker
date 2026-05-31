import { useEffect, useState } from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { NumberMapper } from "@/utils/form/number-mapper";

type NumberInputProps = Omit<InputProps, "keyboardType" | "onChangeText" | "value"> & {
  value: number | null | undefined;
  onChangeNumber: (value: number | null) => void;
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
  formatValue = defaultFormatValue,
  onBlur,
  ...props
}: NumberInputProps) {
  const [draftValue, setDraftValue] = useState(() => formatDraftValue(value, formatValue));

  useEffect(() => {
    setDraftValue(formatDraftValue(value, formatValue));
  }, [formatValue, value]);

  return (
    <Input
      {...props}
      value={draftValue}
      keyboardType="decimal-pad"
      onChangeText={(text) => {
        setDraftValue(text);
        const nextValue = NumberMapper.toNumber(text);
        onChangeNumber(Number.isNaN(nextValue) ? null : nextValue);
      }}
      onBlur={(event) => {
        const nextValue = NumberMapper.toNumber(draftValue);
        setDraftValue(formatDraftValue(Number.isNaN(nextValue) ? null : nextValue, formatValue));
        onBlur?.(event);
      }}
    />
  );
}
