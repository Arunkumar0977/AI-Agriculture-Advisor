import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveCrop = mutation({
  args: {
    data: v.object({
      name: v.string(),
      season: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("crops", {
      ...args.data,
      createdAt: Date.now(),
    });
  },
});