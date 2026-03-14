import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("muscles").withIndex("by_sortOrder").collect();
  },
});
