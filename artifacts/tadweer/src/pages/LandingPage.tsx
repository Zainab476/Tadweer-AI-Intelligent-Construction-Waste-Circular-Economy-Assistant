import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyTadweer } from "@/components/WhyTadweer";
import { AboutSection } from "@/components/AboutSection";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <WhyTadweer />
        <AboutSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
