import { NextRequest, NextResponse } from "next/server";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL  = "openai/gpt-3.5-turbo"; 

export async function POST(req: NextRequest) {
  const {
    soil,
    season,
    temperature,
    rainfall,
    location,
    language,
    langLabel,
  }: {
    soil:        string;
    season:      string;
    temperature: string;
    rainfall:    string;
    location:    string;
    language:    string;
    langLabel:   string;
  } = await req.json();

  const systemPrompt = `You are an expert agricultural advisor in India.
Given the farmer's inputs, recommend the most suitable crops.
Always respond ONLY in raw JSON — no markdown, no code fences — with exactly two fields:
- "english": recommendation in clear, simple English
- "regional": the same recommendation translated into ${langLabel} (language code: ${language})
If language is "en", set "regional" to an empty string.
Keep advice practical, brief, and jargon-free — these are rural farmers.`;

  const userPrompt = `Soil type: ${soil || "not specified"}
Season: ${season || "not specified"}
Temperature: ${temperature || "not specified"}°C
Rainfall: ${rainfall || "not specified"} mm
Location: ${location || "not specified"}

Recommend 2-3 suitable crops with brief growing tips.`;

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model  = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    return NextResponse.json(
      { english: "Server misconfiguration: OPENROUTER_API_KEY is not set.", regional: "" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
        
        "HTTP-Referer":  process.env.NEXT_PUBLIC_SITE_URL  ?? "http://localhost:3000",
        "X-Title":       process.env.NEXT_PUBLIC_SITE_NAME ?? "Smart Crop Advisor",
      },
      body: JSON.stringify({
        model,
        max_tokens:  500,
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt   },
        ],
       
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("OpenRouter error response:", errBody);
      return NextResponse.json(
        { english: "AI service error. Please try again.", regional: "" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // OpenRouter follows the OpenAI response shape:
    // data.choices[0].message.content
    const raw     = (data?.choices?.[0]?.message?.content as string) ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed  = JSON.parse(cleaned) as { english?: string; regional?: string };

    return NextResponse.json({
      english:  parsed.english  ?? "Could not generate recommendation.",
      regional: parsed.regional ?? "",
    });
  } catch (err) {
    console.error("Crop recommend error:", err);
    return NextResponse.json(
      { english: "Error generating recommendation. Please try again.", regional: "" },
      { status: 500 }
    );
  }
}