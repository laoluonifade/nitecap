import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import WhatIsNitecap from "@/components/WhatIsNitecap";
import Products from "@/components/Products";
import BrandBanner from "@/components/BrandBanner";
import WhyLoveIt from "@/components/WhyLoveIt";
import MeetThePotato from "@/components/MeetThePotato";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Nav />
      <Hero />
      <Marquee />
      <WhatIsNitecap />
      <BrandBanner />
      <Products />
      <WhyLoveIt />
      <MeetThePotato />
      <SocialProof />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
