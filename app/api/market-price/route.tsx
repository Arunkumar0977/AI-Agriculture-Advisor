import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { crop, location } = await req.json();

    // ✅ Ensure environment variable exists
    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey) {
      throw new Error("Missing DATA_GOV_API_KEY in environment variables");
    }

    // ✅ Construct URL safely
    const url = `https://api.data.gov.in/resource/579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b?format=json&api-key=${apiKey}&filters[commodity]=${encodeURIComponent(
      crop
    )}&filters[state]=${encodeURIComponent(location)}`;

    console.log("🌾 Fetching Market Data:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("⚠️ API Fetch Error:", errorText);
      throw new Error(`Data.gov.in API failed: ${response.statusText}`);
    }

    const data = await response.json();

    // ✅ Validate response
    if (!data.records || data.records.length === 0) {
      console.warn("⚠️ No records found for:", crop, location);
      return NextResponse.json({
        crop,
        location,
        price: "N/A",
        date: "N/A",
        unit: "₹/quintal",
        message: "No market data found for this crop and location.",
      });
    }

    const latest = data.records[0];

    return NextResponse.json({
      crop,
      location,
      price: latest.modal_price || latest.min_price || "N/A",
      date: latest.arrival_date || "N/A",
      unit: "₹/quintal",
    });
  } catch (error: any) {
    console.error("🌾 Server Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
