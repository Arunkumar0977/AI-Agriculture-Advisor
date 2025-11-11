// // "use client";

// // import React from "react";
// // import { Timeline } from "@/components/ui/timeline";
// // import Image from "next/image";
// // import { Leaf, ArrowLeft } from "lucide-react";
// // import { AdvisoryInfo } from "./AgriChatBox";
// // import { useAgriAdvisor } from "@/context/AdvisoryDetailContext";

// // function AdvisoryTimeline() {
// //   const { advisoryInfo } = useAgriAdvisor() ?? {};
// //   const advisoryData: AdvisoryInfo | null = advisoryInfo;

// //   const data = advisoryData
// //     ? [
// //         {
// //           title: "🌾 Crop Overview",
// //           content: (
// //             <div className="p-3 border border-green-200 rounded-xl bg-green-50">
// //               <p>
// //                 <strong>Crop:</strong> {advisoryData.crop || "N/A"}
// //               </p>
// //               <p>
// //                 <strong>Growth Stage:</strong> {advisoryData.growth_stage || "N/A"}
// //               </p>
// //               <p>
// //                 <strong>Problem Identified:</strong> {advisoryData.problem || "None"}
// //               </p>
// //               <p>
// //                 <strong>Location:</strong> {advisoryData.location || "N/A"}
// //               </p>
// //             </div>
// //           ),
// //         },

// //         {
// //           title: "🧪 Fertilizer Recommendations",
// //           content: (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //               {advisoryData.recommendations?.fertilizers?.length ? (
// //                 advisoryData.recommendations.fertilizers.map((f, index) => (
// //                   <div
// //                     key={index}
// //                     className="border border-green-300 bg-white p-4 rounded-xl shadow-sm"
// //                   >
// //                     <h3 className="font-semibold text-green-700">{f.name}</h3>
// //                     <p className="text-sm text-gray-600">
// //                       <strong>Quantity:</strong> {f.quantity}
// //                     </p>
// //                     <p className="text-sm text-gray-600">
// //                       <strong>Method:</strong> {f.application_method}
// //                     </p>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <p>No fertilizer recommendations available.</p>
// //               )}
// //             </div>
// //           ),
// //         },

// //         {
// //           title: "🐛 Pest & Disease Control",
// //           content: (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //               {advisoryData.recommendations?.pest_control?.length ? (
// //                 advisoryData.recommendations.pest_control.map((p, index) => (
// //                   <div
// //                     key={index}
// //                     className="border border-green-300 bg-white p-4 rounded-xl shadow-sm"
// //                   >
// //                     <h3 className="font-semibold text-green-700">{p.pest_name}</h3>
// //                     <p className="text-sm text-gray-600">
// //                       <strong>Treatment:</strong> {p.treatment}
// //                     </p>
// //                     <p className="text-sm text-gray-600">
// //                       <strong>Precautions:</strong> {p.precautions}
// //                     </p>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <p>No pest control information available.</p>
// //               )}
// //             </div>
// //           ),
// //         },

// //         {
// //           title: "💧 Irrigation & Weather Advice",
// //           content: (
// //             <div className="flex flex-col gap-2 border border-green-300 bg-white p-4 rounded-xl shadow-sm">
// //               <p>
// //                 <strong>Irrigation Schedule:</strong>{" "}
// //                 {advisoryData.recommendations?.irrigation_schedule || "Not specified"}
// //               </p>
// //               <p>
// //                 <strong>Weather Advice:</strong>{" "}
// //                 {advisoryData.recommendations?.weather_advice || "No updates"}
// //               </p>
// //             </div>
// //           ),
// //         },

// //         {
// //           title: "🌱 Yield Improvement Tips",
// //           content: (
// //             <div className="p-4 border border-green-300 bg-green-50 rounded-xl shadow-sm">
// //               <p>{advisoryData.recommendations?.yield_tips || "No tips available."}</p>
// //             </div>
// //           ),
// //         },
// //       ]
// //     : [];

// //   return (
// //     <div className="relative w-full overflow-auto h-[85vh] rounded-2xl bg-gradient-to-b from-green-50 to-green-100 p-2">
// //       {advisoryData ? (
// //         <Timeline data={data} />
// //       ) : (
// //         <div className="relative w-full h-full">
// //           <h2 className="flex gap-2 text-2xl md:text-3xl items-center left-10 absolute bottom-10 font-bold text-green-800">
// //             <ArrowLeft className="text-green-700" />
// //             Gathering your crop details for expert advice...
// //           </h2>
// //           <Image
// //             src="/agri-bg.jpg"
// //             alt="Farming background"
// //             width={800}
// //             height={800}
// //             className="w-full h-full object-cover rounded-3xl"
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default AdvisoryTimeline;


// import React from 'react'
// import { Timeline } from '@/components/ui/timeline';
// function AdvisoryTimeline() {

  
//   const data = [
//     {
//       title: "2024",
//       content: (
//         <div>
//           <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
//             Built and launched Aceternity UI and Aceternity UI Pro from scratch
//           </p>
//           <div className="grid grid-cols-2 gap-4">
//             <img
//               src="https://assets.aceternity.com/templates/startup-1.webp"
//               alt="startup template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//             <img
//               src="https://assets.aceternity.com/templates/startup-2.webp"
//               alt="startup template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//             <img
//               src="https://assets.aceternity.com/templates/startup-3.webp"
//               alt="startup template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//             <img
//               src="https://assets.aceternity.com/templates/startup-4.webp"
//               alt="startup template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Early 2023",
//       content: (
//         <div>
//           <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
//             I usually run out of copy, but when I see content this big, I try to
//             integrate lorem ipsum.
//           </p>
//           <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
//             Lorem ipsum is for people who are too lazy to write copy. But we are
//             not. Here are some more example of beautiful designs I built.
//           </p>
//           <div className="grid grid-cols-2 gap-4">
//             <img
//               src="https://assets.aceternity.com/pro/hero-sections.png"
//               alt="hero template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//             <img
//               src="https://assets.aceternity.com/features-section.png"
//               alt="feature template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//             <img
//               src="https://assets.aceternity.com/pro/bento-grids.png"
//               alt="bento template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//             <img
//               src="https://assets.aceternity.com/cards.png"
//               alt="cards template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Changelog",
//       content: (
//         <div>
//           <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
//             Deployed 5 new components on Aceternity today
//           </p>
//           <div className="mb-8">
//             <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
//               ✅ Card grid component
//             </div>
//             <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
//               ✅ Startup template Aceternity
//             </div>
//             <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
//               ✅ Random file upload lol
//             </div>
//             <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
//               ✅ Himesh Reshammiya Music CD
//             </div>
//             <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
//               ✅ Salman Bhai Fan Club registrations open
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <img
//               src="https://assets.aceternity.com/pro/hero-sections.png"
//               alt="hero template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//             <img
//               src="https://assets.aceternity.com/features-section.png"
//               alt="feature template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//             <img
//               src="https://assets.aceternity.com/pro/bento-grids.png"
//               alt="bento template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//             <img
//               src="https://assets.aceternity.com/cards.png"
//               alt="cards template"
//               width={500}
//               height={500}
//               className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
//             />
//           </div>
//         </div>
//       ),
//     },
//   ];
//   return (
//     <div className="relative w-full overflow-clip">
//       <Timeline data={data} />
//     </div>
//   );
// }

// export default AdvisoryTimeline
