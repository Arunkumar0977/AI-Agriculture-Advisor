import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { location } = await req.json();
    const key = process.env.OPENWEATHER_API_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "Missing OPENWEATHER_API_KEY" },
        { status: 500 }
      );
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&units=metric&appid=${key}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch weather", details: data },
        { status: res.status }
      );
    }

    const output = {
      location: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      weather: data.weather?.[0]?.main ?? "N/A",
      description: data.weather?.[0]?.description ?? "N/A",
      wind_speed: data.wind.speed,
    };

    return NextResponse.json(output);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
