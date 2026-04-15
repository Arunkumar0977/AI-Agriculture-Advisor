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
      console.log("✅ Fetched advisories:", data);
      setAdvisories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching advisories:", err);
      setError("Could not load advisories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const hasAdvisories = advisories.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100">
      
      {/* ✅ RESPONSIVE HEADER */}
      <header className="sticky top-0 z-50 w-full bg-green-100/90 backdrop-blur-md border-b border-green-400/20 px-3 py-3 sm:px-6 sm:py-4 flex justify-between items-center shadow-sm">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={28} height={28} className="w-6 h-6 sm:w-8 sm:h-8" />
          <h2 className="font-bold text-black text-sm sm:text-lg  sm:block">
            MY-AGRI-APP
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/">
            <Button className="cursor-pointer  hover:bg-gray-200 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm" variant="outline">
              HOME
            </Button>
          </Link>

          {!user ? (
            <SignInButton mode="modal">
              <Button className="bg-blue-800 text-white hover:bg-blue-600 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
                Get Started
              </Button>
            </SignInButton>
          ) : path === "/create-agri-advisor" ? (
            <Link href="/view-crop-advisory">
              <Button className="cursor-pointer hover:bg-gray-200 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm" variant="outline">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/create-agri-advisor">
              <Button className="cursor-pointer hover:bg-gray-200 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm" variant="outline">
                Agri Advisor
              </Button>
            </Link>
          )}

          <div className="ml-1 sm:ml-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🌾 Crop Advisory Dashboard
          </motion.h1>

          {/* 🔄 Loading */}
          {loading && (
            <div className="flex justify-center items-center mt-16 sm:mt-20">
              <Loader2 className="animate-spin text-green-600 w-8 h-8 sm:w-10 sm:h-10" />
              <span className="ml-3 text-green-800 font-medium text-sm sm:text-base">
                Fetching latest advisories...
              </span>
            </div>
          )}

          {/* ❌ Error */}
          {!loading && error && (
            <div className="text-center mt-16 sm:mt-20 px-4">
              <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
              <button
                onClick={fetchAdvisories}
                className="mt-4 px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          )}

          {/* 📭 Empty state */}
          {!loading && !error && !hasAdvisories && (
            <p className="text-center text-gray-600 mt-16 sm:mt-20 px-4 text-sm sm:text-base">
              No advisory data found. Please generate an advisory from the Agri Advisor tool.
            </p>
          )}

          {/* ✅ Advisory Cards */}
          {!loading && !error && hasAdvisories && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {advisories.map((advisory, index) => (
                <motion.div
                  key={advisory.id || index}
                  className="bg-white/80 backdrop-blur-md border border-green-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Header */}
                  <div className="flex items-center mb-3 sm:mb-4">
                    <Sprout className="text-green-600 w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
                    <h2 className="text-lg sm:text-xl font-semibold text-green-800 capitalize line-clamp-1">
                      {advisory.crop}
                    </h2>
                  </div>

                  <div className="space-y-2 text-sm sm:text-base text-gray-700">
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
                      <div className="flex items-start sm:items-center mt-1">
                        <Leaf className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 sm:mt-0 text-lime-600 flex-shrink-0" />
                        <span><strong>Soil Type:</strong> {advisory.soilType}</span>
                      </div>
                    )}
                    {advisory.temperature && (
                      <div className="flex items-start sm:items-center mt-1">
                        <Sun className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 sm:mt-0 text-yellow-500 flex-shrink-0" />
                        <span><strong>Temperature:</strong> {advisory.temperature}</span>
                      </div>
                    )}
                    {advisory.humidity && (
                      <div className="flex items-start sm:items-center mt-1">
                        <Droplets className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 sm:mt-0 text-blue-500 flex-shrink-0" />
                        <span><strong>Humidity:</strong> {advisory.humidity}</span>
                      </div>
                    )}
                    {advisory.irrigation && (
                      <div className="flex items-start sm:items-center mt-1">
                        <CloudSun className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 sm:mt-0 text-emerald-500 flex-shrink-0" />
                        <span><strong>Irrigation Advice:</strong> {advisory.irrigation}</span>
                      </div>
                    )}

                    <div className="border-t border-green-200 my-3 sm:my-4" />

                    {/* 🌿 Fertilizer Recommendations */}
                    <p className="font-semibold text-green-700">Fertilizer Recommendations:</p>
                    {advisory.recommendations?.fertilizers?.length > 0 ? (
                      <ul className="list-disc ml-5 space-y-1 text-gray-700">
                        {advisory.recommendations.fertilizers.map((f, i) => (
                          <li key={i}>
                            {f.name} — {f.quantity} ({f.application_method})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="ml-2 text-gray-500 italic">None specified</p>
                    )}

                    {/* 🐛 Pest Control */}
                    <p className="font-semibold text-red-700 mt-3">Pest Control:</p>
                    {advisory.recommendations?.pest_control?.length > 0 ? (
                      <div className="space-y-2">
                        {advisory.recommendations.pest_control.map((p, i) => (
                          <div key={i} className="ml-2 bg-red-50/50 p-2 rounded-lg border border-red-100">
                            <p className="font-medium text-red-800">• {p.pest_name}</p>
                            <p className="ml-3 text-xs sm:text-sm"><strong>Treatment:</strong> {p.treatment}</p>
                            <p className="ml-3 text-xs sm:text-sm"><strong>Precautions:</strong> {p.precautions}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="ml-2 text-gray-500 italic">None specified</p>
                    )}

                    {/* 💧 Irrigation */}
                    <p className="font-semibold text-blue-600 mt-3">Irrigation Schedule:</p>
                    <p className="ml-2">
                      {advisory.recommendations?.irrigation_schedule || "Not specified"}
                    </p>

                    {/* ☀️ Weather */}
                    <p className="font-semibold text-amber-600 mt-3">Weather Advice:</p>
                    <p className="ml-2">
                      {advisory.recommendations?.weather_advice || "Not specified"}
                    </p>

                    {/* 🌾 Yield Tips */}
                    <p className="font-semibold text-emerald-700 mt-3">Yield Tips:</p>
                    <p className="ml-2">
                      {advisory.recommendations?.yield_tips || "Not specified"}
                    </p>

                    {/* Legacy additional advice */}
                    {advisory.additionalAdvice && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-3">
                        <p className="text-gray-700 text-sm">
                          💡 <strong>Additional Tip:</strong> {advisory.additionalAdvice}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-right text-gray-400 mt-4 pt-3 border-t border-gray-100">
                    {advisory.createdAt
                      ? new Date(advisory.createdAt).toLocaleString()
                      : ""}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}