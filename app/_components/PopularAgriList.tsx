"use client";

import Carousel from "@/components/ui/carousel";
export function PopularAgriList() {
  const slideData = [
    {
      title: "Rice ",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1600387845879-a4713f764110?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    },
    {
      title: "Wheat",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1676172949047-fe6c317df17d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735https://images.unsplash.com/photo-1684154740378-49d4ec79ccdb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    },
    {
      title: "Smart Plantation",
      button: "Explore Component",
      src: "https://plus.unsplash.com/premium_photo-1667518332091-c12353d23a45?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1172",
    },
    {
      title: "Smart farming",
      button: "Explore Component",
      src: "https://plus.unsplash.com/premium_photo-1682092696500-e33f42081cf7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    },
  ];
  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      <Carousel slides={slideData} />
    </div>
  );
}
