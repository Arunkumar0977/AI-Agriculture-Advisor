import { Leaf, Sprout, ClipboardList } from "lucide-react";
import React from "react";

function FinalUi({ viewAdvice, disable }: { viewAdvice: () => void; disable: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center mt-6 p-6 bg-green-50 border border-green-200 rounded-2xl shadow-md">
      <div className="flex items-center justify-center bg-green-100 rounded-full p-4">
        <Sprout className="text-green-600 text-4xl animate-bounce" />
      </div>

      <h2 className="mt-3 text-lg font-semibold text-green-700">
        Preparing Your Smart Crop Advisory 🌾
      </h2>

      <p className="text-gray-600 text-center mt-1 text-sm">
        Gathering soil data, pest information, and weather recommendations for your field...
      </p>

      <button
        disabled={disable}
        onClick={viewAdvice}
        className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white transition-all ${
          disable
            ? "bg-green-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        {disable ? "Generating..." : "View Crop Advisory"}
      </button>
    </div>
  );
}

export default FinalUi;
