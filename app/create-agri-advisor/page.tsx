"use client";

import React from "react";
import AdvisoryTimeline from "./_components/AdvisoryTimeline";
import AgriChatBox from "./_components/AgriChatBox";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

function CreateAgriAdvisor() {
  const { user } = useUser();
  const path = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* ✅ RESPONSIVE HEADER */}
      <header className="sticky top-0 z-50 w-full bg-green-100/90 backdrop-blur-md border-b border-green-400/20 px-3 py-3 sm:px-6 sm:py-4 flex justify-between items-center shadow-sm">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={28} height={28} className="w-6 h-6 sm:w-8 sm:h-8" />
          <h2 className="font-bold text-black text-sm sm:text-lg  xs:block">
            MY-AGRI-APP
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/">
            <Button className="cursor-pointer hover:bg-gray-200 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm" variant="outline">
              HOME
            </Button>
          </Link>

          {!user ? (
            <SignInButton mode="modal">
              <Button className="bg-blue-800 text-white hover:bg-blue-600 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
                Get Started
              </Button>
            </SignInButton>
          ) : path === "/create-agri-advisor" ? (
            <Link href="/view-crop-advisory">
              <Button className="cursor-pointer hover:bg-gray-200 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm" variant="outline">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/create-agri-advisor">
              <Button className="h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
                Agri Advisor
              </Button>
            </Link>
          )}

          <div className="ml-1 sm:ml-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* ✅ MAIN CONTENT */}
      {/* On mobile, this will stack (Chat on top, Timeline below). On desktop (md), it splits 50/50. */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 h-full">
          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] md:h-[calc(100vh-8rem)]">
            <AgriChatBox />
          </div>

          {/* Timeline Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] md:h-[calc(100vh-8rem)]">
            <AdvisoryTimeline />
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateAgriAdvisor;