// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// export const CreateAgriAdvice = mutation({
//   args: {
//     crop: v.string(),
//     queryText: v.string(),
//     advisorResponse: v.optional(v.string()),
//     uid: v.id("UserTable"),
//     createdAt: v.number()
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.insert("AgriAdvisorTable", {
//       crop: args.crop,
//       query: args.queryText,
//       advisorResponse: args.advisorResponse,
//       uid: args.uid,
//       createdAt: args.createdAt
//     });
//   },
// });

// export const GetUserAgriQueries = query({
//   args: {
//     uid: v.id("UserTable")
//   },
//   handler: async (ctx, args) => {
//     const result = await ctx.db
//       .query("AgriAdvisorTable")
//       .filter(q => q.eq(q.field("uid"), args.uid))
//       .order("desc")
//       .collect();

//     return result;
//   }
// });

// export const GetAgriQueryById = query({
//   args: {
//     uid: v.id("UserTable"),
//     queryId: v.id("AgriAdvisorTable")
//   },
//   handler: async (ctx, args) => {
//     const result = await ctx.db
//       .query("AgriAdvisorTable")
//       .filter(q =>
//         q.and(
//           q.eq(q.field("uid"), args.uid),
//           q.eq(q.field("_id"), args.queryId)
//         )
//       )
//       .collect();

//     return result[0];
//   }
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Fixed to match AgriAdvisorTable schema exactly
export const CreateAgriAdvice = mutation({
  args: {
    uid: v.string(),
    crop: v.string(),
    growth_stage: v.string(),
    problem: v.string(),
    location: v.string(),
    price: v.string(),
    date: v.string(),
    unit: v.string(),

    soilType: v.optional(v.string()),
    temperature: v.optional(v.string()),
    humidity: v.optional(v.string()),
    irrigation: v.optional(v.string()),
    fertilizer: v.optional(v.string()),
    pesticide: v.optional(v.string()),
    additionalAdvice: v.optional(v.string()),

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

export const GetUserAgriQueries = query({
  args: {
    uid: v.string() // ✅ Fixed: schema uses v.string() not v.id("UserTable")
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
    uid: v.string(), // ✅ Fixed: schema uses v.string() not v.id("UserTable")
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