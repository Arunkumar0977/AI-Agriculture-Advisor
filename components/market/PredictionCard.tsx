'use client'; // Client component

import React from 'react'; // Import React

// Props type
type Props = {
  data: { date: string; price: number }[]; // Prediction data
};

// Prediction UI
export default function PredictionCard({ data }: Props) {
  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-green-800 mb-4">
        🤖 AI Predicted Prices (Next Days)
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-green-50 p-3 rounded-lg text-center shadow-sm">
            <p className="text-sm text-gray-600">{item.date}</p>
            <p className="text-lg font-semibold text-green-700">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}