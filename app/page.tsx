import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import USP from "@/components/USP";
import Impact from "@/components/Impact";
import Technology from "@/components/Technology";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAF8] text-[#111827] selection:bg-[#D8F3DC] selection:text-[#1B4332]">
        <Hero />
        <Features />
        <HowItWorks />
        <USP />
        <Impact />
        <Technology />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
