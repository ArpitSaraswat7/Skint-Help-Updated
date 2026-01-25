import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { ImpactSection } from "@/components/impact-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { MapSection } from "@/components/map-section";
import { PortalSection } from "@/components/portal-section";
import { CtaSection } from "@/components/cta-section";

export default function Index() {
    return (
        <>
            <HeroSection />
            <HowItWorks />
            <FeaturesSection />
            <ImpactSection />
            <TestimonialsSection />
            <MapSection />
            <PortalSection />
            <CtaSection />
        </>
    );
}
