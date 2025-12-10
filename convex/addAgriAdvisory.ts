// // import { mutation } from "./_generated/server";
// // import { v } from "convex/values";

// // export const addAgriAdvisory = mutation({
// //   args: {
// //     uid: v.string(),
// //     crop: v.string(),
// //     growthStage: v.string(),
// //     problem: v.string(),
// //     location: v.string(),
// //     irrigation: v.string(),
// //     fertilizer: v.string(),
// //     pesticide: v.string(),
// //     additionalAdvice: v.string(),
// //     createdAt: v.string(),
// //   },
// //   handler: async (ctx, args) => {
// //     await ctx.db.insert("AgriAdvisorTable", args);
// //   },
// // });


import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const addAgriAdvisory = mutation({
  args: {
    uid: v.string(),
    crop: v.string(),
    growth_stage: v.string(),
    problem: v.string(),
    location: v.string(),
    price: v.string(),
    date: v.string(),
    unit: v.string(),

    // Optional old fields
    soilType: v.optional(v.string()),
    temperature: v.optional(v.string()),
    humidity: v.optional(v.string()),
    irrigation: v.optional(v.string()),
    fertilizer: v.optional(v.string()),
    pesticide: v.optional(v.string()),
    additionalAdvice: v.optional(v.string()),

    // ⭐ NEW STRUCTURED RECOMMENDATIONS
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
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("AgriAdvisorTable", {
      ...args,
      createdAt: args.createdAt || new Date().toISOString(),
    });
  },
});
