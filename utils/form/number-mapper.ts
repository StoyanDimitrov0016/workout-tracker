export const NumberMapper = {
  normalizeDecimalSeparator(value: string) {
    return value.trim().replace(/,/g, ".");
  },

  toNumber(value: string) {
    const normalized = NumberMapper.normalizeDecimalSeparator(value);
    return normalized === "" ? Number.NaN : Number(normalized);
  },
};
