

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable:defineTable({
    name:v.string(),
    imageUrl: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
  }),

  
    AgriAdvisorTable: defineTable({
    uid: v.string(),
    crop: v.string(),
    growth_stage: v.string(),
    problem: v.string(),
    location: v.string(),
    price: v.string(),
    date: v.string(),
    unit: v.string(),

    // Optional legacy fields
    soilType: v.optional(v.string()),
    temperature: v.optional(v.string()),
    humidity: v.optional(v.string()),
    irrigation: v.optional(v.string()),
    fertilizer: v.optional(v.string()),
    pesticide: v.optional(v.string()),
    additionalAdvice: v.optional(v.string()),

    // Structured recommendations
    recommendations: v.object({
      fertilizers: v.array(
        v.object({
          name: v.string(),
          quantity: v.string(),
          application_method: v.string(),
        })
      ),
      pest_control: v.array(
        v.object({
          pest_name: v.string(),
          treatment: v.string(),
          precautions: v.string(),
        })
      ),
      irrigation_schedule: v.string(),
      weather_advice: v.string(),
      yield_tips: v.string(),
    }),

    createdAt: v.optional(v.string()),
  }),

  crops: defineTable({
    name: v.string(),
    season: v.string(),
    createdAt: v.number(),
  }),

});