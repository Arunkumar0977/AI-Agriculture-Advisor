// import { NextRequest, NextResponse } from "next/server";

// const LANG_NAMES: Record<string, string> = {
//   en: "English",
//   hi: "Hindi",
//   pa: "Punjabi",
//   mr: "Marathi",
//   te: "Telugu",
//   ta: "Tamil",
//   kn: "Kannada",
//   gu: "Gujarati",
//   bn: "Bengali",
//   ur: "Urdu",
// };

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { location, crop, lang = "en" } = body;

//     if (!location || !crop) {
//       return NextResponse.json(
//         { error: "location and crop are required" },
//         { status: 400 }
//       );
//     }

//     const languageName = LANG_NAMES[lang] ?? "English";

//     const mandiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=5&filters[district]=${location}&filters[commodity]=${crop}`;

//     const mandiRes = await fetch(mandiUrl, {
//       cache: "no-store", 
//     });

//     if (!mandiRes.ok) {
//       console.error("Mandi API error:", await mandiRes.text());
//       return NextResponse.json(
//         { error: "Failed to fetch mandi data" },
//         { status: 502 }
//       );
//     }

//     const mandiData = await mandiRes.json();

//     if (!mandiData.records || mandiData.records.length === 0) {
//       return NextResponse.json(
//         { error: "No mandi data found" },
//         { status: 404 }
//       );
//     }
//     const records = mandiData.records.sort(
//       (a: any, b: any) =>
//         new Date(b.arrival_date).getTime() -
//         new Date(a.arrival_date).getTime()
//     );

//     const record = records[0];

//     const avgPrice =
//       (Number(record.min_price) + Number(record.max_price)) / 2;

//     const prompt = `
// You are an agriculture expert.

// Use this REAL mandi data:
// Crop: ${record.commodity}
// Location: ${record.district}
// Mandi: ${record.market}
// Min Price: ${record.min_price}
// Max Price: ${record.max_price}
// Avg Price: ${avgPrice}

// Rules:
// - DO NOT change price
// - Only give analysis

// Respond in ${languageName}

// Return JSON:
// {
//   "trend": "",
//   "trendEmoji": "",
//   "advice": "",
//   "bestTime": "",
//   "summary": "",
//   "nearbyMandis": ["", "", ""]
// }
// `;

//     let aiResult: unknown = {}; // replaced with unknown for better type safety from any

//     try {
//       const aiRes = await fetch(
//         "https://openrouter.ai/api/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           },
//           body: JSON.stringify({
//             model: "openai/gpt-3.5-turbo",
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.3,
//           }),
//         }
//       );

//       if (aiRes.ok) {
//         const aiData = await aiRes.json();
//         const rawText = aiData?.choices?.[0]?.message?.content ?? "{}";

//         try {
//           aiResult = JSON.parse(rawText);
//         } catch {
//           const match = rawText.match(/\{[\s\S]*\}/);
//           if (match) aiResult = JSON.parse(match[0]);
//         }
//       }
//     } catch (e) {
//       console.error("AI error:", e);
//     }

//     if (!Array.isArray(aiResult.nearbyMandis)) {
//       aiResult.nearbyMandis = [];
//     }

//     //  FINAL RESPONSE
//     return NextResponse.json({
//       cropName: record.commodity,
//       location: record.district,
//       mandi: record.market,
//       minPrice: record.min_price,
//       maxPrice: record.max_price,
//       avgPrice: avgPrice.toFixed(0),
//       modalPrice: record.modal_price,
//       unit: "quintal",
//       date: record.arrival_date,
//       ...aiResult,
//     });
//   } catch (error) {
//     console.error("Route error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";

// Language map
const LANG_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  pa: "Punjabi",
  mr: "Marathi",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
  gu: "Gujarati",
  bn: "Bengali",
  ur: "Urdu",
};

// ✅ Mandi record type
type MandiRecord = {
  commodity: string;
  district: string;
  market: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  arrival_date: string;
};

// ✅ Mandi API response
type MandiResponse = {
  records: MandiRecord[];
};

// ✅ AI response type
type AIResult = {
  trend?: string;
  trendEmoji?: string;
  advice?: string;
  bestTime?: string;
  summary?: string;
  nearbyMandis?: string[];
};

// ✅ OpenRouter response type (NO any)
type OpenRouterResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

export async function POST(req: NextRequest) {
  try {
    const body: { location?: string; crop?: string; lang?: string } =
      await req.json();

    const { location, crop, lang = "en" } = body;

    if (!location || !crop) {
      return NextResponse.json(
        { error: "location and crop are required" },
        { status: 400 }
      );
    }

    const languageName = LANG_NAMES[lang] ?? "English";

    const mandiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=5&filters[district]=${location}&filters[commodity]=${crop}`;

    const mandiRes = await fetch(mandiUrl, {
      cache: "no-store",
    });

    if (!mandiRes.ok) {
      console.error("Mandi API error:", await mandiRes.text());
      return NextResponse.json(
        { error: "Failed to fetch mandi data" },
        { status: 502 }
      );
    }

    const mandiData: MandiResponse = await mandiRes.json();

    if (!mandiData.records || mandiData.records.length === 0) {
      return NextResponse.json(
        { error: "No mandi data found" },
        { status: 404 }
      );
    }

    // ✅ Sorted latest record
    const records = mandiData.records.sort((a, b) => {
      const dateA = new Date(a.arrival_date).getTime();
      const dateB = new Date(b.arrival_date).getTime();
      return dateB - dateA;
    });

    const record = records[0];

    const avgPrice =
      (Number(record.min_price) + Number(record.max_price)) / 2;

    const prompt = `
You are an agriculture expert.

Use this REAL mandi data:
Crop: ${record.commodity}
Location: ${record.district}
Mandi: ${record.market}
Min Price: ${record.min_price}
Max Price: ${record.max_price}
Avg Price: ${avgPrice}

Rules:
- DO NOT change price
- Only give analysis

Respond in ${languageName}

Return JSON:
{
  "trend": "",
  "trendEmoji": "",
  "advice": "",
  "bestTime": "",
  "summary": "",
  "nearbyMandis": ["", "", ""]
}
`;

    let aiResult: AIResult = {};

    try {
      const aiRes = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
          }),
        }
      );

      if (aiRes.ok) {
        const aiData: OpenRouterResponse = await aiRes.json();

        const rawText =
          aiData.choices?.[0]?.message?.content ?? "{}";

        try {
          aiResult = JSON.parse(rawText) as AIResult;
        } catch {
          const match = rawText.match(/\{[\s\S]*\}/);
          if (match) {
            aiResult = JSON.parse(match[0]) as AIResult;
          }
        }
      }
    } catch (e) {
      console.error("AI error:", e);
    }

    if (!Array.isArray(aiResult.nearbyMandis)) {
      aiResult.nearbyMandis = [];
    }

    return NextResponse.json({
      cropName: record.commodity,
      location: record.district,
      mandi: record.market,
      minPrice: record.min_price,
      maxPrice: record.max_price,
      avgPrice: avgPrice.toFixed(0),
      modalPrice: record.modal_price,
      unit: "quintal",
      date: record.arrival_date,
      ...aiResult,
    });
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}