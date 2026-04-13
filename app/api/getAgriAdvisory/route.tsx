import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const advisories = await client.query(api.getAgriAdvisories.getAgriAdvisories);
    return NextResponse.json(advisories || []);
  } catch (err) {
    console.error("Failed to fetch from Convex:", err);
    return NextResponse.json({ error: "Failed to fetch advisories" }, { status: 500 });
  }
}