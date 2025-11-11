import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// ✅ Initialize OpenRouter API (you can replace baseURL if you use OpenAI directly)
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// 🧠 Step 1: Initial Prompt (AI asks step-by-step agriculture questions)
const PROMPT = `
You are an AI Agriculture Advisor helping farmers improve their crop yield and solve agricultural problems.
Ask one question at a time in this order:

1. Crop or plant type (e.g., wheat, rice, tomato, maize, cotton)
2. Growth stage (e.g., seedling, vegetative, flowering, harvesting)
3. Problem or issue (e.g., pest, disease, irrigation issue, nutrient deficiency)
4. Location or region (for climate context)
5. Any specific goal (e.g., increase yield, pest control, irrigation optimization)

Rules:
- Ask only ONE question at a time.
- Use simple, farmer-friendly language.
- If unclear, politely ask for clarification.
- When all information is gathered, switch to the "final" stage and generate a complete advisory plan.

Return only a JSON object with this structure:
{
  "resp": "Your question or reply",
  "ui": "cropType/growthStage/problem/location/final"
}
`;

// 🌾 Step 2: Final Prompt (AI gives complete crop advisory)
const FINAL_PROMPT = `
You are an AI Agriculture Expert. 
Given the following collected details, generate a complete agricultural advisory plan including:

- Crop name and growth stage
- Identified problem (if any)
- Location-specific advice
- Fertilizer recommendations (name, quantity, application method)
- Pest/disease control measures
- Irrigation schedule
- Weather recommendations
- Tips for better yield

Return ONLY in this strict JSON structure:
{
  "advisory": {
    "crop": "string",
    "growth_stage": "string",
    "problem": "string",
    "location": "string",
    "recommendations": {
      "fertilizers": [
        { "name": "string", "quantity": "string", "application_method": "string" }
      ],
      "pest_control": [
        { "pest_name": "string", "treatment": "string", "precautions": "string" }
      ],
      "irrigation_schedule": "string",
      "weather_advice": "string",
      "yield_tips": "string"
    }
  }
}
`;

// 🚀 Step 3: Main API Handler
export async function POST(req: NextRequest) {
  try {
    const { messages, isFinal } = await req.json();

    // 🧠 Choose which prompt to use
    const systemPrompt = isFinal ? FINAL_PROMPT : PROMPT;

    // 🔥 Call OpenRouter/OpenAI
    const completion = await openai.chat.completions.create({
      model: "tngtech/deepseek-r1t2-chimera:free", // ✅ reliable open model
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const messageContent = completion.choices[0]?.message?.content ?? "{}";
    let jsonResponse;

    try {
      jsonResponse = JSON.parse(messageContent);
    } catch {
      jsonResponse = { resp: "Sorry, I couldn’t interpret the response properly." };
    }

    return NextResponse.json(jsonResponse);
  } catch (e: any) {
    console.error("❌ Error generating agriculture advisory:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate advisory" },
      { status: 500 }
    );
  }
}
