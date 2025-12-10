"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact" },
];

const Header = () => {
  const { user } = useUser();
  const path = usePathname();

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className="flex gap-2 items-center">
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <h2 className="font-bold text-xl">MY-AGRI-APP</h2>
      </div>

      {/* Menu Options */}
      <nav className="flex gap-8 items-center">
        {menuOptions.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2
              className={`text-lg transition hover:scale-105 ${
                path === menu.path
                  ? "text-green-600 font-semibold" 
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {menu.name}
            </h2>
          </Link>
        ))}
      </nav>

      {/* Auth Buttons */}
     <div>
  {user ? (
    <>
      {/* Show Agri Advisor only after sign in */}
      <Link href="/create-agri-advisor" className="ml-8">
        <Button className="cursor-pointer">Agri Advisor</Button>
      </Link>
      <UserButton/>
    </>
  ) : (
    <>
      <SignInButton mode="modal">
        <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
      </SignInButton>
      
    </>
    
  )}
</div>

      
    </header>
  );
};

export default Header;
