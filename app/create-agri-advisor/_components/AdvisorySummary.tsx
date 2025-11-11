"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { useAdvisoryDetail } from "@/app/_components/AgriProvider"; // 🌾 using Agri context
import { AdvisoryContextType } from "@/context/AdvisoryDetailContext";
import { AdvisoryInfo } from "@/app/create-agri-advisor/_components/AgriChatBox";
import Image from "next/image";
import { ArrowLeft, Leaf } from "lucide-react";


function AdvisorySummary() {
  const { advisoryInfo } = useAdvisoryDetail() as AdvisoryContextType;
  const advisoryData: AdvisoryInfo | null = advisoryInfo;

  // 🌾 Build timeline sections dynamically
  const data = advisoryData
    ? [
        {
          title: "🌾 Crop Overview",
          content: (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
              <p>
                <strong>Crop:</strong> {advisoryData.crop || "Not specified"}
              </p>
              <p>
                <strong>Growth Stage:</strong> {advisoryData.growth_stage || "Not specified"}
              </p>
              <p>
                <strong>Problem:</strong> {advisoryData.problem || "None"}
              </p>
              <p>
                <strong>Location:</strong> {advisoryData.location || "Unknown"}
              </p>
            </div>
          ),
        },
        {
          title: "🧪 Fertilizer Recommendations",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {advisoryData.recommendations?.fertilizers?.length ? (
                advisoryData.recommendations.fertilizers.map((fertilizer, index) => (
                  <div
                    key={index}
                    className="border border-green-300 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-green-700">{fertilizer.name}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Quantity:</strong> {fertilizer.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Method:</strong> {fertilizer.application_method}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No fertilizer recommendations available.</p>
              )}
            </div>
          ),
        },
        {
          title: "🐛 Pest & Disease Control",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {advisoryData.recommendations?.pest_control?.length ? (
                advisoryData.recommendations.pest_control.map((pest, index) => (
                  <div
                    key={index}
                    className="border border-green-300 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-green-700">{pest.pest_name}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Treatment:</strong> {pest.treatment}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Precautions:</strong> {pest.precautions}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No pest control measures recommended.</p>
              )}
            </div>
          ),
        },
        {
          title: "💧 Irrigation & Weather Guidance",
          content: (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
              <p>
                <strong>Irrigation Schedule:</strong>{" "}
                {advisoryData.recommendations?.irrigation_schedule || "Not provided"}
              </p>
              <p>
                <strong>Weather Advice:</strong>{" "}
                {advisoryData.recommendations?.weather_advice || "No weather data available"}
              </p>
            </div>
          ),
        },
        {
          title: "🌱 Yield Improvement Tips",
          content: (
            <div className="p-4 bg-white border border-green-300 rounded-xl shadow-sm hover:shadow-md transition">
              <p>
                {advisoryData.recommendations?.yield_tips ||
                  "No yield improvement suggestions available."}
              </p>
            </div>
          ),
        },
      ]
    : [];

  // 🌿 Render timeline or fallback state
  return (
    <div className="relative w-full overflow-auto h-[85vh] rounded-2xl bg-gradient-to-b from-green-50 to-green-100 p-3">
      {advisoryData ? (
        <Timeline data={data} />
      ) : (
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image
            src="/agri-bg.jpg"
            alt="Agriculture"
            width={800}
            height={800}
            className="w-full h-full object-cover rounded-3xl"
          />
          <h2 className="flex gap-2 text-2xl md:text-3xl items-center left-10 absolute bottom-10 font-bold text-green-800 drop-shadow-lg bg-white/70 p-3 rounded-xl">
            <ArrowLeft className="text-green-700" />
            Gathering your crop details to generate the perfect advisory...
          </h2>
        </div>
      )}
    </div>
  );
}

export default AdvisorySummary;
