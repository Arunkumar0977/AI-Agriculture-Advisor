"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {ArrowDown,Leaf,  Sprout, Send, BarChart3, Bug,} from "lucide-react";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const agriSuggestions = [
  {
    title: "Crop Recommendations",
    route: "/crop-recommendation",
    icon: <Sprout className="text-green-500 h-5 w-5" />,
  },
  {
    title: "Disease Detection",
    route: "/disease-detection",
    icon: <Bug className="text-blue-400 h-5 w-5" />,
  },
  {
    title: "Soil Health Analysis",
    route: "/soil-analysis",
    icon: <Leaf className="text-emerald-500 h-5 w-5" />,
  },
  {
    title: "Market Price Trends",
    route: "/Market",   
    icon: <BarChart3 className="text-yellow-500 h-5 w-5" />,     
  },
  // {
  //   title: "Seasonal Crop Guide",
  //   route: "/seasonal-guide",
  //   icon: <Sun className="text-orange-400 h-5 w-5" />,
  // },
];

const Hero = () => {
  const { user } = useUser();
  const router = useRouter();
  
  const checkAuthAndRedirect = (route: string) => {
  if (!user) 
    {
    router.push('Auth/sign-in');
    return;
  }
  router.push(route);
};

  const onSend = () => {
    if (!user) {
      router.push('Auth/sign-in');
      return;
    }
    router.push('/create-agri-advisor');  
  };

  return (
    <div className="mt-24 w-full flex justify-center">
      <div className="max-w-3xl w-full text-center space-y-6">

        {/* Title */}
        <h1 className="text-xl md:text-5xl font-bold whitespace-nowrap">
         {"Hey, I'm Your"} <span className="text-green-500">Agri Advisor</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg">
          Get personalized help for your farming needs — from crop selection,
          weather advice, soil health, to market insights.
        </p>

        {/* Input Box */}
        <div className="border rounded-2xl p-4 relative bg-emerald-50">
          <Textarea 
            placeholder="Ask me about your crops, soil, or farming issues..."
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
          />
          <Button
            size="icon"
            className="absolute bottom-6 right-6 cursor-pointer bg-red-500"
            onClick={onSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggestions */}
        <div className="flex gap-5 flex-wrap justify-center">
          {agriSuggestions.map((item, index) => (
            <div
              key={index}
              onClick={() => checkAuthAndRedirect(item.route)}
              className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg hover:bg-muted/10 transition-all cursor-pointer hover:scale-105"
            >
              {item.icon}
              <h2 className="text-xs font-medium">{item.title}</h2>
            </div>
          ))}
        </div>

        <h2 className="my-7 mt-14 flex gap-2 justify-center items-center">
          Not sure where to start? <strong>See how it works</strong>
          <ArrowDown />
        </h2>

        {/* Video */}
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/TTf_VXparLY"
          thumbnailSrc="https://res.cloudinary.com/dwxpubhrv/images/f_auto,q_auto:eco/v1716854573/The-Role-of-Technology-in-Climate-Smart-Agriculture_248608491f7/The-Role-of-Technology-in-Climate-Smart-Agriculture_248608491f7.png"
          thumbnailAlt="Agri Advisor Demo Video"
        />
      </div>
    </div>
  );
};

export default Hero;