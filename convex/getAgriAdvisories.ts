// import { query } from "./_generated/server";

// export const getAgriAdvisories = query({
//   handler: async (ctx) => {
//     const advisories = await ctx.db.query("AgriAdvisorTable").collect();
//     return advisories;
//   },
// });
// export default getAgriAdvisories;


import { query } from "./_generated/server";

export const getAgriAdvisories = query({
  handler: async (ctx) => {
    // Fetch all stored advisories
    const advisories = await ctx.db.query("AgriAdvisorTable").collect();

    // Sort newest first (createdAt ISO string supports chronological sorting)
    const sorted = advisories.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sorted;
  },
});

export default getAgriAdvisories;
