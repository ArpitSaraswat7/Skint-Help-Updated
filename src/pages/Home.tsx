import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { ImpactSection } from "@/components/impact-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CoverageArea } from "@/components/coverage-area";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <CoverageArea />
      <ImpactSection />
      <TestimonialsSection />
    </main>
  );
} 