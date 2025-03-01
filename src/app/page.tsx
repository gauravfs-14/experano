import About from "@/components/homepage/about";
import CTA from "@/components/homepage/cta";
import Features from "@/components/homepage/features";
import Hero from "@/components/homepage/hero";
import Navbar from "@/components/navbar/default";
import UserPreferencesDisplay from "@/components/UserPreferencesDisplay";

export default function Home() {
  return (
    <>
      <Navbar />
      <UserPreferencesDisplay />
      <Hero />
      <About />
      <Features />
      <CTA />
    </>
  );
}
