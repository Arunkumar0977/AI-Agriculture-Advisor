import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { cropName } = await req.json();
    const key = process.env.PEXELS_API_KEY;

    const url = `https://api.pixel.com/search/photos?query=${encodeURIComponent(
      cropName + " crop"
    )}&per_page=1`;

    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}` },
    });

    const data = await res.json();
    const img = data.results?.[0]?.urls?.regular ?? null;

    return NextResponse.json({ image: img });
  } catch (e) {
    return NextResponse.json({ image: null });
  }
}
