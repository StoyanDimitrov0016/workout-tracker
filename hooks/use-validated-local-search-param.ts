import { useLocalSearchParams } from "expo-router";
import { z } from "zod";

import type { Id, TableNames } from "@/convex/_generated/dataModel";

const ConvexIdStringSchema = z.string().trim().min(1).max(64);

export function ConvexIdParamSchema<TableName extends TableNames>() {
  return ConvexIdStringSchema.transform((value) => value as Id<TableName>);
}

export const WeekdayParamSchema = z.coerce.number().int().min(1).max(7);

export function useValidatedLocalSearchParam<Output>(name: string, schema: z.ZodType<Output>) {
  const params = useLocalSearchParams() as Record<string, string | string[] | undefined>;
  const rawValue = params[name];
  const candidate = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  const result = schema.safeParse(candidate);

  return result.success ? result.data : null;
}
