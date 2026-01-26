export function parseMeasurementInput(raw: string) {
  const normalized = raw.replace(",", ".").trim();
  const value = Number.parseFloat(normalized);
  return { normalized, value };
}
