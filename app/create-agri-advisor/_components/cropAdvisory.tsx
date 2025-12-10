// "use client";

// import React, { useEffect, useState } from "react";
// import { Loader2, Sprout, CloudSun, Leaf, Droplets, Sun } from "lucide-react";
// import { motion } from "framer-motion";

// interface AdvisoryData {
//   id?: string;
//   uid: string;
//   crop: string;
//   soilType: string;
//   temperature: string;
//   humidity: string;
//   irrigation: string;
//   fertilizer: string;
//   pesticide: string;
//   additionalAdvice: string;
//   createdAt?: string;
// }

// export default function CropAdvisory() {
//   const [advisories, setAdvisories] = useState<AdvisoryData[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAdvisories = async () => {
//     try {
//       const response = await fetch("/api/aimoodel");
//       if (!response.ok) throw new Error("Failed to fetch advisory data");
//       const data = await response.json();
//       setAdvisories(data);
//     } catch (error) {
//       console.error("Error fetching advisories:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAdvisories();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         <motion.h1
//           className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-6"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           🌾 Crop Advisory Dashboard
//         </motion.h1>

//         {loading ? (
//           <div className="flex justify-center items-center mt-20">
//             <Loader2 className="animate-spin text-green-600 w-10 h-10" />
//             <span className="ml-3 text-green-800 font-medium">
//               Fetching latest advisories...
//             </span>
//           </div>
//         ) : advisories.length === 0 ? (
//           <p className="text-center text-gray-600 mt-20">
//             No advisory data found. Please generate advisory from AgriChatBox.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {advisories.map((advisory, index) => (
//               <motion.div
//                 key={index}
//                 className="bg-white/80 backdrop-blur-md border border-green-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <div className="flex items-center mb-3">
//                   <Sprout className="text-green-600 w-6 h-6 mr-2" />
//                   <h2 className="text-xl font-semibold text-green-800 capitalize">
//                     {advisory.crop}
//                   </h2>
//                 </div>

//                 <div className="space-y-2 text-gray-700">
//                   <div className="flex items-center">
//                     <Leaf className="w-5 h-5 mr-2 text-lime-600" />
//                     <span>
//                       <strong>Soil Type:</strong> {advisory.soilType}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <Sun className="w-5 h-5 mr-2 text-yellow-500" />
//                     <span>
//                       <strong>Temperature:</strong> {advisory.temperature}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <Droplets className="w-5 h-5 mr-2 text-blue-500" />
//                     <span>
//                       <strong>Humidity:</strong> {advisory.humidity}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <CloudSun className="w-5 h-5 mr-2 text-emerald-500" />
//                     <span>
//                       <strong>Irrigation Advice:</strong> {advisory.irrigation}
//                     </span>
//                   </div>

//                   <div className="border-t border-green-100 my-3"></div>

//                   <p>
//                     <strong>Fertilizer Recommendation:</strong>{" "}
//                     <span className="text-green-700">{advisory.fertilizer}</span>
//                   </p>
//                   <p>
//                     <strong>Pesticide Advice:</strong>{" "}
//                     <span className="text-red-700">{advisory.pesticide}</span>
//                   </p>
//                   <p className="text-gray-700 italic">
//                     💡 <strong>Additional Tip:</strong>{" "}
//                     {advisory.additionalAdvice}
//                   </p>
//                 </div>

//                 <p className="text-xs text-right text-gray-400 mt-3">
//                   {new Date(advisory.createdAt || "").toLocaleString()}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
