import { formatRoundedDecimal } from "@/utils/format/number";

export function formatMeasurementValue(value: number) {
  return formatRoundedDecimal(value);
}
