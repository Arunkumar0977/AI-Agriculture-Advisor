"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Sprout, CloudSun, Leaf, Droplets, Sun } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";


interface AdvisoryData {
  id?: string;
  uid: string;
  crop: string;
  growth_stage: string;
  problem: string;
  location: string;
  price: string;
  date: string;
  unit: string;
  soilType?: string;
  temperature?: string;
  humidity?: string;
  irrigation?: string;
  fertilizer?: string;
  pesticide?: string;
  additionalAdvice?: string;
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
  createdAt?: string;
}

export default function CropAdvisory() {
  const [advisories, setAdvisories] = useState<AdvisoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const { user } = useUser();
    const path = usePathname();
  const fetchAdvisories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/getAgriAdvisory");
      if (!response.ok) throw new Error("Failed to fetch advisory data");

      const data = await response.json();
      // ✅ Fixed: was console.error used incorrectly for success log
      console.log("✅ Fetched advisories:", data);
      setAdvisories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching advisories:", err);
      setError("Could not load advisories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed: removed undefined `advisoryInfo` from dependency array
  // This now runs once on mount, which is the correct behaviour for a dashboard
  useEffect(() => {
    fetchAdvisories();
  }, []);

  const hasAdvisories = advisories.length > 0;

  return (
    <>
     {/* ✅ HEADER STYLE */}
      <style>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;

          position: sticky;
          top: 0;
          z-index: 1000;

          width: 100%;
          background-color: #dcfce7;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(74, 222, 128, 0.1);
        }

        .left {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
        }
      `}</style>

      {/* ✅ HEADER (FULL WIDTH) */}
      <div className="header">
        <div className="left">
          <Image src="/logo.svg" alt="logo" width={30} height={30} />
          <h2 className="font-bold text-black">MY-AGRI-APP</h2>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/">
            <Button className="bg-black hover:bg-gray-500  text-white cursor-pointer">
              HOME
            </Button>
          </Link>
          {!user ? (
            <SignInButton mode="modal">
              <Button className="bg-blue-800 text-white hover:bg-blue-500">
                Get Started
              </Button>
            </SignInButton>
          ) : path === "/create-agri-advisor" ? (
            <Link href="/view-crop-advisory">
              <Button className="cursor-pointer hover:bg-gray-500 ">Advisory Dashboard</Button>
            </Link>
          ) : (
            <Link href="/create-agri-advisor">
              <Button className="hover:bg-gray-500 cursor-pointer">AgriAdvisor</Button>
            </Link>
          )}

          <UserButton />

          </div>
      </div>
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🌾 Crop Advisory Dashboard
        </motion.h1>

        {/* 🔄 Loading */}
        {loading && (
          <div className="flex justify-center items-center mt-20">
            <Loader2 className="animate-spin text-green-600 w-10 h-10" />
            <span className="ml-3 text-green-800 font-medium">
              Fetching latest advisories...
            </span>
          </div>
        )}

        {/* ❌ Error */}
        {!loading && error && (
          <div className="text-center mt-20">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchAdvisories}
              className="mt-4 px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* 📭 Empty state */}
        {!loading && !error && !hasAdvisories && (
          <p className="text-center text-gray-600 mt-20">
            No advisory data found. Please generate an advisory from AgriChatBox.
          </p>
        )}

        {/* ✅ Advisory Cards */}
        {!loading && !error && hasAdvisories && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advisories.map((advisory, index) => (
              <motion.div
                key={advisory.id || index}
                className="bg-white/80 backdrop-blur-md border border-green-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Header */}
                <div className="flex items-center mb-3">
                  <Sprout className="text-green-600 w-6 h-6 mr-2" />
                  <h2 className="text-xl font-semibold text-green-800 capitalize">
                    {advisory.crop}
                  </h2>
                </div>

                <div className="space-y-2 text-gray-700">
                  {/* 🌱 Basic Details */}
                  <p><strong>Growth Stage:</strong> {advisory.growth_stage}</p>
                  <p><strong>Problem:</strong> {advisory.problem}</p>
                  <p><strong>Location:</strong> {advisory.location}</p>
                  <p>
                    <strong>Market Price:</strong>{" "}
                    {advisory.price ? `${advisory.price} / ${advisory.unit}` : "N/A"}
                  </p>
                  <p><strong>Date:</strong> {advisory.date || "N/A"}</p>

                  {/* Optional legacy fields */}
                  {advisory.soilType && (
                    <div className="flex items-center">
                      <Leaf className="w-5 h-5 mr-2 text-lime-600" />
                      <span><strong>Soil Type:</strong> {advisory.soilType}</span>
                    </div>
                  )}
                  {advisory.temperature && (
                    <div className="flex items-center">
                      <Sun className="w-5 h-5 mr-2 text-yellow-500" />
                      <span><strong>Temperature:</strong> {advisory.temperature}</span>
                    </div>
                  )}
                  {advisory.humidity && (
                    <div className="flex items-center">
                      <Droplets className="w-5 h-5 mr-2 text-blue-500" />
                      <span><strong>Humidity:</strong> {advisory.humidity}</span>
                    </div>
                  )}
                  {advisory.irrigation && (
                    <div className="flex items-center">
                      <CloudSun className="w-5 h-5 mr-2 text-emerald-500" />
                      <span><strong>Irrigation Advice:</strong> {advisory.irrigation}</span>
                    </div>
                  )}

                  <div className="border-t border-green-100 my-3" />

                  {/* 🌿 Fertilizer Recommendations */}
                  <p className="font-semibold text-green-700">Fertilizer Recommendations:</p>
                  {advisory.recommendations.fertilizers.length > 0 ? (
                    advisory.recommendations.fertilizers.map((f, i) => (
                      <p key={i} className="ml-3 text-gray-700">
                        • {f.name} — {f.quantity} ({f.application_method})
                      </p>
                    ))
                  ) : (
                    <p className="ml-3 text-gray-500 italic">None specified</p>
                  )}

                  {/* 🐛 Pest Control */}
                  <p className="font-semibold text-red-700 mt-2">Pest Control:</p>
                  {advisory.recommendations.pest_control.length > 0 ? (
                    advisory.recommendations.pest_control.map((p, i) => (
                      <div key={i} className="ml-3 text-gray-700">
                        <p>• <strong>{p.pest_name}</strong></p>
                        <p className="ml-2">Treatment: {p.treatment}</p>
                        <p className="ml-2">Precautions: {p.precautions}</p>
                      </div>
                    ))
                  ) : (
                    <p className="ml-3 text-gray-500 italic">None specified</p>
                  )}

                  {/* 💧 Irrigation */}
                  <p className="font-semibold text-blue-600 mt-2">Irrigation Schedule:</p>
                  <p className="ml-3">
                    {advisory.recommendations.irrigation_schedule || "Not specified"}
                  </p>

                  {/* ☀️ Weather */}
                  <p className="font-semibold text-amber-600 mt-2">Weather Advice:</p>
                  <p className="ml-3">
                    {advisory.recommendations.weather_advice || "Not specified"}
                  </p>

                  {/* 🌾 Yield Tips */}
                  <p className="font-semibold text-emerald-700 mt-2">Yield Tips:</p>
                  <p className="ml-3">
                    {advisory.recommendations.yield_tips || "Not specified"}
                  </p>

                  {/* Legacy additional advice */}
                  {advisory.additionalAdvice && (
                    <p className="text-gray-700 italic mt-2">
                      💡 <strong>Additional Tip:</strong> {advisory.additionalAdvice}
                    </p>
                  )}
                </div>

                {/* Timestamp */}
                <p className="text-xs text-right text-gray-400 mt-3">
                  {advisory.createdAt
                    ? new Date(advisory.createdAt).toLocaleString()
                    : ""}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}