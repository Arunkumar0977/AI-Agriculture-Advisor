// "use client";
// import React, { use } from 'react'
// import Image from 'next/image';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { SignInButton, UserButton } from '@clerk/nextjs';
// import { useUser } from '@clerk/nextjs';
// import { usePathname } from 'next/navigation';

// const menuOptions = [
//     {
//         name: 'Home',
//         path: '/'
//     },
//     {
//         name: 'Pricing',
//         path: '/pricing'
//     },
//     {
//         name: 'Contact Us',
//         path: '/contact'
//     } ]

// const Header = () => {
// const {user} = useUser();
// const path=usePathname();
// console.log(path)

// return (
//     <div className='flex justify-between items-center p-4 bg-green-100 sticky top-0 z-50 shadow-sm'>
//       {/*logo*/}
//       <div className='flex gap-2 items-center'>
//       <Image src={'/logo.svg'} alt='logo' width={30} height={30}/>
//       <h2 className='font-bold'>MY-AGRI-APP</h2>
      
//       </div>
//       {/*Menu options*/}
//       <div className='flex gap-8 items-center'>
//         {menuOptions.map((menu) => (
//             <Link href={menu.path}>
//                 <h2 className='text-lg hover:scale-105 transition'>{menu.name}</h2>
//             </Link>
//         ))}
//       </div>
//       <div className='flex gap-4 items-center'>
//       {!user? <SignInButton mode='modal'>
//       <Button className='bg-blue-800 text-white hover:bg-blue-500 transition'>Get Started</Button>
//       </SignInButton>:
//       path=='/create-agri-advisor'?
//       <Link href='/view-crop-advisory'>
//       <Button className='cursor-pointer'>Advisory Dashboard</Button>
//       </Link>
//       :
//       <Link href='/create-agri-advisor'>
//       <Button className='cursor-pointer'>Agri Advisor</Button>
//       </Link>
//       }
//       <UserButton/>
//       </div>
//     </div>
//   )
// }

// export default Header


"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const menuOptions = [
  { name: "Home",       path: "/"        },
  { name: "Pricing",   path: "/pricing"  },
  { name: "Contact Us",path: "/contact-us"  },
];

const Header = () => {
  const { user } = useUser();
  const path = usePathname();

  return (
    <div className="flex justify-between items-center p-4 bg-green-100 sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <div className="flex gap-2 items-center">
        <Image src="/logo.svg" alt="MY-AGRI-APP logo" width={30} height={30} priority />
        <h2 className="font-bold">MY-AGRI-APP</h2>
      </div>

      {/* Menu options */}
      <nav className="flex gap-8 items-center">
        {menuOptions.map((menu) => (
          <Link key={menu.path} href={menu.path}>
            <h2 className="text-lg hover:scale-105 transition">{menu.name}</h2>
          </Link>
        ))}
      </nav>

      {/* Auth / CTA */}
      <div className="flex gap-4 items-center">
        {!user ? (
          <SignInButton mode="modal">
            <Button className="bg-blue-800 text-white hover:bg-blue-500 transition">
              Get Started
            </Button>
          </SignInButton>
        ) : path === "/create-agri-advisor" ? (
          <Link href="/view-crop-advisory">
            <Button className="cursor-pointer">Advisory Dashboard</Button>
          </Link>
        ) : (
          <Link href="/create-agri-advisor">
            <Button className="cursor-pointer">Agri Advisor</Button>
          </Link>
        )}
        <UserButton />
      </div>
    </div>
  );
};

export default Header;