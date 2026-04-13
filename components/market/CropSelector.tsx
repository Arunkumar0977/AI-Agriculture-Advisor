'use client'; // Client component

import React from 'react'; // Import React

// Props definition
type Props = {
  selectedCrop: string; // Current crop
  setSelectedCrop: (crop: string) => void; // Update function
};

// Crop selector UI
export default function CropSelector({ selectedCrop, setSelectedCrop }: Props) {
  const crops = ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton']; // Crop list

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {crops.map((crop) => (
        <button
          key={crop}
          onClick={() => setSelectedCrop(crop)}
          className={`px-5 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
            selectedCrop === crop
              ? 'bg-green-700 text-white shadow-lg scale-105'
              : 'bg-white border hover:bg-green-100'
          }`}
        >
          {crop}
        </button>
      ))}
    </div>
  );
}