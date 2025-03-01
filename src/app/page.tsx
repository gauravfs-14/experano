import About from "@/components/homepage/about";
import CTA from "@/components/homepage/cta";
import Features from "@/components/homepage/features";
import Hero from "@/components/homepage/hero";
import Navbar from "@/components/navbar/default";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <CTA />
    </>
  );
}
