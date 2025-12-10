import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

if (!convexUrl) {
  console.error(
    "Environment error: NEXT_PUBLIC_CONVEX_URL (or CONVEX_URL) is not set. Convex client cannot be created."
  );
}

const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

/**
 * Normalize incoming keys to match Convex schema:
 * - growthStage -> growth_stage
 * - createdAt -> createdAt (kept)
 * - price/unit/date remain as-is
 * This helps avoid Convex validation failures due to naming mismatch.
 */
function normalizePayload(raw: any) {
  if (!raw || typeof raw !== "object") return raw;

  const normalized: any = { ...raw };

  // map camelCase -> snake_case expected by Convex schema
  if ("growthStage" in normalized && !("growth_stage" in normalized)) {
    normalized.growth_stage = normalized.growthStage;
    delete normalized.growthStage;
  }

  // Some clients might send fertilizers / pest_control as objects or missing arrays — fix common issues
  if (normalized.recommendations) {
    const rec = normalized.recommendations;

    // Ensure fertilizers is an array
    if (!Array.isArray(rec.fertilizers)) {
      rec.fertilizers = rec.fertilizers ? [rec.fertilizers] : [];
    }

    // Ensure pest_control is an array
    if (!Array.isArray(rec.pest_control)) {
      rec.pest_control = rec.pest_control ? [rec.pest_control] : [];
    }

    normalized.recommendations = rec;
  }

  return normalized;
}

export async function POST(req: NextRequest) {
  try {
    if (!client) {
      return NextResponse.json(
        { error: "Server misconfiguration: Convex client not initialized." },
        { status: 500 }
      );
    }

    const rawBody = await req.json();
    console.log("📥 Raw incoming payload:", JSON.stringify(rawBody, null, 2));

    const body = normalizePayload(rawBody);
    console.log("🔁 Normalized payload:", JSON.stringify(body, null, 2));

    // Basic validation of minimal required fields
    const required = [
      "uid",
      "crop",
      // Accept either growth_stage or growthStage (we normalized above)
      "growth_stage",
      "problem",
      "location",
      "price",
      "date",
      "unit",
      "recommendations",
    ];

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate recommendations structure
    if (!body.recommendations || typeof body.recommendations !== "object") {
      return NextResponse.json(
        { error: "Invalid recommendations object" },
        { status: 400 }
      );
    }

    // Try the normal invocation first (passing generated api function reference).
    // Some setups require passing a string name — try both and surface the error if both fail.
    let savedId: any;
    try {
      savedId = await client.mutation(api.addAgriAdvisory, body);
    } catch (firstErr) {
      console.warn("Convex mutation with function ref failed, trying fallback by name.", firstErr);

      // Fallback: if api.addAgriAdvisory has a name property, try that (some client versions expect string).
      // @ts-ignore
      const name = (api.addAgriAdvisory && (api.addAgriAdvisory.name || api.addAgriAdvisory._name)) || "addAgriAdvisory";

      try {
        // some Convex client versions accept (name, args)
        savedId = await client.mutation(name, body);
      } catch (secondErr) {
        // Log both errors to help debugging
        console.error("First mutation error:", firstErr);
        console.error("Fallback mutation error:", secondErr);

        // If Convex returns a response body, show it if available
        const convErrMessage =
          (secondErr && (secondErr.message || secondErr.response || JSON.stringify(secondErr))) ||
          "Unknown Convex error";

        return NextResponse.json(
          {
            error: "Failed to call Convex mutation",
            details: convErrMessage,
          },
          { status: 502 }
        );
      }
    }

    console.log("✅ Advisory saved to Convex, id:", savedId);

    return NextResponse.json({
      success: true,
      id: savedId,
      message: "Advisory saved successfully",
    });
  } catch (err: any) {
    console.error("❌ Unexpected error in /api/addAgriAdvisory:", err);

    // Try to show Convex server error details if present
    const detail =
      err?.response?.data || err?.response || err?.message || JSON.stringify(err);

    return NextResponse.json(
      {
        error: "Internal server error while saving advisory",
        details: detail,
      },
      { status: 500 }
    );
  }
}
