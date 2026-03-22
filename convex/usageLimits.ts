import type { MutationCtx, QueryCtx } from "./_generated/server";

export const MAX_WEIGHT_ENTRIES_PER_DAY = 10;
export const MAX_CIRCUMFERENCE_ENTRIES_PER_DAY = 5;
export const MAX_SPLIT_EXERCISES_PER_DAY = 20;
export const MAX_SET_TARGETS_PER_EXERCISE = 10;
export const MAX_SESSION_SETS_PER_EXERCISE = 15;
export const MAX_WEIGHT_QUERY_LIMIT = 30;
export const MAX_CIRCUMFERENCE_QUERY_LIMIT = 20;
export const MAX_WORKOUT_HISTORY_LIMIT = 50;
export const MAX_WEIGHT_AVERAGE_DAYS = 30;
export const MAX_STATISTICS_OVERVIEW_SESSIONS = 120;

type UserScopedCtx = MutationCtx | QueryCtx;
type UserScopedTable = "weights" | "circumferences";

export function getStartOfTodayTimestamp(now = Date.now()) {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function assertPositiveLimit(limit: number, max: number, label: string) {
  if (!Number.isInteger(limit) || limit < 1 || limit > max) {
    throw new Error(`${label} must be an integer between 1 and ${max}.`);
  }
}

export async function assertDailyUserWriteLimit(
  ctx: UserScopedCtx,
  tableName: UserScopedTable,
  userToken: string,
  maxPerDay: number,
  entityLabel: string
) {
  const startOfToday = getStartOfTodayTimestamp();
  const recentEntries = await ctx.db
    .query(tableName)
    .withIndex("by_user", (q) => q.eq("userToken", userToken))
    .filter((q) => q.gte(q.field("_creationTime"), startOfToday))
    .take(maxPerDay);

  if (recentEntries.length >= maxPerDay) {
    throw new Error(`Daily ${entityLabel} limit reached.`);
  }
}
