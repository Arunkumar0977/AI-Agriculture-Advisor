// "use client";

// import { createContext } from "react";
// import { AdvisoryContextType } from "@/app/_components/AgriProvider";

// export const AdvisoryDetailContext = createContext<AdvisoryContextType | undefined>(undefined);


"use client";

import { createContext } from "react";
import { AdvisoryInfo } from "@/app/create-agri-advisor/_components/AgriChatBox";

// 🌾 Define the TypeScript type for the context
export type AdvisoryContextType = {
  advisoryInfo: AdvisoryInfo | null;
  setAdvisoryInfo: React.Dispatch<React.SetStateAction<AdvisoryInfo | null>>;
};

// 🌱 Create the context
export const AdvisoryDetailContext = createContext<AdvisoryContextType | undefined>(undefined);
