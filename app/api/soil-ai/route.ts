import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", pa: "Punjabi", bn: "Bengali",
  te: "Telugu",  mr: "Marathi", gu: "Gujarati", kn: "Kannada",
  ml: "Malayalam", ta: "Tamil", or: "Odia",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nitrogen,
      phosphorus,
      potassium,
      ph,
      temperature,
      humidity,
      rainfall,
      language = "en"
    } = body;

    const langName = LANG_NAMES[language] ?? "English";

    const prompt = `You are an expert agronomist advising Indian farmers.

Soil data provided:
- Nitrogen (N): ${nitrogen ?? "unknown"} kg/ha
- Phosphorus (P): ${phosphorus ?? "unknown"} kg/ha
- Potassium (K): ${potassium ?? "unknown"} kg/ha
- pH: ${ph ?? "unknown"}
- Temperature: ${temperature ?? "unknown"} °C
- Humidity: ${humidity ?? "unknown"} %
- Rainfall: ${rainfall ?? "unknown"} mm

Respond ONLY with a valid JSON object — no markdown, no preamble, no extra text.

The JSON must have exactly this structure:
{
  "crop": "Best crop to grow (translated into ${langName})",
  "confidence": <number 0-100>,
  "health": "One-word soil health rating in ${langName}",
  "tips": [
    "Tip 1 in ${langName}",
    "Tip 2 in ${langName}",
    "Tip 3 in ${langName}"
  ]
}

Rules:
- Translate ALL text values into ${langName}.
- Keep tips practical and short.
- confidence must be a number only.
- No markdown or extra text.`;

    // OpenRouter API call
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", 
        messages: [
          { role: "system", content: "You are an agriculture expert." },
          { role: "user", content: prompt }
        ],
        max_tokens: 400, 
        temperature: 0.6
      }),
    });

    const data = await response.json();

    const rawText = data.choices?.[0]?.message?.content || "";

    const clean = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(clean);

      return NextResponse.json({
        crop: parsed.crop ?? "—",
        confidence: Number(parsed.confidence) || 0,
        health: parsed.health ?? "—",
        tips: Array.isArray(parsed.tips) ? parsed.tips : [],
      });

    } catch {
     
      return NextResponse.json({
        raw: rawText,
        crop: "—",
        confidence: 0,
        health: "—",
        tips: []
      });
    }

  } catch (err) {
    console.error("Soil AI error:", err);

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const response = await fetch("http://127.0.0.1:8000/predict", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { raw: "Backend error" },
//       { status: 500 }
//     );
//   }
// }