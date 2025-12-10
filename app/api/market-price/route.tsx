import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = "579b464db66ec23bdd000001c44d9b7ac26a44b96fde3372e7b2e7e9";

export async function POST(req: Request) {
  try {
    const { crop, location } = await req.json();

    if (!crop || !location) {
      return NextResponse.json({ error: "Crop and location required" }, { status: 400 });
    }

    const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
      ?api-key=${API_KEY}
      &format=json
      &filters[commodity]=${encodeURIComponent(crop)}
      &filters[state]=${encodeURIComponent(location)}
    `.replace(/\s+/g, "");

    const response = await axios.get(apiUrl, {
      validateStatus: () => true, 
    });

    if (response.status !== 200) {
      return NextResponse.json({
        price: "N/A",
        message: "No market data found for this crop and location",
      });
    }

    const data = response.data;

    if (!data.records || data.records.length === 0) {
      return NextResponse.json({
        price: "N/A",
        message: "No data available",
      });
    }

    const record = data.records[0];

    return NextResponse.json({
      price: record.modal_price ?? "N/A",
      date: record.arrival_date ?? "Unknown",
      unit: record.variety || "per quintal",
      trend: [],
    });
  } catch (err) {
    console.error("Market API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
