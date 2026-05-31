export type NumberParseMode = "integer" | "decimal";

const numberPatterns = {
  integer: /^[-+]?\d+$/,
  decimal: /^[-+]?(?:\d+\.?\d*|\.\d+)$/,
} as const satisfies Record<NumberParseMode, RegExp>;

export const NumberMapper = {
  normalizeDecimalSeparator(value: string) {
    return value.trim().replace(/,/g, ".");
  },

  toNumber(value: string) {
    const normalized = NumberMapper.normalizeDecimalSeparator(value);
    return normalized === "" ? Number.NaN : Number(normalized);
  },

  parseInput(value: string, mode: NumberParseMode = "decimal"): number | null {
    const normalized = NumberMapper.normalizeDecimalSeparator(value);

    if (normalized === "") {
      return null;
    }

    if (!numberPatterns[mode].test(normalized)) {
      return null;
    }

    return Number(normalized);
  },
};
