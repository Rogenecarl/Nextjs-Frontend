import HeroSection from "@/components/landingpage/hero-section";
import FeaturesSection from "@/components/landingpage/features-section";
import HowItWorks from "@/components/landingpage/how-it-works";
import StatsSection from "@/components/landingpage/stats-section";
import TestimonialsSection from "@/components/landingpage/testimonials-section";
import CTASection from "@/components/landingpage/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">

      {/* Radial Gradient Background from Bottom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
       linear-gradient(to right, #f0f0f0 1px, transparent 1px),
       linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
       radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
       radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
     `,
          backgroundSize: "20px 20px, 20px 20px, 100% 100%, 100% 100%",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </div>
  );
}
