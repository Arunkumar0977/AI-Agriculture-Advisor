import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { PopularAgriList } from "./_components/PopularAgriList";
import Pricing from "./pricing/page";


export default function Home() {
  return (
    <div>
    <Header/>
    <Hero/>
    <PopularAgriList/>
    </div>
  );
}
