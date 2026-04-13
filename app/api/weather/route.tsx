// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const location = req.nextUrl.searchParams.get("location");

//     if (!location) {
//       return NextResponse.json(
//         { error: "Location required" },
//         { status: 400 }
//       );
//     }

//     const res = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
//     );

//     const data = await res.json();

//     // ❌ API error (like city not found)
//     if (data.cod !== 200) {
//       return NextResponse.json(
//         { error: data.message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({
//       temp: data.main?.temp || 0,
//       rainfall: data.rain?.["1h"] || 0,
//     });
//   } catch (error) {
//     console.error("Weather API Error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const location = req.nextUrl.searchParams.get("location");

//     if (!location) {
//       return NextResponse.json(
//         { error: "Location required" },
//         { status: 400 }
//       );
//     }

//     const res = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
//     );

//     const data = await res.json();

//     // ❌ API error
//     if (data.cod !== 200) {
//       return NextResponse.json(
//         { error: data.message },
//         { status: 400 }
//       );
//     }

//     // ✅ Handle rainfall properly
//     let rainfall = 0;

//     if (data.rain) {
//       rainfall = data.rain["1h"] || data.rain["3h"] || 0;
//     }

//     return NextResponse.json({
//       temp: data.main?.temp || 0,
//       rainfall,
//     });

//   } catch (error) {
//     console.error("Weather API Error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    
    const body = await req.json();
    const location = body.location;

    if (!location || typeof location !== "string") {
      return NextResponse.json(
        { error: "Location is required in the request body." },
        { status: 400 }
      );
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      console.error("❌ OPENWEATHER_API_KEY is not set");
      return NextResponse.json(
        { error: "Server misconfiguration: weather API key missing." },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const data = await res.json();

    
    if (data.cod !== 200 && data.cod !== "200") {
      return NextResponse.json(
        { error: data.message ?? "Location not found." },
        { status: 400 }
      );
    }

    
    return NextResponse.json({
      location: data.name,                          
      temperature: data.main?.temp ?? 0,            
      humidity: data.main?.humidity ?? 0,         
      pressure: data.main?.pressure ?? 0,           
      weather: data.weather?.[0]?.main ?? "N/A", 
      description: data.weather?.[0]?.description ?? "N/A", 
      wind_speed: data.wind?.speed ?? 0,            
      rainfall: data.rain?.["1h"] ?? data.rain?.["3h"] ?? 0,
    });

  } catch (error) {
    console.error("❌ Weather API Error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching weather." },
      { status: 500 }
    );
  }
}