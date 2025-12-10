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
    uid: v.string(),
    crop: v.string(),
    growth_stage: v.optional(v.string()),
    problem: v.optional(v.string()),
    location: v.optional(v.string()),

    recommendations: v.object({
      irrigation: v.optional(v.string()),
      fertilizer: v.optional(v.string()),
      pesticide: v.optional(v.string()),
      additionalAdvice: v.optional(v.string()),
    }),

    createdAt: v.optional(v.string()),

    // store full AI output
    raw: v.optional(v.object({})),
  }),
});
