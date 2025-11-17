import React from "react";
import { Hero } from "@/components/Hero";
import { Header } from "@/components/ui/header";
import { FeaturedProfiles } from "@/components/landing/featured-profiles";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#18181a]">
      <Header />
      <main>
        <Hero />
        <FeaturedProfiles />
        <FeaturesSection />
        <PricingSection />
      </main>
      <FooterSection />
    </div>
  );
}
