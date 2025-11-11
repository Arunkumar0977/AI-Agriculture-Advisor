import React from "react";
import { Sprout, Droplet, Sun, Bug, Leaf, CloudSun } from "lucide-react";

const agriSuggestions = [
  {
    title: "Crop Growth Issues",
    icon: <Sprout className="text-green-600 w-5 h-5" />,
  },
  {
    title: "Soil Fertility & Testing",
    icon: <Leaf className="text-green-600 w-5 h-5" />,
  },
  {
    title: "Irrigation & Water Management",
    icon: <Droplet className="text-green-600 w-5 h-5" />,
  },
  {
    title: "Pest & Disease Control",
    icon: <Bug className="text-green-600 w-5 h-5" />,
  },
  {
    title: "Weather-based Recommendations",
    icon: <CloudSun className="text-green-600 w-5 h-5" />,
  },
  {
    title: "Fertilizer Advice & Yield Tips",
    icon: <Sun className="text-green-600 w-5 h-5" />,
  },
];

const EmptyBoxState = ({ onselectOption }: any) => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center p-6">
      <h2 className="font-bold text-3xl text-center text-green-700">
        Start Your <strong className="text-green-600">Smart Farming</strong> with AI 🌱
      </h2>
      <p className="text-center mt-3 text-gray-500 max-w-2xl">
        Welcome to your <strong>AI Agriculture Advisor!</strong>  
        Get expert guidance on crops, soil, weather, and pest control — all tailored to your field and region.
      </p>

      <div className="mt-6 flex flex-col gap-4 w-full sm:w-2/3">
        {agriSuggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => onselectOption(suggestion.title)}
            className="flex items-center gap-3 text-gray-700 bg-green-50 border border-green-200 p-3 rounded-xl hover:bg-green-100 hover:shadow-md transition-all cursor-pointer"
          >
            {suggestion.icon}
            <h3 className="text-base font-medium">{suggestion.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyBoxState;
