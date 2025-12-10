"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send } from "lucide-react";
import axios from "axios";
import EmptyBoxState from "./EmptyBoxState";
import FinalUi from "./FinalUi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { useAgriAdvisor, AdvisoryContextType } from "@/context/AdvisoryDetailContext";

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
  trendData?: MarketTrendData[];
  weatherData?: WeatherInfo;
};

// Advisory Structure
export type AdvisoryInfo = {
  crop: string;
  growth_stage: string;
  problem: string;
  location: string;
  price: string;
  date: string;
  unit: string;
  recommendations: {
    fertilizers: {
      name: string;
      quantity: string;
      application_method: string;
    }[];
    pest_control: {
      pest_name: string;
      treatment: string;
      precautions: string;
    }[];
    irrigation_schedule: string;
    weather_advice: string;
    yield_tips: string;
  };
};

//  Market Trend Type
type MarketTrendData = {
  date: string;
  price: number;
};

//  Weather Info Type
type WeatherInfo = {
  location: string;
  temperature: number;
  humidity: number;
  pressure: number;
  weather: string;
  description: string;
  wind_speed: number;
};

//  API Response
interface APIResponse {
  resp: string;
  ui?: string;
  advisory?: AdvisoryInfo;
  trend?: MarketTrendData[];
}

const AgriChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [advisoryDetail, setAdvisoryDetail] = useState<AdvisoryInfo | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // Send message
  const onSend = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    const newMsg: Message = { role: "user", content: userInput };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setUserInput("");

    const lower = userInput.toLowerCase();

    // Detect special queries
    if (lower.includes("weather") || lower.includes("temperature") || lower.includes("climate")) {
      await handleWeatherQuery(userInput);
      return;
    }

    if (lower.includes("price") || lower.includes("market")) {
      await handleMarketPriceQuery(userInput);
      return;
    }

    try {
      const { data } = await axios.post<APIResponse>("/api/aimodel", {
        messages: newMessages,
        isFinal,
      });

      console.log("🌾 AGRI RESPONSE:", data);

      if (!isFinal) {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.resp, ui: data.ui },
    ]);
  } else {
    const finalAdvisory = data.advisory || null;
    setAdvisoryDetail(finalAdvisory);

         if (finalAdvisory) {
      try {
        await fetch("/api/addAgriAdvisory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: "user_12345",
            crop: finalAdvisory.crop,
            growthStage: finalAdvisory.growth_stage,
            problem: finalAdvisory.problem,
            location: finalAdvisory.location,
            irrigation: finalAdvisory.recommendations.irrigation_schedule,
            fertilizer:
              finalAdvisory.recommendations.fertilizers
                ?.map((f) => `${f.name} (${f.quantity})`)
                .join(", ") || "N/A",
            pesticide:
              finalAdvisory.recommendations.pest_control
                ?.map((p) => `${p.pest_name}: ${p.treatment}`)
                .join(", ") || "N/A",
            additionalAdvice:
              finalAdvisory.recommendations.yield_tips ||
              "Ensure proper irrigation and monitor for pests.",
            createdAt: new Date().toISOString(),
          }),
        });
        console.log("✅ Advisory saved successfully!");
      } catch (saveError) {
        console.error("❌ Failed to save advisory:", saveError);
      }
    }
  
      }
    } catch (err) {
      console.error("❌ AI Model Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

 // 📊 Market Price Query
const handleMarketPriceQuery = async (query: string) => {
  try {
    setLoading(true);

    // --- Improved extraction using stricter regex ---
    const cropMatch = query.match(/(?:price of|rate of)\s+([a-zA-Z ]+)/i);
    const locMatch = query.match(/in\s+([a-zA-Z ]+)/i);

    // --- Clean extracted values ---
    const crop = cropMatch ? cropMatch[1].trim().split(" ")[0] : "Wheat"; 
    const location = locMatch ? locMatch[1].trim() : "Karnataka"; // fallback state that always exists

    console.log("🌾 Fetching market data for:", crop, "in", location);

    // --- API call to backend route (/api/market) ---
    const res = await axios.post("/api/market", { crop, location });

    // --- Backend result ---
    const { price, date, trend, message, unit } = res.data || {};

    // --- Handle missing data ---
    if (!price || price === "N/A") {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            message ||
            `⚠️ No market data found for **${crop}** in **${location}**. Try another crop or try a full state name.`,
        },
      ]);
      return;
    }

    // --- Success response message ---
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `📊 The current market price of **${crop}** in **${location}** is **₹${price} per quintal** (as of ${date}).`,
        trendData: trend ?? [],
      },
    ]);
  } catch (err: any) {
    console.error("⚠️ Market API Error:", err);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "❌ Unable to fetch live market price right now. Please try again in a moment.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  // 🌦️ Weather Query
  const handleWeatherQuery = async (query: string) => {
    try {
      const location =
        query.match(/weather in ([A-Za-z]+)/i)?.[1] ||
        query.match(/in ([A-Za-z]+)/i)?.[1] ||
        "Delhi";

      const res = await axios.post("/api/weather", { location });
      const weather = res.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `🌤️ Weather in ${weather.location}: ${weather.temperature}°C, ${weather.weather}.`,
          weatherData: weather,
        },
      ]);
    } catch (err) {
      console.error("⚠️ Weather API Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Unable to fetch weather data." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Render dynamic UI
  const RenderGenerativeUi = (ui?: string) => {
    switch (ui) {
      case "cropType":
        return renderSelectionUi("Select your crop type:", ["Rice", "Wheat", "Tomato", "Cotton", "Maize"]);
      case "growthStage":
        return renderSelectionUi("Select crop growth stage:", ["Seedling", "Vegetative", "Flowering", "Harvest"]);
      case "problem":
        return renderSelectionUi("Select problem type:", ["Pest", "Disease", "Soil Issue", "Water Stress", "Nutrient Deficiency"]);
      case "location":
        return (
          <div className="mt-3">
            <p className="text-sm text-gray-600">Enter your farm location:</p>
            <Textarea
              placeholder="District, State, or Region..."
              className="mt-2 w-full"
              onChange={(e) => setUserInput(e.target.value)}
              onBlur={onSend}
            />
          </div>
        );
      case "final":
        return (
          <FinalUi
            viewAdvice={() => console.log("✅ View Full Advisory")}
            disable={!advisoryDetail}
          />
        );
      default:
        return null;
    }
  };

  // 🧭 Helper for button selections
  const renderSelectionUi = (label: string, options: string[]) => (
    <div className="mt-3">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex gap-2 mt-2 flex-wrap">
        {options.map((opt) => (
          <Button
            key={opt}
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-100"
            onClick={() => {
              setUserInput(opt);
              onSend();
            }}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );

  // 📈 Trend Chart
  const RenderTrendChart = (trendData?: MarketTrendData[]) => {
    if (!trendData) return null;

    return (
      <div className="mt-3 bg-white p-3 rounded-lg border border-green-200">
        <p className="text-sm font-semibold mb-2">📈 Market Price Trend (Last 7 Days)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 🌦️ Weather Card
  const RenderWeatherCard = (w?: WeatherInfo) => {
    if (!w) return null;
    return (
      <div className="mt-3 bg-blue-50 p-4 rounded-xl border border-blue-200 text-sm shadow-sm">
        <p className="font-semibold text-blue-700">🌦️ Weather Update</p>
        <p>📍 Location: {w.location}</p>
        <p>🌡️ Temperature: {w.temperature}°C</p>
        <p>💧 Humidity: {w.humidity}%</p>
        <p>☁️ Condition: {w.weather} ({w.description})</p>
        <p>🌬️ Wind Speed: {w.wind_speed} m/s</p>
      </div>
    );
  };

  // Trigger final stage
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "final" && !isFinal) {
      setIsFinal(true);
      setUserInput("ok, ready");
    }
  }, [messages, isFinal]);

  useEffect(() => {
    if (isFinal && userInput === "ok, ready") onSend();
  }, [isFinal, userInput]);

  return (
    <div className="h-[85vh] flex flex-col bg-gradient-to-b from-green-50 to-green-100 rounded-3xl shadow-xl border border-green-200">
      {/* 🌱 Empty state */}
      {messages.length === 0 && (
        <EmptyBoxState
          onselectOption={(v: string) => {
            setUserInput(v);
            onSend();
          }}
        />
      )}

      {/* 💬 Chat Area */}
      <section className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-lg px-4 py-2 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-green-600 text-white"
                  : "bg-white border border-green-200 text-gray-900"
              }`}
            >
              {msg.content}
              {RenderGenerativeUi(msg.ui)}
              {RenderTrendChart(msg.trendData)}
              {RenderWeatherCard(msg.weatherData)}
            </div>
          </div>
        ))}

        {/* 🔄 Loading Spinner */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-green-200 p-3 rounded-2xl shadow-sm">
              <Loader className="animate-spin text-green-600" />
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </section>

      {/* ✍️ Input Section */}
      <section className="p-4 border-t border-green-200 bg-white rounded-b-3xl">
        <div className="border rounded-2xl p-4 relative bg-white shadow-md">
          <Textarea
            placeholder="Ask about your crops, weather, or market updates..."
            className="w-full h-20 bg-transparent border-none focus-visible:ring-0 resize-none text-gray-800"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button
            size="icon"
            className="absolute bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white"
            onClick={onSend}
            disabled={loading}
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AgriChatBox;
