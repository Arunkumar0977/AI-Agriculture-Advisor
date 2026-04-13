import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL is not set.");
}

const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

type Fertilizer = {
  name?: string;
  quantity?: string;
  application_method?: string;
};

type PestControl = {
  pest_name?: string;
  treatment?: string;
  precautions?: string;
};

type Recommendations = {
  fertilizers?: Fertilizer[];
  pest_control?: PestControl[];
  irrigation_schedule?: string;
  weather_advice?: string;
  yield_tips?: string;
};

type RequestBody = {
  uid: string;
  crop?: string;
  growth_stage?: string;
  growthStage?: string;
  problem?: string;
  location?: string;
  price?: string;
  unit?: string;
  date?: string;
  createdAt?: string;
  recommendations?: Recommendations;
};

export async function POST(req: NextRequest) {
  try {
    if (!client) {
      return NextResponse.json(
        { error: "Server misconfiguration: Convex client not initialized." },
        { status: 500 }
      );
    }

    
    const body: RequestBody = await req.json();

    console.log("📥 Incoming payload:", JSON.stringify(body, null, 2));

    const rawRec: Recommendations = body.recommendations ?? {};

    const recommendations = {
      fertilizers: Array.isArray(rawRec.fertilizers)
        ? rawRec.fertilizers.map((f: Fertilizer) => ({
            name: f.name ?? "N/A",
            quantity: f.quantity ?? "N/A",
            application_method: f.application_method ?? "N/A",
          }))
        : [],

      pest_control: Array.isArray(rawRec.pest_control)
        ? rawRec.pest_control.map((p: PestControl) => ({
            pest_name: p.pest_name ?? "N/A",
            treatment: p.treatment ?? "N/A",
            precautions: p.precautions ?? "N/A",
          }))
        : [],

      irrigation_schedule: rawRec.irrigation_schedule ?? "Not specified",
      weather_advice: rawRec.weather_advice ?? "Not specified",
      yield_tips: rawRec.yield_tips ?? "Not specified",
    };

    const payload = {
      uid: body.uid,
      crop: body.crop ?? "Unknown",
      growth_stage: body.growth_stage ?? body.growthStage ?? "Unknown",
      problem: body.problem ?? "Not specified",
      location: body.location ?? "Not specified",
      price: body.price ?? "",
      date: body.date ?? new Date().toISOString(),
      unit: body.unit ?? "",
      recommendations,
      createdAt: body.createdAt ?? new Date().toISOString(),
    };

    if (!payload.uid || !payload.crop) {
      return NextResponse.json(
        { error: "Missing required fields: uid and crop" },
        { status: 400 }
      );
    }

    console.log("📤 Sending to Convex:", JSON.stringify(payload, null, 2));

    const savedId = await client.mutation(
      api.addAgriAdvisory.addAgriAdvisory,
      payload
    );

    console.log("Advisory saved, id:", savedId);

    return NextResponse.json({
      success: true,
      id: savedId,
      message: "Advisory saved successfully",
    });

  } catch (err: unknown) {   // ✅ FIXED
    console.error("❌ Error saving advisory:", err);

    let errorMessage = "Unknown error";

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return NextResponse.json(
      {
        error: "Failed to save advisory",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}