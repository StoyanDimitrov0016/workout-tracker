import { v } from "convex/values";

import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("exercises").collect();
  },
});

export const searchByName = query({
  args: {
    text: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const queryText = args.text.trim();
    if (!queryText) return [];

    return await ctx.db
      .query("exercises")
      .withSearchIndex("search_name", (s) => s.search("name", queryText))
      .take(args.limit ?? 20);
  },
});
