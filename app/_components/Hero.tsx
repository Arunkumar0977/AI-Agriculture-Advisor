"use client";
import React from 'react'
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { ArrowDown, Leaf, Droplets, Sun, Sprout, Send, BarChart3 } from 'lucide-react';
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Agriculture Suggestions
export const agriSuggestions = [
  {
    title: "Crop Recommendations",
    icon: <Sprout className='text-green-500 h-5 w-5' />,
  },
  {
    title: "Weather & Irrigation Tips",
    icon: <Droplets className='text-blue-400 h-5 w-5' />,
  },
  {
    title: "Soil Health Analysis",
    icon: <Leaf className='text-emerald-500 h-5 w-5' />,
  },
  {
    title: "Market Price Trends",
    icon: <BarChart3 className='text-yellow-500 h-5 w-5' />,
  },
  {
    title: "Seasonal Crop Guide",
    icon: <Sun className='text-orange-400 h-5 w-5' />,
  },
];

const Hero = () => {
  const { user } = useUser();
  const router = useRouter();

  const onSend = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    console.log("Agriculture query submitted!");
    router.push('/ask-agri-advisor');
  };

  return (
    <div className='mt-24 w-full flex justify-center'>
      {/* Content */}
      <div className='max-w-3xl w-full text-center space-y-6'>
        <h1 className="text-xl md:text-5xl font-bold whitespace-nowrap">
          Hey, I'm Your <span className="text-primary">Agri Advisor</span>
        </h1>

        <p className='text-lg'>
          Get personalized help for your farming needs — from crop selection, weather advice, soil health, to market insights.
        </p>

        {/* Input Box */}
        <div>
          <div className='border rounded-2xl p-4 relative'>
            <Textarea
              placeholder='Ask me about your crops, soil, or farming issues...'
              className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
            />
            <Button
              size={'icon'}
              className='absolute bottom-6 right-6 cursor-pointer'
              onClick={onSend}
            >
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        <div className='flex gap-5 flex-wrap justify-center'>
          {agriSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className='flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg hover:bg-muted/10 transition-all cursor-pointer'
            >
              {suggestion.icon}
              <h2 className='text-xs'>{suggestion.title}</h2>
            </div>
          ))}
        </div>

        <h2 className='my-7 mt-14 flex gap-2 text-center justify-center items-center'>
          Not sure where to start? <strong>See how it works</strong>
          <ArrowDown />
        </h2>

        {/* Video Section */}
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/TTf_VXparLY?list=PLhSkX0eBPxupX-j-ZaMhr1kGsStDkil9c" // Replace with your Agri demo video
          thumbnailSrc="https://res.cloudinary.com/dwxpubhrv/images/f_auto,q_auto:eco/v1716854573/The-Role-of-Technology-in-Climate-Smart-Agriculture_248608491f7/The-Role-of-Technology-in-Climate-Smart-Agriculture_248608491f7.png?_i=AA"
          thumbnailAlt="Agri Advisor Demo Video"
        />
      </div>
    </div>
  );
};

export default Hero;
