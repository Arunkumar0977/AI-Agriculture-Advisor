// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { SignInButton, UserButton } from "@clerk/nextjs";
// import { useUser } from "@clerk/nextjs";
// import { usePathname } from "next/navigation";

// const menuOptions = [
//   { name: "Home", path: "/" },
//   { name: "Pricing", path: "/pricing" },
//   { name: "Contact Us", path: "/contact-us" },
// ];

// const Header = () => {
//   const { user } = useUser();
//   const path = usePathname();
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="bg-green-100 sticky top-0 z-50 shadow-sm">
      
//       {/* Top Bar */}
//       <div className="flex justify-between items-center p-4">
        
//         {/* Logo */}
//         <div className="flex gap-2 items-center">
//           <Image src="/logo.svg" alt="logo" width={30} height={30} />
//           <h2 className="font-bold text-sm sm:text-lg">MY-AGRI-APP</h2>
//         </div>

//         {/* Desktop Menu */}
//         <nav className="hidden md:flex gap-8 items-center">
//           {menuOptions.map((menu) => (
//             <Link key={menu.path} href={menu.path}>
//               <h2 className="text-lg hover:scale-105 transition">
//                 {menu.name}
//               </h2>
//             </Link>
//           ))}
//         </nav>

//         {/* Desktop Buttons */}
//         <div className="hidden md:flex gap-4 items-center">
//           {!user ? (
//             <SignInButton mode="modal">
//               <Button className="bg-blue-800 text-white hover:bg-blue-500">
//                 Get Started
//               </Button>
//             </SignInButton>
//           ) : path === "/create-agri-advisor" ? (
//             <Link href="/view-crop-advisory">
//               <Button>Dashboard</Button>
//             </Link>
//           ) : (
//             <Link href="/create-agri-advisor">
//               <Button>Agri Advisor</Button>
//             </Link>
//           )}
//           <UserButton />
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-2xl"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           ☰
//         </button>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="md:hidden flex flex-col gap-4 p-4 border-t bg-green-50">
          
//           {menuOptions.map((menu) => (
//             <Link key={menu.path} href={menu.path} onClick={() => setIsOpen(false)}>
//               <p className="text-lg">{menu.name}</p>
//             </Link>
//           ))}

//           {!user ? (
//             <SignInButton mode="modal">
//               <Button className="w-full bg-blue-800 text-white">
//                 Get Started
//               </Button>
//             </SignInButton>
//           ) : path === "/create-agri-advisor" ? (
//             <Link href="/view-crop-advisory">
//               <Button className="w-full">Dashboard</Button>
//             </Link>
//           ) : (
//             <Link href="/create-agri-advisor">
//               <Button className="w-full">Agri Advisor</Button>
//             </Link>
//           )}

//           <div className="mt-2">
//             <UserButton />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Header;
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact-us" },
];

const Header = () => {
  const { user } = useUser();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-green-100 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={28} height={28} />
          <h2 className="font-bold text-sm sm:text-lg">MY-AGRI-APP</h2>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8">
          {menuOptions.map((menu) => (
            <Link key={menu.path} href={menu.path}>
              <span
                className={`text-base lg:text-lg transition-colors hover:text-green-700 ${
                  path === menu.path ? "text-green-700 font-semibold" : ""
                }`}
              >
                {menu.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <SignInButton mode="modal">
              <Button className="bg-blue-800 text-white hover:bg-blue-700 text-sm px-4 py-2">
                Get Started
              </Button>
            </SignInButton>
          ) : path === "/create-agri-advisor" ? (
            <Link href="/view-crop-advisory">
              <Button className="text-sm px-4 py-2">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/create-agri-advisor">
              <Button className="text-sm px-4 py-2">Agri Advisor</Button>
            </Link>
          )}
          <UserButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-4 py-3 bg-green-50 border-t">
          {menuOptions.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              onClick={() => setIsOpen(false)}
            >
              <span
                className={`block text-base py-2 ${
                  path === menu.path ? "text-green-700 font-semibold" : "text-gray-700"
                }`}
              >
                {menu.name}
              </span>
            </Link>
          ))}

          {!user ? (
            <SignInButton mode="modal">
              <Button className="w-full bg-blue-800 text-white text-sm py-2">
                Get Started
              </Button>
            </SignInButton>
          ) : path === "/create-agri-advisor" ? (
            <Link href="/view-crop-advisory">
              <Button className="w-full text-sm py-2">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/create-agri-advisor">
              <Button className="w-full text-sm py-2">Agri Advisor</Button>
            </Link>
          )}

          <div className="pt-2">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;