"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AdvisoryInfo } from "@/app/create-agri-advisor/_components/AgriChatBox"; // adjust if your path differs

export type AdvisoryContextType = {
  advisoryInfo: AdvisoryInfo | null;
  setAdvisoryInfo: React.Dispatch<React.SetStateAction<AdvisoryInfo | null>>;
};

export const AdvisoryDetailContext = createContext<AdvisoryContextType | undefined>(undefined);

export function AdvisoryDetailProvider({ children }: { children: ReactNode }) {
  const [advisoryInfo, setAdvisoryInfo] = useState<AdvisoryInfo | null>(null);

  const value: AdvisoryContextType = {
    advisoryInfo,
    setAdvisoryInfo,
  };

  return (
    <AdvisoryDetailContext.Provider value={value}>
      {children}
    </AdvisoryDetailContext.Provider>
  );
}

/**
 * Option A: custom hook that throws if used outside provider.
 * This matches the pattern you chose earlier.
 */
export function useAgriAdvisor() {
  const ctx = useContext(AdvisoryDetailContext);
  if (!ctx) throw new Error("useAgriAdvisor must be used inside AdvisoryDetailProvider");
  return ctx;
}
