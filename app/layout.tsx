import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { AdvisoryDetailProvider as AgriDetailProvider } from "@/context/AdvisoryDetailContext";

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
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="min-h-screen bg-white font-sans text-base leading-relaxed">
          <div className="flex min-h-screen flex-col">
            <AgriDetailProvider>
              <main className="flex-1">{children}</main>
            </AgriDetailProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}