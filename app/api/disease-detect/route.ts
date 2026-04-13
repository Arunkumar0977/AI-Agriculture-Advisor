import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = `
Analyze this plant leaf image and detect disease.

Image URL: ${body.image}

Give output strictly in this format:

English:
Disease Name:
Symptoms Observed:
Cause:
Solution:

Hindi:
रोग का नाम:
देखे गए लक्षण:
कारण:
समाधान:
`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Plant Disease Detector",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      return NextResponse.json({ error: "AI failed" }, { status: 500 });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";

    const english = text.split("Hindi:")[0].replace("English:", "").trim();
    const hindi = text.split("Hindi:")[1]?.trim() || "";

    return NextResponse.json({ english, hindi });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
















// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const imageInput: string = body.image;

//     // ── 1. Validate input ──────────────────────────────────────────────
//     if (!imageInput) {
//       return NextResponse.json({ error: "No image provided" }, { status: 400 });
//     }

//     // ── 2. Validate it's a proper base64 data URI (not a blob:// URL) ──
//     if (imageInput.startsWith("blob:")) {
//       return NextResponse.json(
//         { error: "Blob URLs are not supported. Please re-upload the image." },
//         { status: 400 }
//       );
//     }

//     if (!imageInput.startsWith("data:image")) {
//       return NextResponse.json(
//         { error: "Invalid image format. Must be a base64 image." },
//         { status: 400 }
//       );
//     }

//     // ── 3. Validate API key ────────────────────────────────────────────
//     const apiKey = process.env.OPENROUTER_API_KEY;
//     if (!apiKey) {
//       console.error("OPENROUTER_API_KEY is not set in environment variables");
//       return NextResponse.json(
//         { error: "Server configuration error: API key missing." },
//         { status: 500 }
//       );
//     }

//     const prompt = `You are an expert agricultural plant pathologist helping Indian farmers.

// Analyze this crop/plant image carefully and identify any disease, pest damage, or nutritional deficiency.

// Respond STRICTLY in this exact format (no extra text before or after):

// English:
// Disease Name: [name or "Healthy Plant" if no disease found]
// Cause: [what causes it]
// Symptoms: [visible symptoms]
// Solution: [practical treatment steps a farmer can follow]
// Prevention: [how to prevent it in future]

// Hindi:
// Disease Name: [हिंदी में नाम]
// Cause: [कारण]
// Symptoms: [लक्षण]
// Solution: [उपाय]
// Prevention: [बचाव]`;

//     // ── 4. Call OpenRouter with vision model ───────────────────────────
//     const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//         "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
//         "X-Title": "Plant Disease Detector",
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-3.5-turbo",  // vision model — can read images
//         max_tokens: 1200,
//         messages: [
//           {
//             role: "user",
//             content: [
//               {
//                 type: "image_url",
//                 image_url: {
//                   url: imageInput, // base64 data URI: "data:image/png;base64,..."
//                 },
//               },
//               {
//                 type: "text",
//                 text: prompt,
//               },
//             ],
//           },
//         ],
//       }),
//     });

//     // ── 5. Handle OpenRouter errors with detail ────────────────────────
//     if (!openRouterRes.ok) {
//       const errText = await openRouterRes.text();
//       console.error(`OpenRouter ${openRouterRes.status} error:`, errText);

//       // surface specific errors to help debug
//       if (openRouterRes.status === 401) {
//         return NextResponse.json({ error: "Invalid API key. Check OPENROUTER_API_KEY." }, { status: 500 });
//       }
//       if (openRouterRes.status === 402) {
//         return NextResponse.json({ error: "OpenRouter account has no credits. Please top up." }, { status: 500 });
//       }
//       if (openRouterRes.status === 429) {
//         return NextResponse.json({ error: "Rate limit reached. Please wait a moment and try again." }, { status: 500 });
//       }

//       return NextResponse.json(
//         { error: `AI error (${openRouterRes.status}). Please try again.` },
//         { status: 500 }
//       );
//     }

//     // ── 6. Parse response ──────────────────────────────────────────────
//     const data = await openRouterRes.json();
//     const text: string = data?.choices?.[0]?.message?.content || "";

//     if (!text) {
//       console.error("Empty response from OpenRouter:", JSON.stringify(data));
//       return NextResponse.json({ error: "AI returned an empty response." }, { status: 500 });
//     }

//     // ── 7. Split English / Hindi sections ─────────────────────────────
//     const englishRaw = text.split("Hindi:")[0]?.replace("English:", "").trim() || "";
//     const hindiRaw   = text.split("Hindi:")[1]?.trim() || "";

//     // ── 8. Parse each field from structured output ─────────────────────
//     const parseSection = (raw: string) => {
//       const get = (key: string): string => {
//         const match = raw.match(new RegExp(`${key}:\\s*(.+?)(?=\\n\\S+:|$)`, "s"));
//         return match?.[1]?.trim().replace(/^\[|\]$/g, "") || "—";
//       };
//       return {
//         diseaseName: get("Disease Name"),
//         cause:       get("Cause"),
//         symptoms:    get("Symptoms"),
//         solution:    get("Solution"),
//         prevention:  get("Prevention"),
//       };
//     };

//     const english = parseSection(englishRaw);
//     const hindi   = parseSection(hindiRaw);

//     return NextResponse.json({ english, hindi });

//   } catch (error: any) {
//     console.error("Unhandled server error:", error?.message || error);
//     return NextResponse.json(
//       { error: "Unexpected server error. Please try again." },
//       { status: 500 }
//     );
//   }
// }