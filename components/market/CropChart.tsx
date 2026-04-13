'use client'; // Client-side component

import React from 'react'; // Import React
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'; // Chart lib

// Props definition
type Props = {
  title: string; // Chart title
  data: { date: string; price: number }[]; // Data
};

// Chart component
export default function CropChart({ title, data }: Props) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition">
      <h2 className="text-lg font-semibold mb-4 text-green-700">{title}</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#15803d" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}