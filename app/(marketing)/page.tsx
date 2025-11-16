import React from "react";
import { Hero } from "@/components/Hero";
import { Header } from "@/components/ui/header";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#18181a]">
      <Header />
      <main>
        <Hero />
        {/* Additional content can be added here if needed */}
      </main>
    </div>
  );
}
