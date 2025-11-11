import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
  }),

  AgriAdvisorTable: defineTable({
    uid: v.id("UserTable"),               // which user asked for advice
    crop: v.string(),                     // crop name (e.g., wheat, paddy)
    query: v.string(),                    // user’s question or problem
    advisorResponse: v.optional(v.string()), // AI or expert response
    createdAt: v.number(),                // timestamp
  })
});
