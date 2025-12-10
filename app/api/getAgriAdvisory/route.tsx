import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";



const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

(async () => {
  const data = await client.query("getAgriAdvisories");
  console.log(data);
})();
export async function GET() {
  try {
    // call a Convex query that returns all advisories
    const advisories = await client.query("getAgriAdvisories"); // depends on your generated API
    return NextResponse.json(advisories || []);
  } catch (err) {
    console.error("Failed to fetch from Convex:", err);
    return NextResponse.json({ error: "Failed to fetch advisories" }, { status: 500 });
  }
}
