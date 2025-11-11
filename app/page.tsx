import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { PopularAgriList } from "./_components/PopularAgriList";


export default function Home() {
  return (
    <div>
    <Header/>
    <Hero/>
    <PopularAgriList/>
    </div>
  );
}
