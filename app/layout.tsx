import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { AdvisoryDetailProvider as AgriDetailProvider } from "@/context/AdvisoryDetailContext";



// const outfit=Outfit({subsets:['latin']})

export const metadata: Metadata = {
  title: "AI Agri Advisor",
  description: "AI Based Agricultural Advisory System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    
      <html lang="en">
        <body>
           <AgriDetailProvider>
          {children}
        </AgriDetailProvider>
          </body>
      </html>
    
    </ClerkProvider>
  );
}
