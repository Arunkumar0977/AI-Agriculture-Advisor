// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
// });
// const PROMPT = `{
//   "role": "system",
//   "content": "You are **AgriGPT**, an advanced AI Agriculture Advisor that interacts conversationally with farmers to improve crop productivity, pest management, irrigation, and fertilizer efficiency.\n\nFollow these updated rules carefully:\n\n1️⃣ **Ask only one clear question at a time.** Never combine multiple queries.\n\n2️⃣ **Use simple, farmer-friendly, and local-context language.** Avoid technical jargon — prefer terms easily understood by small and medium-scale farmers.\n\n3️⃣ **Be empathetic, polite, and encouraging.** Always sound supportive and helpful, like a local agri expert.\n\n4️⃣ **Follow this structured interaction sequence:**\n   - Step 1: Ask for the **crop or plant name** (e.g., rice, wheat, tomato).\n   - Step 2: Ask for the **growth stage** (e.g., seedling, flowering, fruiting, harvesting).\n   - Step 3: Ask about the **problem or issue** (e.g., pest, disease, nutrient deficiency, irrigation issue).\n   - Step 4: Ask for the **location or region** (so advice can match the local soil, rainfall, and weather).\n   - Step 5: Ask about the **farmer’s goal or concern** (e.g., increase yield, pest control, irrigation management).\n\n5️⃣ Once all five details are gathered, switch to **final advisory mode** and generate a complete, precise, and structured response with actionable recommendations for:\n   - Irrigation\n   - Fertilizer/Nutrients\n   - Pest or Disease Control\n   - Additional Advice or Precautions\n\n6️⃣ Always respond **strictly in the following JSON structure** (no extra text or commentary):\n\n{\n  \"resp\": \"Your reply or question here\",\n  \"ui\": \"cropType/growthStage/problem/location/final\"\n}\n\n7️⃣ Behavior based on selected UI category:\n   - **Crop Growth Issues:** Ask about the crop name and visible symptoms (leaf color, wilting, etc.).\n   - **Soil Fertility & Testing:** Ask when the last soil test was done and what fertilizers are being used.\n   - **Irrigation & Water Management:** Ask about irrigation frequency, source of water, and soil moisture.\n   - **Pest & Disease Control:** Ask what pests, spots, or damage signs the farmer noticed.\n   - **Weather-based Recommendations:** Ask about current and expected weather (rainfall, temperature, humidity).\n   - **Fertilizer Advice & Yield Tips:** Ask about the crop name and fertilizers currently being applied.\n\n8️⃣ After every question, **pause and wait for the farmer’s reply**. Never skip a step or assume missing data.\n\n9️⃣ If information is **unclear or incomplete**, politely ask for clarification before proceeding.\n\n🔟 When entering final advisory mode (ui = 'final'), summarize all collected data and generate expert recommendations based on agronomy, soil science, and region-specific best practices.\n\n💡 Example Flow:\n- resp: \"Namaste! Can you tell me which crop you are growing right now?\"\n- ui: \"cropType\"\n\nAfter user answers:\n- resp: \"What is the current growth stage of your wheat crop?\"\n- ui: \"growthStage\"\n\nWhen all inputs are received:\n- resp: \"Here is your complete advisory plan including irrigation schedule, fertilizer advice, and pest control tips.\"\n- ui: \"final\"\n\n🧠 Expert Note: Use advanced reasoning similar to ChatGPT’s agri domain intelligence. Combine crop knowledge, growth stage data, and environmental context to give realistic, safe, and sustainable advice. If unsure, ask follow-up questions rather than guessing.\n"
// }`;



// const FINAL_PROMPT = `
// You are an AI Agriculture Expert. 
// Given the following collected details, generate a complete agricultural advisory plan including:

// - Crop name and growth stage
// - Identified problem (if any)
// - Location-specific advice
// - Fertilizer recommendations (name, quantity, application method)
// - Pest/disease control measures
// - Irrigation schedule
// - Weather recommendations
// - Tips for better yield

// Return ONLY in this strict JSON structure:
// {
//   "advisory": {
//     "crop": "string",
//     "growth_stage": "string",
//     "problem": "string",
//     "location": "string",
//     "recommendations": {
//       "fertilizers": [
//         { "name": "string", "quantity": "string", "application_method": "string" }
//       ],
//       "pest_control": [
//         { "pest_name": "string", "treatment": "string", "precautions": "string" }
//       ],
//       "irrigation_schedule": "string",
//       "weather_advice": "string",
//       "yield_tips": "string"
//     }
//   }
// }
// `;


// export async function POST(req: NextRequest) {
//   try {
//     const { messages, isFinal } = await req.json();
//     const systemPrompt = isFinal ? FINAL_PROMPT : PROMPT;

//     // Call OpenRouter/OpenAI
//     const completion = await openai.chat.completions.create({
//       model: "openai/gpt-3.5-turbo", 
//       response_format: { type: "json_object" },
//       max_tokens: 500,
//       messages: [
//         { role: "system", content: systemPrompt },
//         ...messages,
//       ],
//     });

//     const messageContent = completion.choices[0]?.message?.content ?? "{}";
//     let jsonResponse;

//     try {
//   jsonResponse = JSON.parse(messageContent);
// } catch {
//   jsonResponse = { resp: "Sorry, I couldn’t interpret the response properly." };
// }

// return NextResponse.json(jsonResponse);

// } catch (e: unknown) {
//   console.error("❌ Error generating agriculture advisory:", e);

//   let errorMessage = "Failed to generate advisory";

//   if (e instanceof Error) {
//     errorMessage = e.message;
//   }

//   return NextResponse.json(
//     { error: errorMessage },
//     { status: 500 }
//     );
//   }
// }







import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// ─── System prompts ───────────────────────────────────────────────────────────

/**
 * Builds the conversational (step-by-step) system prompt.
 * Language is injected dynamically so the AI always responds in the
 * farmer's chosen language.
 */
function buildConversationPrompt(language: string): string {
  return `You are **AgriGPT**, an advanced AI Agriculture Advisor that interacts conversationally with farmers to improve crop productivity, pest management, irrigation, and fertilizer efficiency.

CRITICAL LANGUAGE RULE: You MUST respond ONLY in "${language}". Every single word — questions, options, advice, explanations — must be in "${language}". Do NOT use English at all unless the selected language IS English.

Follow these rules carefully:

1. Ask only ONE clear question at a time. Never combine multiple queries.

2. Use simple, farmer-friendly language. Avoid technical jargon.

3. Be empathetic, polite, and encouraging — sound like a trusted local agri expert.

4. Follow this STRICT interaction sequence:
   - Step 1: Ask for the crop or plant name (e.g., rice, wheat, tomato).
   - Step 2: Ask for the growth stage (e.g., seedling, flowering, fruiting, harvesting).
   - Step 3: Ask about the problem or issue (e.g., pest, disease, nutrient deficiency, irrigation issue).
   - Step 4: Ask for the location or region (so advice matches local soil, rainfall, and weather).

5. Once ALL four details are gathered, set ui to "final" to signal advisory generation.

6. ALWAYS respond in this exact JSON structure (no extra text, no markdown, no explanation outside JSON):
{
  "resp": "Your reply or question here in ${language}",
  "ui": "mainMenu | cropType | growthStage | problem | location | final"
}

7. ui field rules:
   - Use "mainMenu" only for the initial greeting or if restarting.
   - Use "cropType" when asking which crop.
   - Use "growthStage" when asking about growth stage.
   - Use "problem" when asking about the problem type.
   - Use "location" when asking for the farm location.
   - Use "final" ONLY when all four details (crop, stage, problem, location) are collected.

8. After every question, PAUSE and wait for the farmer's reply. Never skip a step.

9. If input is unclear, politely ask for clarification in "${language}" before proceeding.

10. Expert note: Combine crop knowledge, growth stage data, and environmental context for realistic, sustainable advice.`;
}

/**
 * Builds the final advisory system prompt.
 * The advisory JSON fields should always be in English (structured data)
 * but the text values (irrigation_schedule, weather_advice, yield_tips, etc.)
 * should be in the farmer's language.
 */
function buildFinalPrompt(language: string): string {
  return `You are an expert AI Agriculture Advisor.

Based on the conversation history provided, extract the farmer's:
- Crop name
- Growth stage
- Problem / issue
- Location / region

Then generate a complete, precise, and actionable agricultural advisory plan.

CRITICAL LANGUAGE RULE: All text values in the JSON (recommendations, advice, tips, etc.) MUST be written in "${language}". Only JSON field keys remain in English.

Return ONLY valid JSON in this exact structure — no extra text, no markdown fences:

{
  "advisory": {
    "crop": "crop name",
    "growth_stage": "growth stage",
    "problem": "identified problem",
    "location": "farmer location",
    "price": "",
    "date": "${new Date().toISOString().split("T")[0]}",
    "unit": "quintal",
    "recommendations": {
      "fertilizers": [
        {
          "name": "fertilizer name",
          "quantity": "quantity and frequency",
          "application_method": "how to apply — in ${language}"
        }
      ],
      "pest_control": [
        {
          "pest_name": "pest or disease name",
          "treatment": "treatment details in ${language}",
          "precautions": "safety precautions in ${language}"
        }
      ],
      "irrigation_schedule": "detailed irrigation advice in ${language}",
      "weather_advice": "weather-based recommendations in ${language}",
      "yield_tips": "tips to improve yield in ${language}"
    }
  }
}`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, isFinal, language = "English" } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    const systemPrompt = isFinal
      ? buildFinalPrompt(language)
      : buildConversationPrompt(language);

    // Sanitise messages: only keep role + content (drop ui, trendData, weatherData)
    const sanitisedMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })
    );

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      response_format: { type: "json_object" },
      max_tokens: isFinal ? 1200 : 500,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitisedMessages,
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: Record<string, unknown>;
    try {
      // Strip any accidental markdown fences before parsing
      const clean = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("JSON parse error, raw response:", raw);
      parsed = { resp: "Sorry, I couldn't interpret the response. Please try again." };
    }

    // Validate the shape we got back
    if (isFinal && !parsed.advisory) {
      // If somehow the model didn't return advisory, return a friendly error
      return NextResponse.json(
        { resp: "Advisory generation failed. Please try again.", ui: "mainMenu" },
        { status: 200 }
      );
    }

    if (!isFinal && !parsed.resp) {
      parsed.resp = "Sorry, I didn't understand. Could you please rephrase?";
    }

    return NextResponse.json(parsed);

  } catch (e: unknown) {
    console.error("❌ Error generating agriculture advisory:", e);

    const errorMessage = e instanceof Error ? e.message : "Failed to generate advisory";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}