"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { AdvisoryInfo } from "@/app/create-agri-advisor/_components/AgriChatBox";
import { AdvisoryContextType, useAgriAdvisor } from "@/context/AdvisoryDetailContext"; // Option A hook import
// import { useRouter } from "next/navigation";
function AdvisoryTimeline() {
  const { advisoryInfo } = useAgriAdvisor() as AdvisoryContextType;
  const advisoryData: AdvisoryInfo | null = advisoryInfo ?? null;
  // const router = useRouter();

  const data = advisoryData
    ? [
        {
          title: "🌾 Crop Overview",
          content: (
            <div className="p-3 border border-green-200 rounded-xl bg-green-50">
              <p>
                <strong>Crop:</strong> {advisoryData.crop || "N/A"}
              </p>
              <p>
                <strong>Growth Stage:</strong> {advisoryData.growth_stage || "N/A"}
              </p>
              <p>
                <strong>Problem Identified:</strong> {advisoryData.problem || "None"}
              </p>
              <p>
                <strong>Location:</strong> {advisoryData.location || "N/A"}
              </p>
            </div>
          ),
        },

        {
          title: "🧪 Fertilizer Recommendations",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {advisoryData.recommendations?.fertilizers?.length ? (
                advisoryData.recommendations.fertilizers.map((f, index) => (
                  <div
                    key={index}
                    className="border border-green-300 bg-white p-4 rounded-xl shadow-sm"
                  >
                    <h3 className="font-semibold text-green-700">{f.name}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Quantity:</strong> {f.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Method:</strong> {f.application_method}
                    </p>
                  </div>
                ))
              ) : (
                <p>No fertilizer recommendations available.</p>
              )}
            </div>
          ),
        },

        {
          title: "🐛 Pest & Disease Control",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {advisoryData.recommendations?.pest_control?.length ? (
                advisoryData.recommendations.pest_control.map((p, index) => (
                  <div
                    key={index}
                    className="border border-green-300 bg-white p-4 rounded-xl shadow-sm"
                  >
                    <h3 className="font-semibold text-green-700">{p.pest_name}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Treatment:</strong> {p.treatment}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Precautions:</strong> {p.precautions}
                    </p>
                  </div>
                ))
              ) : (
                <p>No pest control information available.</p>
              )}
            </div>
          ),
        },

        {
          title: "💧 Irrigation & Weather Advice",
          content: (
            <div className="flex flex-col gap-2 border border-green-300 bg-white p-4 rounded-xl shadow-sm">
              <p>
                <strong>Irrigation Schedule:</strong>{" "}
                {advisoryData.recommendations?.irrigation_schedule || "Not specified"}
              </p>
              <p>
                <strong>Weather Advice:</strong>{" "}
                {advisoryData.recommendations?.weather_advice || "No updates"}
              </p>
            </div>
          ),
        },

        {
          title: "🌱 Yield Improvement Tips",
          content: (
            <div className="p-4 border border-green-300 bg-green-50 rounded-xl shadow-sm">
              <p>{advisoryData.recommendations?.yield_tips || "No tips available."}</p>
            </div>
          ),
        },
      ]
    : [];

  return (
    <div className="relative w-full overflow-auto h-[85vh] rounded-2xl bg-gradient-to-b from-green-50 to-green-100 p-2">
      {advisoryData ? (
        <Timeline data={data} />
      ) : (
        <div className="relative w-full h-full">
          <h2 className="flex gap-2 text-2xl md:text-3xl items-center left-10 absolute bottom-10 font-bold text-green-800">
            <ArrowLeft className="text-green-700" />
            Gathering your crop details for expert advice...
          </h2>
          <Image src="/agri.avif" alt="Farming background" width={800} height={800} className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      )}
    </div>
  );
}

export default AdvisoryTimeline;
