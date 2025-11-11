import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateAgriAdvice = mutation({
  args: {
    crop: v.string(),
    queryText: v.string(),
    advisorResponse: v.optional(v.string()),
    uid: v.id("UserTable"),
    createdAt: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("AgriAdvisorTable", {
      crop: args.crop,
      query: args.queryText,
      advisorResponse: args.advisorResponse,
      uid: args.uid,
      createdAt: args.createdAt
    });
  },
});

export const GetUserAgriQueries = query({
  args: {
    uid: v.id("UserTable")
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("AgriAdvisorTable")
      .filter(q => q.eq(q.field("uid"), args.uid))
      .order("desc")
      .collect();

    return result;
  }
});

export const GetAgriQueryById = query({
  args: {
    uid: v.id("UserTable"),
    queryId: v.id("AgriAdvisorTable")
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("AgriAdvisorTable")
      .filter(q =>
        q.and(
          q.eq(q.field("uid"), args.uid),
          q.eq(q.field("_id"), args.queryId)
        )
      )
      .collect();

    return result[0];
  }
});
