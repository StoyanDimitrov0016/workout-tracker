export function formatRoundedDecimal(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
}

export function formatInteger(value: number) {
  return Math.round(value).toLocaleString();
}
