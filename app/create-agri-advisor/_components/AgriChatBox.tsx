// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Loader, Send } from "lucide-react";
// import axios from "axios";
// import EmptyBoxState from "./EmptyBoxState"; // 🌾 your new agri EmptyBoxState
// import FinalUi from "./FinalUi"; // 🌾 new agri Final UI

// type Message = {
//   role: "user" | "assistant";
//   content: string;
//   ui?: string;
// };

// // 🌾 Advisory Data Structure
// export type AdvisoryInfo = {
//   crop: string;
//   growth_stage: string;
//   problem: string;
//   location: string;
//   recommendations: {
//     fertilizers: {
//       name: string;
//       quantity: string;
//       application_method: string;
//     }[];
//     pest_control: {
//       pest_name: string;
//       treatment: string;
//       precautions: string;
//     }[];
//     irrigation_schedule: string;
//     weather_advice: string;
//     yield_tips: string;
//   };
// };

// // 🌿 API Response Type
// interface APIResponse {
//   resp: string;
//   ui?: string;
//   advisory?: AdvisoryInfo;
// }

// const AgriChatBox = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [userInput, setUserInput] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [isFinal, setIsFinal] = useState(false);
//   const [advisoryDetail, setAdvisoryDetail] = useState<AdvisoryInfo | null>(null);

//   const chatEndRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll to bottom
//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//   useEffect(scrollToBottom, [messages]);

//   // 🌾 Send message to AI API
//   const onSend = async () => {
//     if (!userInput.trim()) return;

//     setLoading(true);
//     const newMsg: Message = {
//       role: "user",
//       content: userInput,
//     };

//     const newMessages = [...messages, newMsg];
//     setMessages(newMessages);
//     setUserInput("");

//     try {
//       const { data } = await axios.post<APIResponse>("/api/aimodel", {
//         messages: newMessages,
//         isFinal,
//       });

//       console.log("AGRI RESPONSE:", data);

//       if (!isFinal) {
//         setMessages((prev) => [
//           ...prev,
//           { role: "assistant", content: data.resp, ui: data.ui },
//         ]);
//       } else {
//         // Store final advisory plan
//         setAdvisoryDetail(data.advisory || null);
//       }
//     } catch (error) {
//       console.error("🌾 API Error:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "⚠️ Sorry, there was an issue fetching advice. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🌿 Render AI Generated UI
//   const RenderGenerativeUi = (ui: string) => {
//     switch (ui) {
//       case "cropType":
//         return (
//           <div className="mt-3">
//             <p className="text-sm text-gray-600">Select your crop type:</p>
//             <div className="flex gap-2 mt-2 flex-wrap">
//               {["Rice", "Wheat", "Tomato", "Cotton", "Maize"].map((crop) => (
//                 <Button
//                   key={crop}
//                   variant="outline"
//                   className="border-green-600 text-green-700 hover:bg-green-100"
//                   onClick={() => {
//                     setUserInput(crop);
//                     onSend();
//                   }}
//                 >
//                   {crop}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         );

//       case "growthStage":
//         return (
//           <div className="mt-3">
//             <p className="text-sm text-gray-600">What stage is your crop in?</p>
//             <div className="flex gap-2 mt-2 flex-wrap">
//               {["Seedling", "Vegetative", "Flowering", "Harvest"].map((stage) => (
//                 <Button
//                   key={stage}
//                   variant="outline"
//                   className="border-green-600 text-green-700 hover:bg-green-100"
//                   onClick={() => {
//                     setUserInput(stage);
//                     onSend();
//                   }}
//                 >
//                   {stage}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         );

//       case "problem":
//         return (
//           <div className="mt-3">
//             <p className="text-sm text-gray-600">What issue are you facing?</p>
//             <div className="flex gap-2 mt-2 flex-wrap">
//               {["Pest", "Disease", "Soil Issue", "Water Stress", "Nutrient Deficiency"].map(
//                 (issue) => (
//                   <Button
//                     key={issue}
//                     variant="outline"
//                     className="border-green-600 text-green-700 hover:bg-green-100"
//                     onClick={() => {
//                       setUserInput(issue);
//                       onSend();
//                     }}
//                   >
//                     {issue}
//                   </Button>
//                 )
//               )}
//             </div>
//           </div>
//         );

//       case "location":
//         return (
//           <div className="mt-3">
//             <p className="text-sm text-gray-600">Where is your farm located?</p>
//             <Textarea
//               placeholder="Enter your district, state, or region..."
//               className="mt-2 w-full"
//               onChange={(e) => setUserInput(e.target.value)}
//               onBlur={onSend}
//             />
//           </div>
//         );

//       case "final":
//         return (
//           <FinalUi
//             viewAdvice={() => console.log("✅ Show full advisory plan")}
//             disable={!advisoryDetail}
//           />
//         );

//       default:
//         return null;
//     }
//   };

//   // 🌾 Trigger final response when AI reaches "final" stage
//   useEffect(() => {
//     const lastMsg = messages[messages.length - 1];
//     if (lastMsg?.ui === "final" && !isFinal) {
//       setIsFinal(true);
//       setUserInput("ok, ready");
//     }
//   }, [messages, isFinal]);

//   useEffect(() => {
//     if (isFinal && userInput === "ok, ready") {
//       onSend();
//     }
//   }, [isFinal, userInput]);

//   return (
//     <div className="h-[85vh] flex flex-col bg-gradient-to-b from-green-50 to-green-100 rounded-3xl shadow-inner">
//       {/* 🌱 Empty state */}
//       {messages.length === 0 && (
//         <EmptyBoxState
//           onselectOption={(v: string) => {
//             setUserInput(v);
//             onSend();
//           }}
//         />
//       )}

//       {/* 💬 Messages */}
//       <section className="flex-1 overflow-y-auto p-4">
//         {messages.map((msg, index) =>
//           msg.role === "user" ? (
//             <div className="flex justify-end mt-2" key={index}>
//               <div className="max-w-lg bg-green-600 text-white px-4 py-2 rounded-2xl shadow">
//                 {msg.content}
//               </div>
//             </div>
//           ) : (
//             <div className="flex justify-start mt-2" key={index}>
//               <div className="max-w-lg bg-white border border-green-200 text-black px-4 py-2 rounded-2xl shadow-sm">
//                 {msg.content}
//                 {RenderGenerativeUi(msg.ui ?? "")}
//               </div>
//             </div>
//           )
//         )}

//         {/* 🌿 Loading Indicator */}
//         {loading && (
//           <div className="flex justify-start mt-2">
//             <div className="max-w-lg bg-white border border-green-200 text-black px-4 py-2 rounded-2xl shadow-sm">
//               <Loader className="animate-spin text-green-600" />
//             </div>
//           </div>
//         )}
//         <div ref={chatEndRef}></div>
//       </section>

//       {/* ✍️ Input Section */}
//       <section className="p-4 border-t border-green-200">
//         <div className="border rounded-2xl p-4 relative bg-white">
//           <Textarea
//             placeholder="Ask about your crops, soil, or pest issues..."
//             className="w-full h-20 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
//             onChange={(event) => setUserInput(event.target.value)}
//             value={userInput}
//           />
//           <Button
//             size="icon"
//             className="absolute bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
//             onClick={onSend}
//             disabled={loading}
//           >
//             {loading ? (
//               <Loader className="h-4 w-4 animate-spin" />
//             ) : (
//               <Send className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AgriChatBox;


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

// 🌾 Message Type
type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
  trendData?: MarketTrendData[];
};

// 🌾 Advisory Data Structure
export type AdvisoryInfo = {
  crop: string;
  growth_stage: string;
  problem: string;
  location: string;
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

// 🌾 Market Trend Data
type MarketTrendData = {
  date: string;
  price: number;
};

// 🌿 API Response Type
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

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // 🌾 Handle Send Message
  const onSend = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    const newMsg: Message = { role: "user", content: userInput };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setUserInput("");

    try {
      // 🧠 Detect market price queries
      const lowerMsg = newMsg.content.toLowerCase();
      if (lowerMsg.includes("price") || lowerMsg.includes("market")) {
        await handleMarketPriceQuery(newMsg.content);
        return;
      }

      // 🔗 Send to AI model API
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
        setAdvisoryDetail(data.advisory || null);
      }
    } catch (error) {
      console.error("🌾 API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, there was an issue fetching advice. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🌾 Handle Market Price Query
  const handleMarketPriceQuery = async (query: string) => {
    try {
      // Extract crop and location
      const cropMatch = query.match(/price of (\w+)/i);
      const locationMatch = query.match(/in ([A-Za-z]+)/i);
      const crop = cropMatch ? cropMatch[1] : "Wheat";
      const location = locationMatch ? locationMatch[1] : "Delhi";

      const res = await axios.post("/api/market-price", { crop, location });
      const { price, date, trend } = res.data;

      // 🧾 Format response
      const botMsg: Message = {
        role: "assistant",
        content: `📊 The current market price of ${crop} in ${location} is ₹${price} per quintal (as of ${date}).`,
        trendData: trend,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("⚠️ Market API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, I couldn't fetch market data at the moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🌿 Render AI Generated UI
  const RenderGenerativeUi = (ui: string) => {
    switch (ui) {
      case "cropType":
        return (
          <div className="mt-3">
            <p className="text-sm text-gray-600">Select your crop type:</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Rice", "Wheat", "Tomato", "Cotton", "Maize"].map((crop) => (
                <Button
                  key={crop}
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-100"
                  onClick={() => {
                    setUserInput(crop);
                    onSend();
                  }}
                >
                  {crop}
                </Button>
              ))}
            </div>
          </div>
        );

      case "growthStage":
        return (
          <div className="mt-3">
            <p className="text-sm text-gray-600">What stage is your crop in?</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Seedling", "Vegetative", "Flowering", "Harvest"].map((stage) => (
                <Button
                  key={stage}
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-100"
                  onClick={() => {
                    setUserInput(stage);
                    onSend();
                  }}
                >
                  {stage}
                </Button>
              ))}
            </div>
          </div>
        );

      case "problem":
        return (
          <div className="mt-3">
            <p className="text-sm text-gray-600">What issue are you facing?</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Pest", "Disease", "Soil Issue", "Water Stress", "Nutrient Deficiency"].map(
                (issue) => (
                  <Button
                    key={issue}
                    variant="outline"
                    className="border-green-600 text-green-700 hover:bg-green-100"
                    onClick={() => {
                      setUserInput(issue);
                      onSend();
                    }}
                  >
                    {issue}
                  </Button>
                )
              )}
            </div>
          </div>
        );

      case "location":
        return (
          <div className="mt-3">
            <p className="text-sm text-gray-600">Where is your farm located?</p>
            <Textarea
              placeholder="Enter your district, state, or region..."
              className="mt-2 w-full"
              onChange={(e) => setUserInput(e.target.value)}
              onBlur={onSend}
            />
          </div>
        );

      case "final":
        return (
          <FinalUi
            viewAdvice={() => console.log("✅ Show full advisory plan")}
            disable={!advisoryDetail}
          />
        );

      default:
        return null;
    }
  };

  // 🌾 Trend Chart Renderer
  const RenderTrendChart = (trendData?: MarketTrendData[]) => {
    if (!trendData || trendData.length === 0) return null;

    return (
      <div className="mt-3 bg-white p-3 rounded-lg border border-green-200">
        <p className="text-sm font-semibold mb-2">📈 Market Price Trend (Last 7 Days)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 🌾 Trigger final response when AI reaches "final" stage
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "final" && !isFinal) {
      setIsFinal(true);
      setUserInput("ok, ready");
    }
  }, [messages, isFinal]);

  useEffect(() => {
    if (isFinal && userInput === "ok, ready") {
      onSend();
    }
  }, [isFinal, userInput]);

  return (
    <div className="h-[85vh] flex flex-col bg-gradient-to-b from-green-50 to-green-100 rounded-3xl shadow-inner">
      {/* 🌱 Empty state */}
      {messages.length === 0 && (
        <EmptyBoxState
          onselectOption={(v: string) => {
            setUserInput(v);
            onSend();
          }}
        />
      )}

      {/* 💬 Messages */}
      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div className="flex justify-end mt-2" key={index}>
              <div className="max-w-lg bg-green-600 text-white px-4 py-2 rounded-2xl shadow">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="flex justify-start mt-2" key={index}>
              <div className="max-w-lg bg-white border border-green-200 text-black px-4 py-2 rounded-2xl shadow-sm">
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? "")}
                {RenderTrendChart(msg.trendData)}
              </div>
            </div>
          )
        )}

        {/* 🌿 Loading Indicator */}
        {loading && (
          <div className="flex justify-start mt-2">
            <div className="max-w-lg bg-white border border-green-200 text-black px-4 py-2 rounded-2xl shadow-sm">
              <Loader className="animate-spin text-green-600" />
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </section>

      {/* ✍️ Input Section */}
      <section className="p-4 border-t border-green-200">
        <div className="border rounded-2xl p-4 relative bg-white">
          <Textarea
            placeholder="Ask about your crops, soil, pest issues, or market prices..."
            className="w-full h-20 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
          />
          <Button
            size="icon"
            className="absolute bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
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
