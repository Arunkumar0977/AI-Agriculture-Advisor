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
    <>
      {/* ✅ HEADER STYLE */}
      <style>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;

          position: sticky;
          top: 0;
          z-index: 1000;

          width: 100%;
          background-color: #dcfce7;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(74, 222, 128, 0.1);
        }

        .left {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
        }
      `}</style>

      {/* ✅ HEADER (FULL WIDTH) */}
      <div className="header">
        <div className="left">
          <Image src="/logo.svg" alt="logo" width={30} height={30} />
          <h2 className="font-bold text-black">MY-AGRI-APP</h2>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/">
            <Button className="bg-black hover:bg-gray-500 text-white cursor-pointer">
              HOME
            </Button>
          </Link>

          {!user ? (
            <SignInButton mode="modal">
              <Button className="bg-blue-800 text-white hover:bg-blue-500">
                Get Started
              </Button>
            </SignInButton>
          ) : path === "/create-agri-advisor" ? (
            <Link href="/view-crop-advisory">
              <Button className="cursor-pointer hover:bg-gray-500 ">Advisory Dashboard</Button>
            </Link>
          ) : (
            <Link href="/create-agri-advisor">
              <Button>Agri Advisor</Button>
            </Link>
          )}

          <UserButton />
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
        <div>
          <AgriChatBox />
        </div>

        <div>
          <AdvisoryTimeline />
        </div>
      </div>
    </>
  );
}

export default CreateAgriAdvisor;